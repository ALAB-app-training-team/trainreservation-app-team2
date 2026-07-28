package com.alab.shinkansendego.account;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AccountController.class)
public class AccountControllerTest {
    @MockitoBean
    private AccountService service;
    @Autowired
    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String baseUrl = "/api/";

    @Test
    @DisplayName("ログインできること")
    void login_return200AndAccount() throws Exception {
        String rawPassword = "Taro";
        String hashedPassword = "$2a$10$6gZt4xt3F2RnCytRMfqSSumEmrLtqVRpqvVhGAQfgUaxZXeUUWJ4C";
        AccountEntity account = new AccountEntity(UUID.randomUUID(), "Tarou", "a@a.com", hashedPassword);
        when(service.login(account.getMail(), rawPassword)).thenReturn(account);

        LoginRequestDto loginRequestDto = new LoginRequestDto(account.getMail(), rawPassword);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post(baseUrl + "login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequestDto)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").value(account.getName()))
            .andReturn();

        HttpSession session = result.getRequest().getSession(false);
        assertNotNull(session, "セッションが作成されていること");
        UUID idInSession = (UUID) session.getAttribute("LOGIN_ID");
        assertNotNull(idInSession, "LOGIN_IDという名前でセッションが保存されていること");
        assertEquals(idInSession, account.getId());
        String nameInSession = (String) session.getAttribute("LOGIN_NAME");
        assertNotNull(nameInSession, "LOGIN_NAMEという名前でセッションが保存されていること");
        assertEquals(nameInSession, account.getName());
        String mailInSession = (String) session.getAttribute("LOGIN_MAIL");
        assertNotNull(mailInSession, "LOGIN_MAILという名前でセッションが保存されていること");
        assertEquals(mailInSession, account.getMail());
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
}
