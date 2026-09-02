package com.alab.shinkansendego.account;

public record AccountUpdatedEvent(
    AccountRequestDto newAccountInfo,
    AccountRequestDto oldAccountInfo
) {
}
