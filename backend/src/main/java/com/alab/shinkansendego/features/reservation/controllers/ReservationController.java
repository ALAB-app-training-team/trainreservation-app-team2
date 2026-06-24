package com.alab.shinkansendego.features.reservation.controllers;

import com.alab.shinkansendego.features.reservation.dtos.ReservationResponseDto;
import com.alab.shinkansendego.features.reservation.services.ReservationService;
import com.alab.shinkansendego.features.schedule.dtos.ScheduleRequestDto;
import com.alab.shinkansendego.features.schedule.dtos.ScheduleResponseDto;
import com.alab.shinkansendego.features.schedule.servicies.ScheduleService;
import jakarta.validation.Valid;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "api/shinkansen-reservation")
public class ReservationController {
    private final ReservationService reservationService;

    @Autowired
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public ResponseEntity<ReservationResponseDto> getSchedule(@RequestParam("purchase_id") UUID request) {
        ReservationResponseDto response = reservationService.getReservation(request);
        return ResponseEntity.ok(response);
    }
}
