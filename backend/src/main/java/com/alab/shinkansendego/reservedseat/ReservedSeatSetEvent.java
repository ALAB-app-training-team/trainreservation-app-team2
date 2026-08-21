package com.alab.shinkansendego.reservedseat;

import com.alab.shinkansendego.reservation.ReserveRequestDto;

import java.time.LocalTime;
import java.util.UUID;

public record ReservedSeatSetEvent(
    UUID reservationId,
    ReserveRequestDto request,
    LocalTime departureTime,
    LocalTime arrivalTime
) {
}
