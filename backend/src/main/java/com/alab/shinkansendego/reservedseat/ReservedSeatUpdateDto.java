package com.alab.shinkansendego.reservedseat;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservedSeatUpdateDto {
    @NotBlank(message = "id is Blank")
    private UUID id;
    @NotBlank(message = "name is Blank")
    private String name;
    @NotBlank(message = "mail is Blank")
    private String mail;
}
