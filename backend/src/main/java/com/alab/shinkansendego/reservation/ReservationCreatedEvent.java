package com.alab.shinkansendego.reservation;

import java.time.LocalTime;
import java.util.UUID;

public record ReservationCreatedEvent(
    UUID reservationId,
    ReserveRequestDto request,
    LocalTime departureTime,
    LocalTime arrivalTime,
    boolean isGuest
) {
}
