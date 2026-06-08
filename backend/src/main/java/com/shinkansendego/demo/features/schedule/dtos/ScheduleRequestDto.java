package com.shinkansendego.demo.features.schedule.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
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
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    @NotNull
    private LocalTime time;
    @NotNull
    private String departure_station_name;
    @NotNull
    private String arrival_station_name;
}
