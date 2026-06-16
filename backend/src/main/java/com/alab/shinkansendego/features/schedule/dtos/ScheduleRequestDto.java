package com.alab.shinkansendego.features.schedule.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ScheduleRequestDto {
    @NotNull
    private LocalDate date;
    @NotNull
    private LocalTime time;
    @NotNull
    private String departure_station_cd;
    @NotNull
    private String arrival_station_cd;
}
