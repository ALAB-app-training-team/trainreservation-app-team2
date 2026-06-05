package com.shinkansendego.demo.feature.schedule.dtos;

import lombok.*;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ScheduleResponseDto {
    private String train_type_name;
    private String departure_station_name;
    private LocalTime departure_time;
    private String arrival_station_name;
    private LocalTime arrival_time;
}
