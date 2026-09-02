package com.alab.shinkansendego.email.account;

import com.alab.shinkansendego.account.AccountCreatedEvent;
import com.alab.shinkansendego.account.AccountUpdatedEvent;
import com.alab.shinkansendego.account.PasswordUpdatedEvent;
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
    public void handleAccountChanged(AccountUpdatedEvent event) {
        String newMail = event.newAccountInfo().getMail();
        String oldMail = event.oldAccountInfo().getMail();
        AccountEmailRequestParams newParams = new AccountEmailRequestParams(newMail, event.newAccountInfo().getName());
        AccountEmailRequestParams oldParams = new AccountEmailRequestParams(null, event.oldAccountInfo().getName());
        if (oldMail != null && oldMail.equals(newMail)) {
            accountEmailService.sendAccountUpdate(newParams, new AccountEmailRequestParams(null, event.oldAccountInfo().getName()));
        } else if (oldMail != null && newMail != null) {
            accountEmailService.sendAccountUpdate(newParams, new AccountEmailRequestParams(null, event.oldAccountInfo().getName()));
            accountEmailService.sendAccountUpdate(newParams, new AccountEmailRequestParams(oldMail, event.oldAccountInfo().getName()));
        }
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePasswordChanged(PasswordUpdatedEvent event) {
        AccountEmailRequestParams emailParams = new AccountEmailRequestParams(event.request().getMail(), event.request().getName());
        accountEmailService.sendPasswordUpdate(emailParams);
    }
}
