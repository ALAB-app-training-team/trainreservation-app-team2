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
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequestDto request, HttpServletRequest httpServletRequest) {
        AccountEntity account = accountService.login(request.getMail(), request.getPassword());
        // セッション作成
        HttpSession session = httpServletRequest.getSession(true);
        session.setAttribute("LOGIN_ID", account.getId());
        session.setAttribute("LOGIN_MAIL", account.getMail());
        session.setAttribute("LOGIN_NAME", account.getName());
        return ResponseEntity.ok(account.getName());
    }

    @PostMapping("logout")
    public ResponseEntity logout(HttpSession session) {
        session.invalidate(); // セッションの無効化
        return ResponseEntity.noContent().build();
    }
}
