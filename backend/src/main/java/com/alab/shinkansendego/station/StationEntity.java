package com.alab.shinkansendego.station;

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
