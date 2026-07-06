package com.alab.shinkansendego.reservation;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReservationDto {
    private String trainTypeName;
    private String departureStationCd;
    private String arrivalStationCd;
    private LocalDate rideDate;
}
