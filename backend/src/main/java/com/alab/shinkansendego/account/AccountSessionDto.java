package com.alab.shinkansendego.account;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class AccountSessionDto {
    private UUID id;
    private String mail;
    private String name;
}
