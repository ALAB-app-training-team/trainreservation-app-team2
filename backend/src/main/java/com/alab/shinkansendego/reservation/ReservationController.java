package com.alab.shinkansendego.reservation;

import com.alab.shinkansendego.account.AccountSessionDto;
import com.alab.shinkansendego.email.EmailService;
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
import org.springframework.web.bind.annotation.PutMapping;
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
    private final EmailService emailService;

    @Autowired
    public ReservationController(ReservationService reservationService, EmailService emailService) {
        this.reservationService = reservationService;
        this.emailService = emailService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ReservationResponseDto>> getReservationList(@AuthenticationPrincipal AccountSessionDto session) {
        List<ReservationResponseDto> response = reservationService.getReservationList(session.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/guest/{id}")
    public ResponseEntity<ReservationResponseDto> getGuestReservation(@PathVariable("id") UUID reservationId, @RequestParam("reserverName") String name, @RequestParam("reserverMail") String email) {
        ReservationResponseDto response = reservationService.getGuestReservation(reservationId, name, email);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReservationResponseDto> getAccountReservation(@PathVariable("id") UUID reservationId, @AuthenticationPrincipal AccountSessionDto session) {
        ReservationResponseDto response = reservationService.getAccountReservation(reservationId, session.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UUID> insertAccountReservation(@Valid @RequestBody ReserveRequestDto request, @AuthenticationPrincipal AccountSessionDto session) {
        UUID response = reservationService.insertReservation(request, session);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping(path = "guest")
    public ResponseEntity<UUID> insertGuestReservation(@Valid @RequestBody ReserveRequestDto request, @AuthenticationPrincipal AccountSessionDto session) {
        UUID response = reservationService.insertReservation(request, session);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping(value = "/seat/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UUID> patchReservedSeat(@PathVariable("id") UUID reservationId, @Valid @RequestBody ReserveRequestDto request, @AuthenticationPrincipal AccountSessionDto session) {
        UUID response = reservationService.putReservedSeat(reservationId, request, session);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping(value = "{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteReservation(@PathVariable("id") UUID reservationId, @AuthenticationPrincipal AccountSessionDto session) {
        reservationService.deleteReservation(reservationId, session.getId());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
