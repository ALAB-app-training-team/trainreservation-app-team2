package com.alab.shinkansendego.traincar;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatResponseDto {
    private String trainCarCd;
    private Integer trainCarNumber;
    private String seatCd;
    private Integer seatNumber;
    private String seatColumn;
    private Integer fare;
    private Boolean isReserved;
}
