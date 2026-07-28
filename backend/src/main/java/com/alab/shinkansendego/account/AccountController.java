package com.alab.shinkansendego.account;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.CookieClearingLogoutHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
@RequestMapping(path = "api")
public class AccountController {
    private final AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequestDto request) {
        AccountEntity account = accountService.login(request.getMail(), request.getPassword());
        // セッション作成
        AccountSessionDto res = new AccountSessionDto(account.getId(), account.getMail(), account.getName());
        Authentication authentication = new UsernamePasswordAuthenticationToken(res, null, Collections.emptyList());
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        return ResponseEntity.ok(account.getName());
    }

    @PostMapping("logout")
    public ResponseEntity logout(HttpSecurity http) {
        CookieClearingLogoutHandler cookies = new CookieClearingLogoutHandler("our-custom-cookie");
        http.logout((logout) -> logout.addLogoutHandler(cookies));
//        SecurityContextHolder.clearContext(); // セッションの無効化
        return ResponseEntity.noContent().build();
    }
}
