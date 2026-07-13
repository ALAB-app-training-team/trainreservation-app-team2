package com.alab.shinkansendego.reservation;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "api/reservations")
public class ReservationController {
    private final ReservationService reservationService;

    @Autowired
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public ResponseEntity<List<ReservationResponseDto>> getReservationList(@RequestParam("reserverName") String name, @RequestParam("reserverMail") String email) {
        List<ReservationResponseDto> response = reservationService.getReservationList(name, email);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "{id}")
    public ResponseEntity<ReservationResponseDto> getReservation(@PathVariable("id") UUID reservationId, @RequestParam("reserverName") String name, @RequestParam("reserverMail") String email) {
        ReservationResponseDto response = reservationService.getReservation(reservationId, name, email);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<UUID> insertReservation(@Valid @RequestBody ReserveRequestDto request) {
        UUID response = reservationService.insertReservation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
