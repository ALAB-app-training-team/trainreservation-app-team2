package com.alab.shinkansendego.features.schedule.controllers;

import com.alab.shinkansendego.features.schedule.dtos.TrainCarFormationResponseDto;
import com.alab.shinkansendego.features.schedule.servicies.TrainCarFormationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TrainCarFormationController {
    private final TrainCarFormationService trainCarFormationService;

    @Autowired
    public TrainCarFormationController(TrainCarFormationService trainCarFormationService) {
        this.trainCarFormationService = trainCarFormationService;
    }

    @GetMapping(path = "api/shinkansen-traincar")
    public ResponseEntity<List<TrainCarFormationResponseDto>> getTrainCarList(@RequestParam(name = "schedule_cd") String scheduleCd) {
        List<TrainCarFormationResponseDto> response = trainCarFormationService.getTrainCarList(scheduleCd);
        return ResponseEntity.ok(response);
    }
}
