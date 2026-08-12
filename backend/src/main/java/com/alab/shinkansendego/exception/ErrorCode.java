package com.alab.shinkansendego.exception;

import lombok.Data;

@Data
public class ErrorCode {
    private ErrorCode(String code) {
        this.code = code;
    }

    private final String code;
    public static final ErrorCode CONFLICT = new ErrorCode("CONFLICT");
}
