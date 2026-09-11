package com.alab.shinkansendego.schedule;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FareRequestDto {
    @NotNull(message = "scheduleCd is Null")
    private String scheduleCd;
    @NotNull(message = "DepartureStationCd is Null")
    private String departureStationCd;
    @NotNull(message = "departureTime is Null")
    private LocalTime departureTime;
    @NotNull(message = "ArrivalStationCd is Null")
    private String arrivalStationCd;
    @NotNull(message = "arrivalTime is Null")
    private LocalTime arrivalTime;
}
