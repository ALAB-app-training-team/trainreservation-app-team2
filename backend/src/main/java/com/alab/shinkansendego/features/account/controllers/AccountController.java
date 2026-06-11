package com.alab.shinkansendego.features.account.controllers;

import com.alab.shinkansendego.features.account.entities.AccountEntity;
import com.alab.shinkansendego.features.account.servicies.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "api/accounts")
public class AccountController {
    private final AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public List<AccountEntity> getAccounts() {
        return accountService.findAllAccounts();
    }

}
