package com.alab.shinkansendego.stopstation;

import java.util.List;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StationResponseDto {
    private String stationCd;
    private String stationName;
    private List<String> categories;
}
