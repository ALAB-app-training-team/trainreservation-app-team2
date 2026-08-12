package com.alab.shinkansendego.exception;

import lombok.Getter;

@Getter
public class ConflictException extends RuntimeException {
    private final String reason;

    public ConflictException(String reason) {
        this.reason = reason;
    }
}
