package com.shinkansendego.demo.feature.account.servicies;

import com.shinkansendego.demo.feature.account.entities.AccountEntity;
import com.shinkansendego.demo.feature.account.repositories.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountService {
    private final AccountRepository accountRepository;

    @Autowired
    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public List<AccountEntity> findAllAccounts() {
        return accountRepository.findAllAccounts();
    }
}
