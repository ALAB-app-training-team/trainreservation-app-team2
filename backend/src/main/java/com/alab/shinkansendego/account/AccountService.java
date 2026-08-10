package com.alab.shinkansendego.account;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

    public AccountEntity login(String mail, String password) {
        AccountEntity account = accountRepository.findByMail(mail).orElseThrow(() -> new BadCredentialsException("login is failed"));
        boolean matches = passwordEncoder.matches(password, account.getPassword());
        if (!matches) {
            throw new BadCredentialsException("login is failed");
        }
        return account;
    }

    public String create(AccountRequestDto request) {
        Optional<AccountEntity> account = accountRepository.findByMail(request.getMail());
        if (account.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, request.getMail());
        }

        AccountEntity createAccount = new AccountEntity(
            UUID.randomUUID(),
            removeSpaces(request.getName()),
            removeSpaces(request.getMail()),
            passwordEncoder.encode(request.getPassword()));

        return accountRepository.save(createAccount).getMail();
    }
}
