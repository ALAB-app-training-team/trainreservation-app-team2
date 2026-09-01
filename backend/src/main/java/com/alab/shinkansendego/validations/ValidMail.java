package com.alab.shinkansendego.validations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = MailValidator.class)
public @interface ValidMail {
    String message() default "Mail is Invalid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
