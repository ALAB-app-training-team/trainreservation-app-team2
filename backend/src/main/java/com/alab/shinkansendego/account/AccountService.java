package com.alab.shinkansendego.account;

import com.alab.shinkansendego.exception.ConflictException;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    public AccountService(AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
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
            "common"
        );

        accountRepository.save(postAccount);
    }
}
