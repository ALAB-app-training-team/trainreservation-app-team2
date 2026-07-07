package com.alab.shinkansendego.reservation;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationRequestDto {
    @NotNull
    private UUID purchaseId;
    @NotNull(message = "ReserverName is Null")
    private String reserverName;
    @NotNull(message = "ReserverMail is Null")
    private String reserverMail;
}
