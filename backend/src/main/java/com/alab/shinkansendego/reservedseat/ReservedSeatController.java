package com.alab.shinkansendego.reservedseat;

import com.alab.shinkansendego.account.AccountSessionDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "api/reservedseats")
public class ReservedSeatController {
    private final ReservedSeatService reservedSeatService;

    @Autowired
    public ReservedSeatController(ReservedSeatService reservedSeatService) {
        this.reservedSeatService = reservedSeatService;
    }

    @PatchMapping
    public ResponseEntity<Void> updateReservedSeats(@PathVariable("id") UUID reservationId,
                                                    @Valid @RequestBody List<ReservedSeatUpdateDto> reservedSeats,
                                                    @AuthenticationPrincipal AccountSessionDto session) {
        UUID accountId = (session != null) ? session.getId() : null;
        reservedSeatService.updateReservedSeats(reservationId, reservedSeats, accountId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
