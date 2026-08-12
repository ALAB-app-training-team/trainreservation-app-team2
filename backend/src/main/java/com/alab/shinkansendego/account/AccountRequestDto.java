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
    @ValidMail
    private String mail;
    @ValidPassword
    private String password;
}
