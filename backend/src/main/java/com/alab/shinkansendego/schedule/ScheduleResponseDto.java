package com.alab.shinkansendego.schedule;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleResponseDto {
    private String scheduleCd;
    private String trainTypeName;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private Integer reservedSeats;
    private Integer greenSeats;
    private Integer gcSeats;
    private String direction;
}
