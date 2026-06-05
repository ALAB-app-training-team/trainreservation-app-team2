package com.shinkansendego.demo.feature.schedule.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SectionKmEntity {
    private String section_cd;
    private String start_station_cd;
    private String goal_station_cd;
    private double distance_km;
}
