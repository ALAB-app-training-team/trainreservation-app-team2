package com.alab.shinkansendego.email.account;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountEmailRequestParams {
    private String accountMail;
    private String accountName;
}
