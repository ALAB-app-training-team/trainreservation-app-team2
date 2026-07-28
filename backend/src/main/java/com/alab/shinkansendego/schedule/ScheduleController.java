package com.alab.shinkansendego.schedule;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "api/schedules")
public class ScheduleController {
    private final ScheduleService scheduleService;

    @Autowired
    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ScheduleResponseDto>> getSchedule(@Valid ScheduleRequestDto request) {
        List<ScheduleResponseDto> response = scheduleService.getSearchedScheduleByStation(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping(path = "/{id}/traincars")
    public ResponseEntity<List<TrainCarFormationResponseDto>> getTrainCarList(@PathVariable("id") String scheduleCd) {
        List<TrainCarFormationResponseDto> response = scheduleService.getTrainCarList(scheduleCd);
        return ResponseEntity.ok(response);
    }
}
