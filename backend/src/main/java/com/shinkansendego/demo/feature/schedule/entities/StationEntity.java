package com.shinkansendego.demo.feature.schedule.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StationEntity {
    private String station_cd;
    private String name;
}
