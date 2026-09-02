package com.alab.shinkansendego.email.account;

public interface AccountEmailService {
    void sendAccountCreate(AccountEmailRequestParams params);

    void sendAccountUpdate(AccountEmailRequestParams newParams, AccountEmailRequestParams oldParams);

    void sendPasswordUpdate(AccountEmailRequestParams params);
}
