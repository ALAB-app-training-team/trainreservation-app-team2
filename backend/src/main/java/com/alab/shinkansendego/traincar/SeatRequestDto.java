package com.alab.shinkansendego.traincar;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatRequestDto {
    @NotNull(message = "ScheduleCd is Null")
    private String scheduleCd;
    @NotNull(message = "Date is Null")
    private LocalDate date;
    @NotNull(message = "DepartureTime is Null")
    private LocalTime departureTime;
    @NotNull(message = "ArrivalTime is Null")
    private LocalTime arrivalTime;
    @NotNull(message = "TrainCarCd is Null")
    private String trainCarCd;
}
