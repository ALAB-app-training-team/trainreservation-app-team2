package com.alab.shinkansendego;

import com.alab.shinkansendego.account.AccountEntity;
import com.alab.shinkansendego.account.AccountRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class SecurityUtil {
    private final AccountRepository accountRepository;

    public SecurityUtil(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public String GetAccountName() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new AccessDeniedException("Auth is not found");
        }
        return auth.getName();
    }

    public UUID GetAccountId() {
        String accountName = GetAccountName();
        AccountEntity account = accountRepository.findByName(accountName).orElseThrow(() -> new AccessDeniedException("Auth is not found"));
        return account.getId();
    }
}
