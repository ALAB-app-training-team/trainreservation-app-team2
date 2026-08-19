package com.alab.shinkansendego.account;

import com.alab.shinkansendego.validations.ValidPassword;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordUpdateByAdminDto {
    @NotBlank(message = "Name is Blank.")
    private String name;
    @NotBlank(message = "Mail is Blank.")
    private String mail;
    @ValidPassword
    @NotBlank(message = "Password is Blank.")
    private String password;
}
