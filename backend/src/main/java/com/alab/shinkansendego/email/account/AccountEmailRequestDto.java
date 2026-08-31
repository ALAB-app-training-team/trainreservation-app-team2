package com.alab.shinkansendego.email.account;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AccountEmailRequestDto {
    private String accountMail;
    private String accountName;
}
