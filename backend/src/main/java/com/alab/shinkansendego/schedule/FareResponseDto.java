package com.alab.shinkansendego.schedule;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FareResponseDto {
    private Integer reservedFare;
    private Integer greenFare;
    private Integer gcFare;
}
