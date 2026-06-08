package com.shinkansendego.demo.features.schedule.controllers;

import com.shinkansendego.demo.features.schedule.dtos.ScheduleRequestDto;
import com.shinkansendego.demo.features.schedule.dtos.ScheduleResponseDto;
import com.shinkansendego.demo.features.schedule.servicies.ScheduleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "api/shikansen-schedule")
public class ScheduleController {
    private final ScheduleService scheduleService;

    @Autowired
    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping
    public ResponseEntity<List<ScheduleResponseDto>> getSchedule(@Valid @RequestBody ScheduleRequestDto request) {
        List<ScheduleResponseDto> response = scheduleService.getSearchedScheduleByStation(request);
        return ResponseEntity.ok(response);
    }
}
