package com.shinkansendego.demo.feature.schedule.dtos;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Getter
@Setter
public class ScheduleRequestDto {
    private LocalDate date;
    private LocalTime time;
    private String departure_station_name;
    private String arrival_station_name;
}
