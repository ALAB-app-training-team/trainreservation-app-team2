package com.alab.shinkansendego.validations;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Objects;

public class MailValidator
    implements ConstraintValidator<ValidMail, String> {
    private static final String MAIL_PATTERN =
        "^[a-zA-Z0-9]+([._+-][a-zA-Z0-9]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\\.)+[a-zA-Z]{2,}$";

    @Override
    public boolean isValid(String mail, ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();

        if (Objects.equals(mail, "")) {
            return SetValidErrorMessage.setErrorMessage(context, "Mail is Blank");
        }
        if (!mail.matches(MAIL_PATTERN)) {
            return SetValidErrorMessage.setErrorMessage(context, "Mail is InValid");
        }
        return true;
    }
}
