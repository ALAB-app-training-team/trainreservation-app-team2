package com.alab.shinkansendego.reservation;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReservationResponseDto {
    private UUID purchaseId;
    private String trainTypeName;
    private String departureStationName;
    private LocalTime departureTime;
    private String arrivalStationName;
    private LocalTime arrivalTime;
    private LocalDate rideDate;
    private List<ReservedSeatDto> reservedSeats;
}
