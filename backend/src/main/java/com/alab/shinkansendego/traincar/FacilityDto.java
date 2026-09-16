package com.alab.shinkansendego.traincar;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FacilityDto {
    private String position;
    private Boolean hasAllGenderRestroom;
    private Boolean hasMensRestroom;
    private Boolean hasWomensRestroom;
    private Boolean hasWheelchairRestroom;
    private Boolean hasBabyChangingTable;
    private Boolean hasLuggageStorage;
    private Boolean hasMultipurposeRoom;
}
