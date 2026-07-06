package com.alab.shinkansendego.reservation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservedSeatDto {
    private String trainCarTypeName;
    private Integer trainCarNumber;
    private Integer seatNumber;
    private String seatColumn;
    private UUID codeToken;
}
