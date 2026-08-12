package com.alab.shinkansendego.account;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
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

    /**
     * アカウントログインを行うメソッド
     *
     * @param request リクエストされたログイン情報
     * @param session ログインセッション
     * @return ログインユーザー名
     */
    @PostMapping("login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequestDto request, HttpSession session) {
        AccountEntity account = accountService.login(request.getMail(), request.getPassword());
        // セッション作成
        AccountSessionDto res = new AccountSessionDto(account.getId(), account.getMail(), account.getName());
        Authentication authentication = new UsernamePasswordAuthenticationToken(res, null, Collections.emptyList());
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

        return ResponseEntity.ok(account.getName());
    }

    /**
     * アカウントログアウトを行うメソッド
     *
     * @param session ログインセッション
     * @return NoContent
     */
    @PostMapping("logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build();
    }

    /**
     * アカウント新規作成メソッド
     *
     * @param request 登録するアカウント情報
     * @return 登録したメールアドレス
     */
    @PostMapping("account")
    public ResponseEntity<String> insertAccount(@Valid @RequestBody AccountRequestDto request) {
        String mail = accountService.insertAccount(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(mail);
    }
}
