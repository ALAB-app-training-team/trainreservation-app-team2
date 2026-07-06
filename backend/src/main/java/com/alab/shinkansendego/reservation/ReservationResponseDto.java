package com.alab.shinkansendego.reservation;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReservationResponseDto {
    private String trainTypeName;
    private String departureStationName;
    private LocalTime departureTime;
    private String arrivalStationName;
    private LocalTime arrivalTime;
    private LocalDate rideDate;
    private List<ReservedSeatDto> reservedSeats;
}
