package com.alab.shinkansendego.reservation;

import com.alab.shinkansendego.account.AccountSessionDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ReservationResponseDto>> getReservationList(@AuthenticationPrincipal AccountSessionDto session) {
        List<ReservationResponseDto> response = reservationService.getReservationList(session.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/guest/{id}")
    public ResponseEntity<ReservationResponseDto> getReservation(@PathVariable("id") UUID reservationId, @RequestParam("reserverName") String name, @RequestParam("reserverMail") String email) {
        ReservationResponseDto response = reservationService.getReservation(reservationId, name, email);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReservationResponseDto> getReservation(@PathVariable("id") UUID reservationId, @AuthenticationPrincipal AccountSessionDto session) {
        ReservationResponseDto response = reservationService.getAccountReservation(reservationId, session.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<UUID> insertReservation(@Valid @RequestBody ReserveRequestDto request) {
        UUID response = reservationService.insertReservation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping(value = "{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable("id") UUID reservationId) {
        reservationService.deleteReservation(reservationId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
