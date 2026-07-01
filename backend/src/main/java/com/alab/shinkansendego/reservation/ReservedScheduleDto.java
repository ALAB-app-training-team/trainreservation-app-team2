package com.alab.shinkansendego.reservation;

import lombok.*;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReservedScheduleDto {
    private LocalTime departure_time;
    private String departure_station_cd;
    private String departure_station_name;
    private LocalTime arrival_time;
    private String arrival_station_cd;
    private String arrival_station_name;
}
