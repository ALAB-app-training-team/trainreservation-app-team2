package com.alab.shinkansendego.schedule;

import lombok.*;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleResponseDto {
    private String scheduleCd;
    private String trainTypeName;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
}
