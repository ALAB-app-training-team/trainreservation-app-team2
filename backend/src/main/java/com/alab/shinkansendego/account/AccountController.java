package com.alab.shinkansendego.account;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api")
public class AccountController {
    private final AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("login")
    public ResponseEntity<AccountEntity> login(@Valid @RequestBody LoginRequestDto request, HttpServletRequest httpServletRequest) {
        AccountEntity account = accountService.login(request.getMail(), request.getPassword());
        // セッション作成
        HttpSession session = httpServletRequest.getSession(true);
        session.setAttribute("LOGIN_ADMIN", account);
        return ResponseEntity.ok(account);
    }
}
