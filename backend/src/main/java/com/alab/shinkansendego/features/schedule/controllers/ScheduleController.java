package com.alab.shinkansendego.features.schedule.controllers;

import com.alab.shinkansendego.features.schedule.dtos.ScheduleRequestDto;
import com.alab.shinkansendego.features.schedule.dtos.ScheduleResponseDto;
import com.alab.shinkansendego.features.schedule.dtos.TrainCarFormationResponseDto;
import com.alab.shinkansendego.features.schedule.servicies.ScheduleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping
public class ScheduleController {
    private final ScheduleService scheduleService;

    @Autowired
    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping(path = "api/shinkansen-schedule")
    public ResponseEntity<List<ScheduleResponseDto>> getSchedule(@Valid ScheduleRequestDto request) {
        List<ScheduleResponseDto> response = scheduleService.getSearchedScheduleByStation(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping(path = "api/shinkansen-traincar")
    public ResponseEntity<List<TrainCarFormationResponseDto>> getTrainCarList(@RequestParam(name = "schedule_cd") String scheduleCd) {
        List<TrainCarFormationResponseDto> response = scheduleService.getTrainCarList(scheduleCd);
        return ResponseEntity.ok(response);
    }
}
