package com.alab.shinkansendego.email.account;

public interface AccountEmailService {
    void sendAccountConfirmation(AccountEmailRequestDto dto);
}
