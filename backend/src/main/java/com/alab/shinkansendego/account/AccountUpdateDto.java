package com.alab.shinkansendego.account;

import com.alab.shinkansendego.validations.ValidMail;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data

@NoArgsConstructor

@AllArgsConstructor

public class AccountUpdateDto {
    @NotBlank(message = "Name is Blank")
    private String name;
    @ValidMail
    private String mail;
    @NotBlank(message = "Password is Blank")
    private String password;
}

