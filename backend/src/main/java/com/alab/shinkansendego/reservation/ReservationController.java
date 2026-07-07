package com.alab.shinkansendego.reservation;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<ReservationResponseDto>> getReservationList() {
        List<ReservationResponseDto> response = reservationService.getReservationList();
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "{id}")
    public ResponseEntity<ReservationResponseDto> getReservation(@PathVariable("id") UUID request) {
        ReservationResponseDto response = reservationService.getReservation(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<UUID> insertPurchase(@Valid @RequestBody ReserveRequestDto request) {
        UUID response = reservationService.insertPurchase(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
