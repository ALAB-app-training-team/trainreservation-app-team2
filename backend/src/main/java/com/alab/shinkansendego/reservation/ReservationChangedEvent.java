package com.alab.shinkansendego.reservation;

import com.alab.shinkansendego.reservedseat.ReservedSeatEntity;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public record ReservationChangedEvent(
    UUID reservationId,
    ReserveRequestDto request,
    LocalTime departureTime,
    LocalTime arrivalTime,
    Integer oldTotalAmount,
    List<ReservedSeatEntity> assignedReservedSeats
) {
}
