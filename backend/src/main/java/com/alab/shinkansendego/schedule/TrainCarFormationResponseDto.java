package com.alab.shinkansendego.schedule;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainCarFormationResponseDto {
    private String trainCarCd;
    private int trainCarNumber;
    private String seatTypeCd;
    private String trainCarTypeName;
}
