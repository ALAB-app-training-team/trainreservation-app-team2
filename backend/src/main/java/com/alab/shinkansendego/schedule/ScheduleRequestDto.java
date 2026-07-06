package com.alab.shinkansendego.schedule;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleRequestDto {
    @NotNull(message = "Date is Null")
    private LocalDate date;
    @NotNull(message = "Time is Null")
    private LocalTime time;
    @NotNull(message = "DepartureStationCd is Null")
    private String departureStationCd;
    @NotNull(message = "ArrivalStationCd is Null")
    private String arrivalStationCd;
}
