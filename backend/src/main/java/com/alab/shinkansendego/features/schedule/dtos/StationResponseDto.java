package com.alab.shinkansendego.features.schedule.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StationResponseDto {
    private String station_cd;
    private String name;
}
