package com.alab.shinkansendego.account;

import com.alab.shinkansendego.exception.ConflictException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class AccountServiceTest {
    private AccountService service;
    @Mock
    private AccountRepository accountRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    private final String mail = "a@a.com";
    private final String rawPassword = "Password_11/";
    private final String hashedPassword = "$2a$10$6gZt4xt3F2RnCytRMfqSSumEmrLtqVRpqvVhGAQfgUaxZXeUUWJ4C";
    private final String notMatchHashedPassword = "notMatchHashedPassword";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        this.service = new AccountService(accountRepository, passwordEncoder);
    }

    @Test
    @DisplayName("ログインできること")
    void login_withReserverNameAndEmail_returnGetReservationListSuccess() {
        AccountEntity account = new AccountEntity(UUID.randomUUID(), "Tarou", "a@a.com", hashedPassword);

        when(accountRepository.findByMail(mail)).thenReturn(Optional.of(account));
        when(passwordEncoder.matches(rawPassword, hashedPassword)).thenReturn(true);

        AccountEntity result = service.login(mail, rawPassword);
        assertEquals(result.getMail(), account.getMail());
        assertEquals(result.getPassword(), account.getPassword());
    }

    @Test
    @DisplayName("AccountEntityがないとBadCredentialsExceptionが発生する")
    void login_withNotExistAccountEntity_throwsBadCredentialsException() {
        BadCredentialsException exception = assertThrows(BadCredentialsException.class, () -> service.login(mail, rawPassword));
        assertEquals("login is failed", exception.getMessage());
    }

    @Test
    @DisplayName("入力されたパスワードとDB内のパスワードが合致しないとBadCredentialsExceptionが発生する")
    void login_withNotMatchPassword_throwsBadCredentialsException() {
        AccountEntity account = new AccountEntity(UUID.randomUUID(), "Tarou", mail, notMatchHashedPassword);

        when(accountRepository.findByMail(mail)).thenReturn(Optional.of(account));
        when(passwordEncoder.matches(rawPassword, notMatchHashedPassword)).thenReturn(false);

        BadCredentialsException exception = assertThrows(BadCredentialsException.class, () -> service.login(mail, rawPassword));
        assertEquals("login is failed", exception.getMessage());
    }

    @Test
    @DisplayName("アカウント作成できること")
    void create_withAccountRequestDto_returnAccountInsertAccountSuccess() {
        AccountRequestDto request = new AccountRequestDto("太郎", mail, rawPassword);
        Optional<AccountEntity> account = Optional.empty();
        AccountEntity savedAccount = new AccountEntity(UUID.randomUUID(), "太郎", mail, hashedPassword);

        when(accountRepository.findByMail(mail)).thenReturn(account);
        when(passwordEncoder.encode(rawPassword)).thenReturn(hashedPassword);
        when(accountRepository.save(any())).thenReturn(savedAccount);

        String result = service.insertAccount(request);
        assertEquals(result, request.getMail());
    }

    @Test
    @DisplayName("登録済メールアドレスがリクエストされた場合、CONFLICTを発生させる")
    void insertAccount_withExistMail_return409() {
        AccountRequestDto request = new AccountRequestDto("太郎", mail, rawPassword);
        Optional<AccountEntity> account = Optional.of(new AccountEntity(UUID.randomUUID(), "太郎", mail, hashedPassword));

        when(accountRepository.findByMail(mail)).thenReturn(account);

        ConflictException exception = assertThrows(ConflictException.class, () -> service.insertAccount(request));
        assertEquals(mail + " is Duplicate", exception.getReason());
    }
}
