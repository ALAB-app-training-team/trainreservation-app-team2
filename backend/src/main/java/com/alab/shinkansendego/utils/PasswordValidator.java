package com.alab.shinkansendego.utils;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator
    implements ConstraintValidator<ValidPassword, String> {
    private static final String PASSWORD_PATTERN =
        "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)[A-Za-z\\d'\\-!\"#$%&(),./:;?@\\[\\]\\^_`{}~+<=>*]{8,64}$";

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        return password.matches(PASSWORD_PATTERN);
    }
}
