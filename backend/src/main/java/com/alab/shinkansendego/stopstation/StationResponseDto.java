package com.alab.shinkansendego.stopstation;

import jakarta.validation.constraints.*;
import java.util.List;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StationResponseDto {
    private String stationCd;
    private String stationName;
    private List<String> categoryNames;
}
