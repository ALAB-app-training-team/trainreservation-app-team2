package com.alab.shinkansendego.reservation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservedScheduleDto {
    private LocalTime departureTime;
    private String departureStationCd;
    private String departureStationName;
    private LocalTime arrivalTime;
    private String arrivalStationCd;
    private String arrivalStationName;
}
