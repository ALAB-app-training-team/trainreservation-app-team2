package com.alab.shinkansendego.reservedseat;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservedSeatUpdateDto {
    @NotNull(message = "id is Null")
    private UUID id;
    @NotNull(message = "name is Null")
    private String name;
    @NotNull(message = "mail is Null")
    private String mail;
}
