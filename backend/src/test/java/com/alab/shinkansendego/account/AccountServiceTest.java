package com.alab.shinkansendego.account;

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
import static org.mockito.Mockito.when;

public class AccountServiceTest {
    private AccountService service;
    @Mock
    private AccountRepository accountRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        this.service = new AccountService(accountRepository, passwordEncoder);
    }

    @Test
    @DisplayName("ログインできること")
    void login_withReserverNameAndEmail_returnGetReservationListSuccess() {
        String mail = "a@a.com";
        String rawPassword = "Taro";
        String hashedPassword = "$2a$10$6gZt4xt3F2RnCytRMfqSSumEmrLtqVRpqvVhGAQfgUaxZXeUUWJ4C";
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
        String mail = "a@a.com";
        String rawPassword = "Taro";
        BadCredentialsException exception = assertThrows(BadCredentialsException.class, () -> service.login(mail, rawPassword));
        assertEquals("login is failed", exception.getMessage());
    }

    @Test
    @DisplayName("入力されたパスワードとDB内のパスワードが合致しないとBadCredentialsExceptionが発生する")
    void login_withNotMatchPassword_throwsBadCredentialsException() {
        String mail = "a@a.com";
        String rawPassword = "Taro";
        String notMatchHashedPassword = "notMatchHashedPassword";
        AccountEntity account = new AccountEntity(UUID.randomUUID(), "Tarou", mail, notMatchHashedPassword);

        when(accountRepository.findByMail(mail)).thenReturn(Optional.of(account));
        when(passwordEncoder.matches(rawPassword, notMatchHashedPassword)).thenReturn(false);

        BadCredentialsException exception = assertThrows(BadCredentialsException.class, () -> service.login(mail, rawPassword));
        assertEquals("login is failed", exception.getMessage());
    }
}
