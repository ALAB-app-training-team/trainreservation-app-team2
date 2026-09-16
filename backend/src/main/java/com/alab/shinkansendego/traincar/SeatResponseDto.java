package com.alab.shinkansendego.traincar;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatResponseDto {
    private FacilityDto frontFacilities;
    private FacilityDto rearFacilities;
    private List<SeatDto> seats;
}
