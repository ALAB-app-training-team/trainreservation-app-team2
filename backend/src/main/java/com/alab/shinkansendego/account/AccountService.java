package com.alab.shinkansendego.account;

import com.alab.shinkansendego.exception.ConflictException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

import static com.alab.shinkansendego.utils.StringUtils.removeSpaces;

@Service
public class AccountService {
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;

    @Autowired
    public AccountService(AccountRepository accountRepository,
                          PasswordEncoder passwordEncoder,
                          ApplicationEventPublisher eventPublisher) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.eventPublisher = eventPublisher;
    }

    /**
     * アカウントログインを行うメソッド
     *
     * @param mail     リクエストされたメールアドレス
     * @param password リクエストされたパスワード
     * @return アカウント情報
     */
    public AccountEntity login(String mail, String password) {
        AccountEntity account = accountRepository.findByMail(mail).orElseThrow(() -> new BadCredentialsException("login is failed"));

        boolean matches = passwordEncoder.matches(password, account.getPassword());
        if (!matches) {
            throw new BadCredentialsException("login is failed");
        }
        return account;
    }

    /**
     * ログイン中のアカウント情報取得メソッド
     *
     * @param userId ログイン中のアカウントID
     * @return ログイン中のアカウント情報
     */
    @Transactional(readOnly = true)
    public AccountSessionDto getAccount(UUID userId) {
        AccountEntity account = accountRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("Account is not found"));

        return new AccountSessionDto(
            account.getId(),
            account.getMail(),
            account.getName()
        );
    }

    /**
     * アカウント新規作成を行うメソッド
     *
     * @param request 登録するアカウント情報
     */
    @Transactional
    public void insertAccount(AccountRequestDto request) {
        Optional<AccountEntity> account = accountRepository.findByMail(request.getMail());
        if (account.isPresent()) {
            throw new ConflictException(request.getMail() + " is Duplicate");
        }

        AccountEntity postAccount = new AccountEntity(
            UUID.randomUUID(),
            removeSpaces(request.getName()),
            removeSpaces(request.getMail()),
            passwordEncoder.encode(request.getPassword()),
            "ROLE_USER"
        );

        accountRepository.save(postAccount);

        eventPublisher.publishEvent(new AccountCreatedEvent(
            new AccountRequestDto(postAccount.getName(), postAccount.getMail(), null)
        ));
    }

    /**
     * アカウント情報変更メソッド
     *
     * @param request 変更するアカウント情報
     */
    @Transactional
    public UUID putAccount(UUID userId, AccountUpdateDto request) {
        AccountEntity account = accountRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("Account is not found"));

        if (!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            throw new IllegalArgumentException("Password does not match");
        }

        String newMail = removeSpaces(request.getMail());
        Optional<AccountEntity> duplicateAccount = accountRepository.findByMail(newMail);

        if (duplicateAccount.isPresent()
            && !duplicateAccount.get().getId().equals(userId)) {
            throw new ConflictException(newMail + " is Duplicate");
        }

        AccountRequestDto oldAccountInfo = new AccountRequestDto(account.getName(), account.getMail(), null);

        account.setName(removeSpaces(request.getName()));
        account.setMail(newMail);

        AccountEntity updatedAccount = accountRepository.save(account);

        eventPublisher.publishEvent(new AccountUpdatedEvent(
            new AccountRequestDto(updatedAccount.getName(), updatedAccount.getMail(), null),
            oldAccountInfo
        ));
        return updatedAccount.getId();
    }

    /**
     * パスワード変更メソッド
     *
     * @param request 変更する新しいパスワードと現在のパスワード情報
     */
    @Transactional
    public UUID putPassword(UUID userId, PasswordUpdateDto request) {
        AccountEntity account = accountRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("Account is not found"));

        if (!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            throw new IllegalArgumentException("Password does not match");
        }

        account.setPassword(passwordEncoder.encode(request.getNewPassword()));

        AccountEntity updatedAccount = accountRepository.save(account);

        eventPublisher.publishEvent(new PasswordUpdatedEvent(
            new AccountRequestDto(updatedAccount.getName(), updatedAccount.getMail(), null)
        ));
        return updatedAccount.getId();
    }

    /**
     * 管理者が一般アカウントのパスワード変更を行うメソッド
     *
     * @param request アカウント情報と新しいパスワード
     */
    @Transactional
    public void updatePasswordByAdmin(PasswordUpdateByAdminDto request) {
        AccountEntity account = accountRepository.findByNameAndMail(request.getName(), request.getMail())
            .orElseThrow(() -> new IllegalArgumentException("Account not Found"));
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        accountRepository.save(account);
    }
}
