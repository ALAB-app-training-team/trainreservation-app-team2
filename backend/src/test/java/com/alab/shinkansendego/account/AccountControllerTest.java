package com.alab.shinkansendego.account;

import com.alab.shinkansendego.SecurityConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AccountController.class)
@Import(SecurityConfig.class)
public class AccountControllerTest {
    private Authentication commonAuth;
    private Authentication adminAuth;
    @MockitoBean
    private AccountService service;
    @Autowired
    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String baseUrl = "/api/";
    private final String rawPassword = "Password_11/";
    private final String hashedPassword = "$2a$10$6gZt4xt3F2RnCytRMfqSSumEmrLtqVRpqvVhGAQfgUaxZXeUUWJ4C";

    @BeforeEach
    void setUp() {
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        AccountSessionDto adminSession = new AccountSessionDto(
            UUID.fromString("d2cdf717-a35c-48d9-828e-0ce86e01d477"), "test-admin@test.com", "管理者"
        );
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
        adminAuth = new UsernamePasswordAuthenticationToken(adminSession, null, authorities);
        AccountSessionDto commonSession = new AccountSessionDto(
            UUID.fromString("f79d8bbc-fcba-b538-b132-2f726ce0120c"), "test-common@test.com", "一般太郎"
        );
        List<GrantedAuthority> commonAuthorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
        commonAuth = new UsernamePasswordAuthenticationToken(commonSession, null, commonAuthorities);
    }

    @Test
    @DisplayName("ログインできること")
    void login_return200AndAccount() throws Exception {
        AccountEntity account = new AccountEntity(UUID.randomUUID(), "Tarou", "a@a.com", hashedPassword, "ROLE_USER");
        when(service.login(account.getMail(), rawPassword)).thenReturn(account);

        LoginRequestDto loginRequestDto = new LoginRequestDto(account.getMail(), rawPassword);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post(baseUrl + "login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequestDto)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value(account.getName()))
            .andExpect(jsonPath("$.role").value(account.getRole()))
            .andReturn();

        MockHttpSession session = (MockHttpSession) result.getRequest().getSession(false);
        SecurityContext securityContext = (SecurityContext) session.getAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY);
        AccountSessionDto sessionAccount = (AccountSessionDto) securityContext.getAuthentication().getPrincipal();
        assertNotNull(sessionAccount, "セッションが作成されていること");
        assertEquals(sessionAccount.getId(), account.getId());
        assertEquals(sessionAccount.getName(), account.getName());
        assertEquals(sessionAccount.getMail(), account.getMail());
    }

    @Test
    @DisplayName("ログアウトできること")
    void logout_return204() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("LOGIN_ID", "login_id");

        mockMvc.perform(MockMvcRequestBuilders.post(baseUrl + "logout")
                .contentType(MediaType.APPLICATION_JSON)
                .session(session))
            .andExpect(status().isNoContent());
        assertTrue(session.isInvalid(), "セッションが破棄されていること");
    }

    @Test
    @DisplayName("アカウント作成できること")
    void insertAccount_return201() throws Exception {
        AccountRequestDto request = new AccountRequestDto("太郎", "a@a.com", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.post(baseUrl + "account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("リクエストの名前がNullの場合、バリデーションエラー発生")
    void insertAccount_withNameIsNull_returnValidationError() throws Exception {
        AccountRequestDto request = new AccountRequestDto(null, "a@a.com", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.post(baseUrl + "account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Name is Blank"));
    }

    @Test
    @DisplayName("リクエストの名前が空文字の場合、バリデーションエラー発生")
    void insertAccount_withNameIsEmpty_returnValidationError() throws Exception {
        AccountRequestDto request = new AccountRequestDto("", "a@a.com", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.post(baseUrl + "account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Name is Blank"));
    }

    @Test
    @DisplayName("リクエストのメールアドレスがNullの場合、バリデーションエラー発生")
    void insertAccount_withMailIsNull_returnValidationError() throws Exception {

        AccountRequestDto request = new AccountRequestDto("太郎", null, rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.post(baseUrl + "account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Mail is Null"));
    }

    @Test
    @DisplayName("リクエストのメールアドレスが空文字の場合、バリデーションエラー発生")
    void insertAccount_withMailIsEmpty_returnValidationError() throws Exception {

        AccountRequestDto request = new AccountRequestDto("太郎", "", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.post(baseUrl + "account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Mail is Empty"));
    }

    @Test
    @DisplayName("リクエストのメールアドレスが空白文字の場合、バリデーションエラー発生")
    void insertAccount_withMailIsBlank_returnValidationError() throws Exception {

        AccountRequestDto request = new AccountRequestDto("太郎", " ", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.post(baseUrl + "account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Mail is Blank"));
    }

    @Test
    @DisplayName("リクエストのメールアドレスが不正形式の場合、バリデーションエラー発生")
    void insertAccount_withInValidMail_returnValidationError() throws Exception {

        AccountRequestDto request = new AccountRequestDto("太郎", "aa@aa", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.post(baseUrl + "account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Mail is InValid"));
    }

    @Test
    @DisplayName("リクエストのパスワードがNullの場合、バリデーションエラー発生")
    void insertAccount_withPasswordIsNull_returnValidationError() throws Exception {

        AccountRequestDto request = new AccountRequestDto("太郎", "a@a.com", null);

        mockMvc.perform(MockMvcRequestBuilders.post(baseUrl + "account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is Null"));
    }

    @Test
    @DisplayName("リクエストのパスワードが空文字の場合、バリデーションエラー発生")
    void insertAccount_withPasswordIsEmpty_returnValidationError() throws Exception {

        AccountRequestDto request = new AccountRequestDto("太郎", "a@a.com", "");

        mockMvc.perform(MockMvcRequestBuilders.post(baseUrl + "account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is Empty"));
    }

    @Test
    @DisplayName("リクエストのパスワードが空白文字の場合、バリデーションエラー発生")
    void insertAccount_withPasswordIsBlank_returnValidationError() throws Exception {

        AccountRequestDto request = new AccountRequestDto("太郎", "a@a.com", " ");

        mockMvc.perform(MockMvcRequestBuilders.post(baseUrl + "account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is Blank"));
    }

    @Test
    @DisplayName("リクエストのパスワードに使えない文字が入っている場合、バリデーションエラー発生")
    void insertAccount_withContainUselessSymbol_returnValidationError() throws Exception {

        AccountRequestDto request = new AccountRequestDto("太郎", "a@a.com", "Pass|word1");

        mockMvc.perform(MockMvcRequestBuilders.post(baseUrl + "account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password Policy doesn't match"));
    }

    @Test
    @DisplayName("リクエストのパスワードが8文字未満の場合、バリデーションエラー発生")
    void insertAccount_withLessThan8_returnValidationError() throws Exception {

        AccountRequestDto request = new AccountRequestDto("太郎", "a@a.com", "Pass1");

        mockMvc.perform(MockMvcRequestBuilders.post(baseUrl + "account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is Less Than 8 Characters"));
    }

    @Test
    @DisplayName("リクエストのパスワードが64文字より多い場合、バリデーションエラー発生")
    void insertAccount_withMoreThan64_returnValidationError() throws Exception {

        AccountRequestDto request = new AccountRequestDto("太郎", "a@a.com", "Password12345678Password12345678Password12345678Password1234567899");

        mockMvc.perform(MockMvcRequestBuilders.post(baseUrl + "account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is More Than 64 Characters"));
    }

    @Test
    @DisplayName("リクエストのパスワードに大文字が入っていない場合、バリデーションエラー発生")
    void insertAccount_withNoContainUppercase_returnValidationError() throws Exception {

        AccountRequestDto request = new AccountRequestDto("太郎", "a@a.com", "password1");

        mockMvc.perform(MockMvcRequestBuilders.post(baseUrl + "account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password doesn't Contain Uppercase"));
    }

    @Test
    @DisplayName("リクエストのパスワードに小文字が入っていない場合、バリデーションエラー発生")
    void insertAccount_withNoContainLowercase_returnValidationError() throws Exception {

        AccountRequestDto request = new AccountRequestDto("太郎", "a@a.com", "PASSWORD1");

        mockMvc.perform(MockMvcRequestBuilders.post(baseUrl + "account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password doesn't Contain Lowercase"));
    }

    @Test
    @DisplayName("リクエストのパスワードに数字が入っていない場合、バリデーションエラー発生")
    void insertAccount_withNoContainNumber_returnValidationError() throws Exception {

        AccountRequestDto request = new AccountRequestDto("太郎", "a@a.com", "Password");

        mockMvc.perform(MockMvcRequestBuilders.post(baseUrl + "account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password doesn't Contain Number"));
    }

    @Test
    @DisplayName("リクエストDTO自体がNullの場合、バインドエラー発生")
    void insertAccount_withAccountRequestDtoIsNull_returnBindError() throws Exception {
        //バインド順が毎回異なるためエラーメッセージの比較は行わない
        mockMvc.perform(MockMvcRequestBuilders.post(baseUrl + "account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(null)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("ログイン中のアカウント情報を取得できること")
    void getAccount_return200AndAccount() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get(baseUrl + "account")
                .with(SecurityMockMvcRequestPostProcessors.authentication(commonAuth))
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("f79d8bbc-fcba-b538-b132-2f726ce0120c"))
            .andExpect(jsonPath("$.mail").value("test-common@test.com"))
            .andExpect(jsonPath("$.name").value("一般太郎"));
    }

    @Test
    @DisplayName("氏名・メールアドレスの変更できること")
    void updateAccount_return200() throws Exception {
        AccountUpdateDto request = new AccountUpdateDto("太郎", "a@a.com", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "account")
                .with(SecurityMockMvcRequestPostProcessors.authentication(commonAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("リクエストの氏名がNullの場合、バリデーションエラー発生")
    void updateAccount_withNameIsNull_returnValidationError() throws Exception {
        AccountRequestDto request = new AccountRequestDto(null, "a@a.com", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "account")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Name is Blank"));
    }

    @Test
    @DisplayName("リクエストのメールアドレスがNullの場合、バリデーションエラー発生")
    void updateAccount_withMailIsNull_returnValidationError() throws Exception {
        AccountRequestDto request = new AccountRequestDto("太郎", null, rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "account")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Mail is Null"));
    }

    @Test
    @DisplayName("リクエストのパスワードがNullの場合、バリデーションエラー発生")
    void updateAccount_withPasswordIsNull_returnValidationError() throws Exception {
        AccountRequestDto request = new AccountRequestDto("太郎", "a@a.com", null);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "account")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is Blank"));
    }

    @Test
    @DisplayName("リクエストの氏名が空文字の場合、バリデーションエラー発生")
    void updateAccount_withNameIsEmpty_returnValidationError() throws Exception {
        PasswordUpdateByAdminDto request = new PasswordUpdateByAdminDto("", "a@a.com", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "account")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Name is Blank"));
    }

    @Test
    @DisplayName("リクエストのメールアドレスが空文字の場合、バリデーションエラー発生")
    void updateAccount_withMailIsEmpty_returnValidationError() throws Exception {
        PasswordUpdateByAdminDto request = new PasswordUpdateByAdminDto("太郎", "", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "account")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Mail is Empty"));
    }

    @Test
    @DisplayName("リクエストのパスワードが空文字の場合、バリデーションエラー発生")
    void updateAccount_withPasswordIsEmpty_returnValidationError() throws Exception {
        PasswordUpdateByAdminDto request = new PasswordUpdateByAdminDto("太郎", "a@a.com", "");

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "account")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is Blank"));
    }

    @Test
    @DisplayName("リクエストの氏名が空白文字の場合、バリデーションエラー発生")
    void updateAccount_withNameIsBlank_returnValidationError() throws Exception {
        PasswordUpdateByAdminDto request = new PasswordUpdateByAdminDto(" ", "a@a.com", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "account")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Name is Blank"));
    }

    @Test
    @DisplayName("リクエストのメールアドレスが空白文字の場合、バリデーションエラー発生")
    void updateAccount_withMailIsBlank_returnValidationError() throws Exception {
        PasswordUpdateByAdminDto request = new PasswordUpdateByAdminDto("太郎", " ", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "account")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Mail is Blank"));
    }

    @Test
    @DisplayName("リクエストのパスワードが空白文字の場合、バリデーションエラー発生")
    void updateAccount_withPasswordIsBlank_returnValidationError() throws Exception {
        PasswordUpdateByAdminDto request = new PasswordUpdateByAdminDto("太郎", "a@a.com", " ");

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "account")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is Blank"));
    }

    @Test
    @DisplayName("リクエストの氏名が255文字より多いの場合、バリデーションエラー発生")
    void updateAccount_withNameIsMoreThan255_returnValidationError() throws Exception {
        PasswordUpdateByAdminDto request = new PasswordUpdateByAdminDto("a".repeat(256), "a@a.com", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "account")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Name is Over Limit Size"));
    }

    @Test
    @DisplayName("リクエストのメールアドレスが255文字より多いの場合、バリデーションエラー発生")
    void updateAccount_withMailIsMoreThan255_returnValidationError() throws Exception {
        PasswordUpdateByAdminDto request = new PasswordUpdateByAdminDto("太郎", "a".repeat(247) + "@test.com", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "account")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Mail is Over Limit Size"));
    }

    @Test
    @DisplayName("リクエストのメールアドレスの形式（~~@~~.~~）ではない場合、バリデーションエラー発生")
    void updateAccount_withInValidMail_returnValidationError() throws Exception {
        PasswordUpdateByAdminDto request = new PasswordUpdateByAdminDto("太郎", "aa@aa", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "account")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Mail is InValid"));
    }

    @Test
    @DisplayName("現在のパスワードがNullの場合、バリデーションエラー発生")
    void updatePassword_withCurrentPasswordIsNull_returnValidationError() throws Exception {
        PasswordUpdateDto request = new PasswordUpdateDto(null, "NewPassword1/");

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(commonAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is Blank"));
    }

    @Test
    @DisplayName("現在のパスワードが空文字の場合、バリデーションエラー発生")
    void updatePassword_withCurrentPasswordIsEmpty_returnValidationError() throws Exception {
        PasswordUpdateDto request = new PasswordUpdateDto("", "NewPassword1/");

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(commonAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is Blank"));
    }

    @Test
    @DisplayName("新しいパスワードがNullの場合、バリデーションエラー発生")
    void updatePassword_withNewPasswordIsNull_returnValidationError() throws Exception {
        PasswordUpdateDto request = new PasswordUpdateDto(rawPassword, null);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(commonAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is Null"));
    }

    @Test
    @DisplayName("新しいパスワードが空文字の場合、バリデーションエラー発生")
    void updatePassword_withNewPasswordIsEmpty_returnValidationError() throws Exception {
        PasswordUpdateDto request = new PasswordUpdateDto(rawPassword, "");

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(commonAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is Empty"));
    }

    @Test
    @DisplayName("新しいパスワードが空白文字の場合、バリデーションエラー発生")
    void updatePassword_withNewPasswordIsBlank_returnValidationError() throws Exception {
        PasswordUpdateDto request = new PasswordUpdateDto(rawPassword, " ");

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(commonAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is Blank"));
    }

    @Test
    @DisplayName("現在のパスワードが空白文字の場合、バリデーションエラー発生")
    void updatePassword_withCurrentPasswordIsBlank_returnValidationError() throws Exception {
        PasswordUpdateDto request = new PasswordUpdateDto(" ", "NewPassword1/");

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(commonAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is Blank"));
    }

    @Test
    @DisplayName("新しいパスワードが8文字未満の場合、バリデーションエラー発生")
    void updatePassword_withNewPasswordLessThan8_returnValidationError() throws Exception {
        PasswordUpdateDto request = new PasswordUpdateDto(rawPassword, "Pass1/");

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(commonAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is Less Than 8 Characters"));
    }

    @Test
    @DisplayName("新しいパスワードが64文字より多い場合、バリデーションエラー発生")
    void updatePassword_withNewPasswordMoreThan64_returnValidationError() throws Exception {
        String longPassword = "Password12345678Password12345678Password12345678Password1234567899/";
        PasswordUpdateDto request = new PasswordUpdateDto(rawPassword, longPassword);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(commonAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is More Than 64 Characters"));
    }

    @Test
    @DisplayName("新しいパスワードに大文字が入っていない場合、バリデーションエラー発生")
    void updatePassword_withNewPasswordNoContainUppercase_returnValidationError() throws Exception {
        PasswordUpdateDto request = new PasswordUpdateDto(rawPassword, "password123/");

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(commonAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password doesn't Contain Uppercase"));
    }

    @Test
    @DisplayName("新しいパスワードに小文字が入っていない場合、バリデーションエラー発生")
    void updatePassword_withNewPasswordNoContainLowercase_returnValidationError() throws Exception {
        PasswordUpdateDto request = new PasswordUpdateDto(rawPassword, "PASSWORD123/");

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(commonAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password doesn't Contain Lowercase"));
    }

    @Test
    @DisplayName("新しいパスワードに数字が入っていない場合、バリデーションエラー発生")
    void updatePassword_withNewPasswordNoContainNumber_returnValidationError() throws Exception {
        PasswordUpdateDto request = new PasswordUpdateDto(rawPassword, "PasswordWord/");

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(commonAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password doesn't Contain Number"));
    }

    @Test
    @DisplayName("新しいパスワードに使えない文字が入っている場合、バリデーションエラー発生")
    void updatePassword_withNewPasswordContainUselessSymbol_returnValidationError() throws Exception {
        PasswordUpdateDto request = new PasswordUpdateDto(rawPassword, "Pass|word123");

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(commonAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password Policy doesn't match"));
    }

    @Test
    @DisplayName("管理者が他アカウントのパスワードを変更できること")
    void updatePasswordByAdmin_return204() throws Exception {
        PasswordUpdateByAdminDto request = new PasswordUpdateByAdminDto("太郎", "a@a.com", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "admin/password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("リクエストの名前がNullの場合、バリデーションエラー発生")
    void updatePasswordByAdmin_withNameIsNull_returnValidationError() throws Exception {
        AccountRequestDto request = new AccountRequestDto(null, "a@a.com", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "admin/password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Name is Blank"));
    }

    @Test
    @DisplayName("リクエストの名前が空文字の場合、バリデーションエラー発生")
    void updatePasswordByAdmin_withNameIsEmpty_returnValidationError() throws Exception {
        AccountRequestDto request = new AccountRequestDto(null, "a@a.com", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "admin/password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Name is Blank"));
    }

    @Test
    @DisplayName("リクエストの名前が空白文字の場合、バリデーションエラー発生")
    void updatePasswordByAdmin_withNameIsBlank_returnValidationError() throws Exception {
        AccountRequestDto request = new AccountRequestDto("　", "a@a.com", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "admin/password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Name is Blank"));
    }

    @Test
    @DisplayName("リクエストのメールアドレスがNullの場合、バリデーションエラー発生")
    void updatePasswordByAdmin_withMailIsNull_returnValidationError() throws Exception {
        AccountRequestDto request = new AccountRequestDto("太郎", null, rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "admin/password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Mail is Blank"));
    }

    @Test
    @DisplayName("リクエストのメールアドレスが空文字の場合、バリデーションエラー発生")
    void updatePasswordByAdmin_withMailIsEmpty_returnValidationError() throws Exception {
        AccountRequestDto request = new AccountRequestDto("太郎", "", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "admin/password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Mail is Blank"));
    }

    @Test
    @DisplayName("リクエストのメールアドレスが空白文字の場合、バリデーションエラー発生")
    void updatePasswordByAdmin_withMailIsBlank_returnValidationError() throws Exception {
        AccountRequestDto request = new AccountRequestDto("太郎", "　", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "admin/password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Mail is Blank"));
    }

    @Test
    @DisplayName("リクエストのパスワードがNullの場合、バリデーションエラー発生")
    void updatePasswordByAdmin_withPasswordIsNull_returnValidationError() throws Exception {
        AccountRequestDto request = new AccountRequestDto("太郎", "a@a.com", null);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "admin/password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is Null"));
    }

    @Test
    @DisplayName("リクエストのパスワードが空文字の場合、バリデーションエラー発生")
    void updatePasswordByAdmin_withPasswordIsEmpty_returnValidationError() throws Exception {
        AccountRequestDto request = new AccountRequestDto("太郎", "a@a.com", "");

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "admin/password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is Empty"));
    }

    @Test
    @DisplayName("リクエストのパスワードが空白文字の場合、バリデーションエラー発生")
    void updatePasswordByAdmin_withPasswordIsBlank_returnValidationError() throws Exception {
        AccountRequestDto request = new AccountRequestDto("太郎", "a@a.com", " ");

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "admin/password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is Blank"));
    }

    @Test
    @DisplayName("リクエストのパスワードに使えない文字が入っている場合、バリデーションエラー発生")
    void updatePasswordByAdmin_withContainUselessSymbol_returnValidationError() throws Exception {
        AccountRequestDto request = new AccountRequestDto("太郎", "a@a.com", "Pass|word1");

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "admin/password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth)).contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password Policy doesn't match"));
    }

    @Test
    @DisplayName("リクエストのパスワードが8文字未満の場合、バリデーションエラー発生")
    void updatePasswordByAdmin_withLessThan8_returnValidationError() throws Exception {
        AccountRequestDto request = new AccountRequestDto("太郎", "a@a.com", "Pass1");

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "admin/password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth)).contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is Less Than 8 Characters"));
    }

    @Test
    @DisplayName("リクエストのパスワードが64文字より多い場合、バリデーションエラー発生")
    void updatePasswordByAdmin_withMoreThan64_returnValidationError() throws Exception {
        AccountRequestDto request = new AccountRequestDto("太郎", "a@a.com", "Password12345678Password12345678Password12345678Password1234567899");

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "admin/password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth)).contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password is More Than 64 Characters"));
    }

    @Test
    @DisplayName("リクエストのパスワードに大文字が入っていない場合、バリデーションエラー発生")
    void updatePasswordByAdmin_withNoContainUppercase_returnValidationError() throws Exception {
        AccountRequestDto request = new AccountRequestDto("太郎", "a@a.com", "password1");

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "admin/password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth)).contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password doesn't Contain Uppercase"));
    }

    @Test
    @DisplayName("リクエストのパスワードに小文字が入っていない場合、バリデーションエラー発生")
    void updatePasswordByAdmin_withNoContainLowercase_returnValidationError() throws Exception {
        AccountRequestDto request = new AccountRequestDto("太郎", "a@a.com", "PASSWORD1");

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "admin/password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth)).contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password doesn't Contain Lowercase"));
    }

    @Test
    @DisplayName("リクエストのパスワードに数字が入っていない場合、バリデーションエラー発生")
    void updatePasswordByAdmin_withNoContainNumber_returnValidationError() throws Exception {
        AccountRequestDto request = new AccountRequestDto("太郎", "a@a.com", "Password");

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "admin/password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth)).contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Password doesn't Contain Number"));
    }

    @Test
    @DisplayName("リクエストDTO自体がNullの場合、バインドエラー発生")
    void updatePasswordByAdmin_withRequestIsNull_returnBindError() throws Exception {
        //バインド順が毎回異なるためエラーメッセージの比較は行わない
        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "admin/password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(adminAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(null)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("一般ユーザーが他アカウントのパスワードを変更できないこと")
    void updatePasswordByAdmin_withCommonAccount_return403() throws Exception {
        PasswordUpdateByAdminDto request = new PasswordUpdateByAdminDto("太郎", "a@a.com", rawPassword);

        mockMvc.perform(MockMvcRequestBuilders.put(baseUrl + "admin/password")
                .with(SecurityMockMvcRequestPostProcessors.authentication(commonAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isForbidden());
    }
}
