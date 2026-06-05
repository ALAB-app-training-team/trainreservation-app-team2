package com.shinkansendego.demo.feature.schedule.dtos;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ScheduleRequestDto {
    private LocalDate date;
    private LocalTime time;
    private String departure_station_name;
    private String arrival_station_name;
}
