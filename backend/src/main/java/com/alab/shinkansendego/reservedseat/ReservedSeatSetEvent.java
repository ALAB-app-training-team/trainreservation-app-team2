package com.alab.shinkansendego.reservedseat;

import com.alab.shinkansendego.reservation.ReserveRequestDto;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public record ReservedSeatSetEvent(
    UUID reservationId,
    List<ReserveRequestDto> requests,
    LocalTime departureTime,
    LocalTime arrivalTime
) {
}
