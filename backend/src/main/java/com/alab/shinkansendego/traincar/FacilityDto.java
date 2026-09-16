package com.alab.shinkansendego.traincar;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FacilityDto {
    private String position;
    private Boolean isUnisexRestroom;
    private Boolean isMenRestroom;
    private Boolean isWomenRestroom;
    private Boolean isWheelchairRestroom;
    private Boolean isLuggageStorage;
    private Boolean isBabyChangingTable;
}
