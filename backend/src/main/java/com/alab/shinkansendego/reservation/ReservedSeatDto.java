package com.alab.shinkansendego.reservation;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservedSeatDto {
    private String trainCarTypeName;
    private Integer trainCarNumber;
    private Integer seatNumber;
    private String seatColumn;
    private String codeToken;
}
