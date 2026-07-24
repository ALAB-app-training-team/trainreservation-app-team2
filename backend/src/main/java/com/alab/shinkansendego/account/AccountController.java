package com.alab.shinkansendego.account;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(path = "api")
public class AccountController {
    private final AccountService accountService;

    @PostMapping("login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDto request, HttpServletRequest httpServletRequest) {
        AccountEntity account = accountService.login(request.getMail(), request.getPassword());
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("ログイン失敗");
        }
        // セッション作成
        HttpSession session = httpServletRequest.getSession(true);
        session.setAttribute("LOGIN_ADMIN", account);
        return ResponseEntity.ok(account);
    }
}
