package com.alab.shinkansendego.account;

import com.alab.shinkansendego.validations.ValidPassword;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data

@NoArgsConstructor

@AllArgsConstructor

public class PasswordUpdateDto {
    @NotBlank(message = "Password is Blank")
    private String password;
    @ValidPassword
    private String newPassword;
}

