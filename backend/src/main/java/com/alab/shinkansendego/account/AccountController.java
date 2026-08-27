package com.alab.shinkansendego.account;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

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
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto request, HttpSession session) {
        AccountEntity account = accountService.login(request.getMail(), request.getPassword());

        AccountSessionDto accountSession = new AccountSessionDto(account.getId(), account.getMail(), account.getName());
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(account.getRole()));
        saveAccountToSession(session, accountSession, authorities);

        return ResponseEntity.ok(new LoginResponseDto(account.getName(), account.getRole()));
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
     * ログイン中のアカウント情報取得メソッド
     *
     * @param session ログインセッション
     * @return ログイン中のアカウント情報
     */
    @GetMapping("account")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AccountSessionDto> getAccount(
        @AuthenticationPrincipal AccountSessionDto session) {
        AccountSessionDto account = accountService.getAccount(session.getId());
        return ResponseEntity.ok(account);
    }

    /**
     * アカウント新規作成メソッド
     *
     * @param request 登録するアカウント情報
     * @return NoContent
     */
    @PostMapping("account")
    public ResponseEntity<Void> insertAccount(@Valid @RequestBody AccountRequestDto request) {
        accountService.insertAccount(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * アカウント情報変更メソッド
     *
     * @param request 変更するアカウント情報
     * @return NoContent
     */
    @PutMapping("account")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UUID> putAccount(
        @Valid @RequestBody AccountUpdateDto request,
        @AuthenticationPrincipal AccountSessionDto session,
        HttpSession httpSession
    ) {
        UUID response = accountService.putAccount(session.getId(), request);

        AccountSessionDto updatedSession = new AccountSessionDto(
            session.getId(),
            request.getMail(),
            request.getName()
        );

        Authentication currentAuthentication =
            SecurityContextHolder.getContext().getAuthentication();

        saveAccountToSession(
            httpSession,
            updatedSession,
            currentAuthentication.getAuthorities()
        );

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    /**
     * アカウントパスワード変更メソッド
     *
     * @param request 変更する新しいパスワードを含んだアカウント情報
     * @return NoContent
     */
    @PutMapping("password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UUID> putPassword(
        @Valid @RequestBody PasswordUpdateDto request,
        @AuthenticationPrincipal AccountSessionDto session
    ) {
        UUID response = accountService.putPassword(session.getId(), request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    /**
     * 管理者が一般アカウントのパスワード変更を行うメソッド
     *
     * @param request アカウント情報と新しいパスワード
     * @return NoContent
     */
    @PutMapping("admin/password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updatePasswordByAdmin(@Valid @RequestBody PasswordUpdateByAdminDto request) {
        accountService.updatePasswordByAdmin(request);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    /**
     * セッションにアカウント情報を保存するメソッド
     *
     * @param session        HTTPセッション
     * @param accountSession セッションに保存するアカウント情報
     * @param authorities    権限情報
     */
    private void saveAccountToSession(
        HttpSession session,
        AccountSessionDto accountSession,
        Collection<? extends GrantedAuthority> authorities
    ) {
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            accountSession,
            null,
            authorities
        );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        session.setAttribute(
            HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
            context
        );
    }
}
