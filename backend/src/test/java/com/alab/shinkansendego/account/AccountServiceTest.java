package com.alab.shinkansendego.account;

import com.alab.shinkansendego.exception.ConflictException;
import com.alab.shinkansendego.reservation.ReservationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class AccountServiceTest {
    private AccountService service;
    @Mock
    private AccountRepository accountRepository;
    @Mock
    private ReservationRepository reservationRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    private final String mail = "a@a.com";
    private final String rawPassword = "Password_11/";
    private final String hashedPassword = "$2a$10$6gZt4xt3F2RnCytRMfqSSumEmrLtqVRpqvVhGAQfgUaxZXeUUWJ4C";
    private final String notMatchHashedPassword = "notMatchHashedPassword";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        this.service = new AccountService(accountRepository, reservationRepository, passwordEncoder);
    }

    @Test
    @DisplayName("ログインできること")
    void login_withReserverNameAndEmail_returnGetReservationListSuccess() {
        AccountEntity account = new AccountEntity(UUID.randomUUID(), "Tarou", "a@a.com", hashedPassword, "ROLE_USER");

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
        AccountEntity account = new AccountEntity(UUID.randomUUID(), "Tarou", mail, notMatchHashedPassword, "ROLE_USER");

        when(accountRepository.findByMail(mail)).thenReturn(Optional.of(account));
        when(passwordEncoder.matches(rawPassword, notMatchHashedPassword)).thenReturn(false);

        BadCredentialsException exception = assertThrows(BadCredentialsException.class, () -> service.login(mail, rawPassword));
        assertEquals("login is failed", exception.getMessage());
    }

    @Test
    @DisplayName("ログイン中のアカウント情報を取得できること")
    void getAccount_withCurrentUserId_returnAccountSessionDto() {
        UUID uuid = UUID.randomUUID();

        Optional<AccountEntity> account = Optional.of(
            new AccountEntity(
                uuid,
                "太郎",
                mail,
                hashedPassword,
                "ROLE_USER"
            )
        );

        when(accountRepository.findById(uuid)).thenReturn(account);

        AccountSessionDto result = service.getAccount(uuid);

        assertEquals(uuid, result.getId());
        assertEquals(mail, result.getMail());
        assertEquals("太郎", result.getName());
    }

    @Test
    @DisplayName("ログイン中のアカウントが存在しない場合、IllegalArgumentExceptionを投げること")
    void getAccount_withNoExistAccount_throwIllegalArgumentException() {
        UUID uuid = UUID.randomUUID();

        when(accountRepository.findById(uuid)).thenReturn(Optional.empty());

        Exception ex = assertThrows(
            IllegalArgumentException.class,
            () -> service.getAccount(uuid)
        );

        assertEquals("Account is not found", ex.getMessage());
    }

    @Test
    @DisplayName("アカウント作成できること")
    void insertAccount_withAccountRequestDto_returnAccountInsertAccountSuccess() {
        AccountRequestDto request = new AccountRequestDto("太郎", mail, rawPassword);
        Optional<AccountEntity> account = Optional.empty();
        AccountEntity savedAccount = new AccountEntity(UUID.randomUUID(), "太郎", mail, hashedPassword, "ROLE_USER");

        when(accountRepository.findByMail(mail)).thenReturn(account);
        when(passwordEncoder.encode(rawPassword)).thenReturn(hashedPassword);
        when(accountRepository.save(any())).thenReturn(savedAccount);

        service.insertAccount(request);
        verify(accountRepository).save(any());
    }

    @Test
    @DisplayName("登録済メールアドレスがリクエストされた場合、CONFLICTを発生させる")
    void insertAccount_withExistMail_return409() {
        AccountRequestDto request = new AccountRequestDto("太郎", mail, rawPassword);
        Optional<AccountEntity> account = Optional.of(new AccountEntity(UUID.randomUUID(), "太郎", mail, hashedPassword, "ROLE_USER"));

        when(accountRepository.findByMail(mail)).thenReturn(account);

        ConflictException exception = assertThrows(ConflictException.class, () -> service.insertAccount(request));
        assertEquals(mail + " is Duplicate", exception.getReason());
    }

    @Test
    @DisplayName("一般ユーザーがアカウント情報を変更できること")
    void putAccount_withDto_returnSuccess() {
        UUID uuid = UUID.randomUUID();
        AccountUpdateDto dto = new AccountUpdateDto("太郎", "b@b.com", rawPassword);
        Optional<AccountEntity> account = Optional.of(new AccountEntity(uuid, "元太郎", mail, hashedPassword, "ROLE_USER"));

        when(accountRepository.findById(uuid)).thenReturn(account);
        when(passwordEncoder.matches(rawPassword, hashedPassword)).thenReturn(true);
        when(accountRepository.findByMail("b@b.com")).thenReturn(Optional.empty());
        when(accountRepository.save(any())).thenReturn(account.get());

        assertEquals(uuid, service.putAccount(uuid, dto));
        verify(accountRepository).save(any());
    }

    @Test
    @DisplayName("一般ユーザーのアカウントが存在しないときIllegalArgumentExceptionを投げること")
    void putAccount_withNoExistAccount_throwIllegalArgumentException() {
        UUID uuid = UUID.randomUUID();
        AccountUpdateDto dto = new AccountUpdateDto("太郎", mail, rawPassword);

        when(accountRepository.findById(uuid)).thenReturn(Optional.empty());

        Exception ex = assertThrows(IllegalArgumentException.class, () -> service.putAccount(uuid, dto));
        assertEquals("Account is not found", ex.getMessage());
    }

    @Test
    @DisplayName("一般ユーザーのアカウント情報変更で認証パスワードが誤っているときIllegalArgumentExceptionを投げること")
    void putAccount_withIncorrectPassword_throwIllegalArgumentException() {
        UUID uuid = UUID.randomUUID();
        AccountUpdateDto dto = new AccountUpdateDto("太郎", "b@b.com", rawPassword);
        Optional<AccountEntity> account = Optional.of(new AccountEntity(uuid, "元太郎", mail, hashedPassword, "ROLE_USER"));

        when(accountRepository.findById(uuid)).thenReturn(account);
        when(passwordEncoder.matches(rawPassword, hashedPassword)).thenReturn(false);

        Exception ex = assertThrows(IllegalArgumentException.class, () -> service.putAccount(uuid, dto));
        assertEquals("Password does not match", ex.getMessage());
    }

    @Test
    @DisplayName("一般ユーザーのアカウント情報変更で変更先のメールアドレスが既に登録済みのときConflictExceptionを投げること")
    void putAccount_withExistSameMailAddress_throwConflictException() {
        UUID uuid = UUID.randomUUID();
        String newMail = "b@b.com";
        AccountUpdateDto dto = new AccountUpdateDto("太郎", newMail, rawPassword);
        Optional<AccountEntity> account = Optional.of(new AccountEntity(uuid, "元太郎", mail, hashedPassword, "ROLE_USER"));
        Optional<AccountEntity> otherAccount = Optional.of(new AccountEntity(UUID.randomUUID(), "別太郎", newMail, hashedPassword, "ROLE_USER"));

        when(accountRepository.findById(uuid)).thenReturn(account);
        when(passwordEncoder.matches(rawPassword, hashedPassword)).thenReturn(true);
        when(accountRepository.findByMail(newMail)).thenReturn(otherAccount);

        ConflictException ex = assertThrows(ConflictException.class, () -> service.putAccount(uuid, dto));
        assertEquals(newMail + " is Duplicate", ex.getReason());
    }

    @Test
    @DisplayName("一般ユーザーのパスワード変更ができること")
    void putPassword_withDto_returnSuccess() {
        UUID uuid = UUID.randomUUID();
        String newPassword = "Password_12/";
        PasswordUpdateDto dto = new PasswordUpdateDto(rawPassword, newPassword);
        Optional<AccountEntity> account = Optional.of(new AccountEntity(uuid, "太郎", mail, hashedPassword, "ROLE_USER"));

        when(accountRepository.findById(uuid)).thenReturn(account);
        when(passwordEncoder.matches(rawPassword, hashedPassword)).thenReturn(true);
        when(passwordEncoder.encode(newPassword)).thenReturn("newHashedPassword");
        when(accountRepository.save(any())).thenReturn(account.get());

        assertEquals(uuid, service.putPassword(uuid, dto));
    }

    @Test
    @DisplayName("一般ユーザーのパスワード変更でアカウントが存在しないときIllegalArgumentExceptionを投げること")
    void putPassword_withNoExistAccount_throwIllegalArgumentException() {
        UUID uuid = UUID.randomUUID();
        String newPassword = "Password_12/";
        PasswordUpdateDto dto = new PasswordUpdateDto(rawPassword, newPassword);

        when(accountRepository.findById(uuid)).thenReturn(Optional.empty());

        Exception ex = assertThrows(IllegalArgumentException.class, () -> service.putPassword(uuid, dto));
        assertEquals("Account is not found", ex.getMessage());
    }

    @Test
    @DisplayName("一般ユーザーのパスワード変更で認証パスワードが誤っているときIllegalArgumentExceptionを投げること")
    void putPassword_withIncorrectPassword_throwIllegalArgumentException() {
        UUID uuid = UUID.randomUUID();
        String newPassword = "Password_12/";
        PasswordUpdateDto dto = new PasswordUpdateDto(rawPassword, newPassword);
        Optional<AccountEntity> account = Optional.of(new AccountEntity(uuid, "太郎", mail, hashedPassword, "ROLE_USER"));

        when(accountRepository.findById(uuid)).thenReturn(account);
        when(passwordEncoder.matches(rawPassword, hashedPassword)).thenReturn(false);

        Exception ex = assertThrows(IllegalArgumentException.class, () -> service.putPassword(uuid, dto));
        assertEquals("Password does not match", ex.getMessage());
    }

    @Test
    @DisplayName("管理者が他アカウントのパスワードを変更できること")
    void updatePasswordByAdmin_withDto_returnSuccess() {
        PasswordUpdateByAdminDto request = new PasswordUpdateByAdminDto("太郎", mail, rawPassword);
        Optional<AccountEntity> account = Optional.of(new AccountEntity(UUID.randomUUID(), "太郎", mail, hashedPassword, "ROLE_USER"));

        when(accountRepository.findByNameAndMail(request.getName(), request.getMail())).thenReturn(account);
        when(passwordEncoder.encode(rawPassword)).thenReturn("newHashedPassword");

        service.updatePasswordByAdmin(request);
        assertEquals("newHashedPassword", account.get().getPassword());
        verify(accountRepository).save(any());
    }

    @Test
    @DisplayName("対象のアカウントが存在しない場合、IllegalArgumentExceptionを投げること")
    void updatePasswordByAdmin_withNotExistAccount_throwIllegalArgumentException() {
        PasswordUpdateByAdminDto request = new PasswordUpdateByAdminDto("太郎", mail, rawPassword);
        Optional<AccountEntity> account = Optional.of(new AccountEntity(UUID.randomUUID(), "太郎", mail, hashedPassword, "ROLE_USER"));
        when(accountRepository.findByNameAndMail(request.getName(), request.getMail())).thenReturn(Optional.empty());

        Exception ex = assertThrows(IllegalArgumentException.class, () -> service.updatePasswordByAdmin(request));
        assertEquals("Account not Found", ex.getMessage());
    }

    @Test
    @DisplayName("有効な予約がない場合、アカウント削除できること")
    void deleteAccount_withNoActiveReservation_returnSuccess() {
        UUID accountId = UUID.randomUUID();

        when(reservationRepository.existsByAccountIdAndIsDeletedFalseAndRideDateGreaterThanEqual(accountId, LocalDate.now()))
            .thenReturn(false);

        service.deleteAccount(accountId);

        verify(reservationRepository)
            .existsByAccountIdAndIsDeletedFalseAndRideDateGreaterThanEqual(accountId, LocalDate.now());
        verify(accountRepository).deleteById(accountId);
    }

    @Test
    @DisplayName("未キャンセルかつ今日以降の予約がある場合、ConflictExceptionを投げること")
    void deleteAccount_withActiveReservation_throwConflictException() {
        UUID accountId = UUID.randomUUID();

        when(reservationRepository.existsByAccountIdAndIsDeletedFalseAndRideDateGreaterThanEqual(accountId, LocalDate.now()))
            .thenReturn(true);

        ConflictException exception = assertThrows(
            ConflictException.class,
            () -> service.deleteAccount(accountId)
        );

        assertEquals("予約中のきっぷがあるため、退会できません。", exception.getReason());

        verify(accountRepository, never()).deleteById(accountId);
    }
}
