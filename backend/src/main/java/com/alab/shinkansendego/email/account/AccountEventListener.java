package com.alab.shinkansendego.email.account;

import com.alab.shinkansendego.account.AccountChangedEvent;
import com.alab.shinkansendego.account.AccountCreatedEvent;
import com.alab.shinkansendego.account.PasswordChangedEvent;
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
        AccountEmailRequestParams emailParams = new AccountEmailRequestParams(event.request().getMail(), event.request().getName());
        accountEmailService.sendAccountCreate(emailParams);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleAccountChanged(AccountChangedEvent event) {
        AccountEmailRequestParams emailParams = new AccountEmailRequestParams(event.request().getMail(), event.request().getName());
        accountEmailService.sendAccountChange(emailParams);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePasswordChanged(PasswordChangedEvent event) {
        AccountEmailRequestParams emailParams = new AccountEmailRequestParams(event.request().getMail(), event.request().getName());
        accountEmailService.sendPasswordChange(emailParams);
    }
}
