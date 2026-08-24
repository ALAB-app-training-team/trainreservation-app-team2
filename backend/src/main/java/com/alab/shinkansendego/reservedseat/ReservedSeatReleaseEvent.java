package com.alab.shinkansendego.reservedseat;

import com.alab.shinkansendego.reservation.ReserveRequestDto;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public record ReservedSeatReleaseEvent(
    UUID reservationId,
    List<ReserveRequestDto> requests,
    LocalTime departureTime,
    LocalTime arrivalTime,
    String representativeName
) {
}
