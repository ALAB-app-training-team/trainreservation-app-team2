package com.alab.shinkansendego.traincar;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping
public class TrainCarController {
    private final TrainCarService traincarService;

    @Autowired
    public TrainCarController(TrainCarService traincarService) {
        this.traincarService = traincarService;
    }

    @GetMapping(path = "api/shinkansen-seat")
    public ResponseEntity<List<SeatResponseDto>> getSeatList(@Valid SeatRequestDto seatRequestDto) {
        List<SeatResponseDto> response = traincarService.getSeatListWithReserved(seatRequestDto);
        return ResponseEntity.ok(response);
    }
}
