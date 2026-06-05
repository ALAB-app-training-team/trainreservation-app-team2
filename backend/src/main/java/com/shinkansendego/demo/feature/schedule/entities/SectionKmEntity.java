package com.shinkansendego.demo.feature.schedule.entities;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SectionKmEntity {
    private String section_cd;
    private String start_station_cd;
    private String goal_station_cd;
    private double distance_km;
}
