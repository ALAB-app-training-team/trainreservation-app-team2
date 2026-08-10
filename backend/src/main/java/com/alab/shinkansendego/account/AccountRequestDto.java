package com.alab.shinkansendego.account;

import com.alab.shinkansendego.utils.ValidPassword;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountRequestDto {
    @NotBlank
    private String name;
    @NotBlank
    private String mail;
    @NotBlank
    @ValidPassword
    private String password;
}
