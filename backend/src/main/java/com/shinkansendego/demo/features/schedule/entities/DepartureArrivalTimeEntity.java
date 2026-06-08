package com.shinkansendego.demo.features.schedule.entities;

import lombok.*;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DepartureArrivalTimeEntity {
    private String time_cd;
    private String schedule_cd;
    private LocalTime departure_time;
    private LocalTime arrival_time;
    private String section_cd;
}
