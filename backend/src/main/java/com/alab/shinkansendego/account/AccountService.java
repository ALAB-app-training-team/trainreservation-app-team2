package com.alab.shinkansendego.account;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AccountService {
    private final AccountRepository accountRepository;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public AccountEntity login(String mail, String password) {
        AccountEntity account = accountRepository.findByMail(mail).orElseThrow(() -> new BadCredentialsException("login is failed"));
        boolean matches = passwordEncoder.matches(password, account.getPassword());
        if (!matches) {
            throw new BadCredentialsException("login is failed");
        }

        return account;
    }
}
