package com.alab.shinkansendego.email.account;

import com.alab.shinkansendego.account.AccountCreatedEvent;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class AccountEventListener {
    private final AccountEmailService accountEmailService;

    public AccountEventListener(
        AccountEmailService accountEmailService
    ) {
        this.accountEmailService = accountEmailService;
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleAccountCreated(AccountCreatedEvent event) {
        AccountEmailRequestDto emailDto = new AccountEmailRequestDto(event.request().getMail(), event.request().getName());
        accountEmailService.sendAccountCreate(emailDto);
    }
}
