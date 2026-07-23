package com.alab.shinkansendego.reservation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private UUID reservationId;
    private String trainTypeName;
    private String departureStationName;
    private LocalTime departureTime;
    private String arrivalStationName;
    private LocalTime arrivalTime;
    private LocalDate rideDate;
    private Boolean isDeleted;
    private List<ReservedSeatDto> reservedSeats;
}
