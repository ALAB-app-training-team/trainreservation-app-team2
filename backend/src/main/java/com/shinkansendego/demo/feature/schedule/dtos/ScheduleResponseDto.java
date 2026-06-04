package com.shinkansendego.demo.feature.schedule.dtos;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Data
@Getter
@Setter
public class ScheduleResponseDto {
    private String train_type_name;
    private String arrival_station_name;
    private LocalTime arrival_time;
    private String departure_station_name;
    private LocalTime departure_time;
}
