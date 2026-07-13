package com.alab.shinkansendego.traincar;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "api/traincars")
public class TrainCarController {
    private final TrainCarService traincarService;

    @Autowired
    public TrainCarController(TrainCarService traincarService) {
        this.traincarService = traincarService;
    }

    @GetMapping(path = "/{trainCarCd}/seats")
    public ResponseEntity<List<SeatResponseDto>> getSeatList(@PathVariable String trainCarCd, @Valid SeatRequestDto seatRequestDto) {
        List<SeatResponseDto> response = traincarService.getSeatListWithReserved(trainCarCd, seatRequestDto);
        return ResponseEntity.ok(response);
    }
}
