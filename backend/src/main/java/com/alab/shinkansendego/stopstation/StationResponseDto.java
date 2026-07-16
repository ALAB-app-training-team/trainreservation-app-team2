package com.alab.shinkansendego.stopstation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StationResponseDto {
    private String stationCd;
    private String stationName;
    private List<String> categories;
}
