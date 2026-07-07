package com.alab.shinkansendego.reservation;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationListRequestDto {
    @NotNull(message = "ReserverName is Null")
    private String reserverName;
    @NotNull(message = "ReserverMail is Null")
    private String reserverMail;
}
