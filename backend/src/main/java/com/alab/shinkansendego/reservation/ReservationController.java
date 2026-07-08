package com.alab.shinkansendego.reservation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping
public class ReservationController {
    private final ReservationService reservationService;

    @Autowired
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping(path = "api/shinkansen-reservationlist")
    public ResponseEntity<List<ReservationResponseDto>> getReservationList() {
        List<ReservationResponseDto> response = reservationService.getReservationList();
        return ResponseEntity.ok(response);
    }

    @GetMapping(path = "api/shinkansen-reservation")
    public ResponseEntity<ReservationResponseDto> getReservation(@RequestParam("purchaseId") UUID request) {
        ReservationResponseDto response = reservationService.getReservation(request);
        return ResponseEntity.ok(response);
    }
}
