package com.alab.shinkansendego.validations;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Objects;

public class PasswordValidator
    implements ConstraintValidator<ValidPassword, String> {
    private static final String PASSWORD_PATTERN =
        "^[A-Za-z0-9'!\"#$%&(),./:;?@\\[\\]^_`{}~+<=>*\\-]+$";

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();

        if (Objects.equals(password, "")) {
            return setErrorMessage(context, "Password is Blank");
        }
        if (!password.matches(PASSWORD_PATTERN)) {
            return setErrorMessage(context, "Password Policy doesn't match");
        }
        if (password.length() < 8) {
            return setErrorMessage(context, "Password is Less Than 8 Characters");
        }
        if (password.length() > 64) {
            return setErrorMessage(context, "Password is More Than 64 Characters");
        }
        if (!password.matches(".*[A-Z].*")) {
            return setErrorMessage(context, "Password doesn't Contain Uppercase");
        }
        if (!password.matches(".*[a-z].*")) {
            return setErrorMessage(context, "Password doesn't Contain Lowercase");
        }
        if (!password.matches(".*[0-9].*")) {
            return setErrorMessage(context, "Password doesn't Contain Number");
        }
        return true;
    }

    private boolean setErrorMessage(ConstraintValidatorContext context, String message) {
        context.buildConstraintViolationWithTemplate(message)
            .addConstraintViolation();
        return false;
    }
}
