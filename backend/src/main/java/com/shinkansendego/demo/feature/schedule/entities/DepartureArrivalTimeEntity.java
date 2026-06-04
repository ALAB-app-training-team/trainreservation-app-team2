package com.shinkansendego.demo.feature.schedule.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartureArrivalTimeEntity {
    private String time_cd;
    private String schedule_cd;
    private LocalTime departure_time;
    private LocalTime arrival_time;
    private String section_cd;
}
