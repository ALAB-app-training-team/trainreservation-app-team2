package com.alab.shinkansendego.schedule;

import lombok.*;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ScheduleResponseDto {
    private String schedule_cd;
    private String train_type_name;
    private LocalTime departure_time;
    private LocalTime arrival_time;
}
