package com.alab.shinkansendego.validations;

import jakarta.validation.ConstraintValidatorContext;

public final class SetValidErrorMessage {
    private SetValidErrorMessage() {

    }

    /**
     * バリデーションエラーメッセージを設定するメソッド
     *
     * @param context Validatorのコンテキスト
     * @param message 設定するエラーメッセージ
     * @return 空白がすべて除かれた対象文字列
     */
    public static boolean setErrorMessage(ConstraintValidatorContext context, String message) {
        context.buildConstraintViolationWithTemplate(message)
            .addConstraintViolation();
        return false;
    }
}
