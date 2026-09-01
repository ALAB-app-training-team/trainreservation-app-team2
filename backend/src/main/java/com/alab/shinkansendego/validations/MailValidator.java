package com.alab.shinkansendego.validations;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Objects;

public class MailValidator
    implements ConstraintValidator<ValidMail, String> {
    private static final String MAIL_PATTERN =
        "^[a-zA-Z0-9]+([._+-][a-zA-Z0-9]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\\.)+[a-zA-Z]{2,}$";

    /**
     * メールアドレスのバリデーションチェックを行うメソッド
     *
     * @param mail    チェック対象のメールアドレス
     * @param context Validatorのコンテキスト
     * @return チェック結果
     */
    @Override
    public boolean isValid(String mail, ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();

        if (Objects.equals(mail, null)) {
            return SetValidErrorMessage.setErrorMessage(context, "Mail is Null");
        }
        if (Objects.equals(mail, "")) {
            return SetValidErrorMessage.setErrorMessage(context, "Mail is Empty");
        }
        if (Objects.equals(mail, " ")) {
            return SetValidErrorMessage.setErrorMessage(context, "Mail is Blank");
        }
        if (!mail.matches(MAIL_PATTERN)) {
            return SetValidErrorMessage.setErrorMessage(context, "Mail is Invalid");
        }
        if (mail.length() > 255 || mail.length() == 0) {
            return SetValidErrorMessage.setErrorMessage(context, "Mail is Over Limit Size");
        }
        return true;
    }
}
