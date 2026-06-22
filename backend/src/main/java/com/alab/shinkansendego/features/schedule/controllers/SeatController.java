package com.alab.shinkansendego.features.schedule.controllers;

import com.alab.shinkansendego.features.schedule.dtos.SeatRequestDto;
import com.alab.shinkansendego.features.schedule.dtos.SeatResponseDto;
import com.alab.shinkansendego.features.schedule.servicies.SeatService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping
public class SeatController {
    private final SeatService seatService;

    @Autowired
    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping(path = "api/shinkansen-seat")
    public ResponseEntity<List<SeatResponseDto>> getSeatList(@Valid SeatRequestDto seatRequestDto) {
        List<SeatResponseDto> response = seatService.getSeatListWithReserved(seatRequestDto);
        return ResponseEntity.ok(response);
    }
}
