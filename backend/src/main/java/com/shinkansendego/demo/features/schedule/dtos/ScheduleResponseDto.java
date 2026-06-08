package com.shinkansendego.demo.features.schedule.dtos;

import lombok.*;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ScheduleResponseDto {
    private String train_type_name;
    private LocalTime departure_time;
    private LocalTime arrival_time;
}
