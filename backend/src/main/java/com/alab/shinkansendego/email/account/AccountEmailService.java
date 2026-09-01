package com.alab.shinkansendego.email.account;

public interface AccountEmailService {
    void sendAccountCreate(AccountEmailRequestParams params);

    void sendAccountChange(AccountEmailRequestParams params);

    void sendPasswordChange(AccountEmailRequestParams params);
}
