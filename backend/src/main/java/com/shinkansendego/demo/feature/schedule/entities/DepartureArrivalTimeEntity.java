package com.shinkansendego.demo.feature.schedule.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Time;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartureArrivalTimeEntity {
    private String time_cd;
    private String schedule_cd;
    private Time departure_time;
    private Time arrival_time;
    private String section_cd;
}
