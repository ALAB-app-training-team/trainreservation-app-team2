package com.alab.shinkansendego.reservation;

import java.time.LocalTime;
import java.util.UUID;

public record ReservationCanceledEvent(
    UUID reservationId,
    ReserveRequestDto request,
    LocalTime departureTime,
    LocalTime arrivalTime
) {
}
