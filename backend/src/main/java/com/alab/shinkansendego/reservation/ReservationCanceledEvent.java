package com.alab.shinkansendego.reservation;

import com.alab.shinkansendego.reservedseat.ReservedSeatEntity;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public record ReservationCanceledEvent(
    UUID reservationId,
    ReserveRequestDto request,
    LocalTime departureTime,
    LocalTime arrivalTime,
    String representativeName,
    List<ReservedSeatEntity> reservedSeats,
    boolean isGuest
) {
}
