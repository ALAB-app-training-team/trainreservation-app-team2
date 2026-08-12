package com.alab.shinkansendego.account;

import com.alab.shinkansendego.validations.ValidMail;
import com.alab.shinkansendego.validations.ValidPassword;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountRequestDto {
    @NotBlank(message = "Name is Blank")
    private String name;
    @NotBlank(message = "Mail is Blank")
    @ValidMail
    private String mail;
    @NotBlank(message = "Password is Blank")
    @ValidPassword
    private String password;
}
