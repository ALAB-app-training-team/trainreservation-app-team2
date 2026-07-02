package com.alab.shinkansendego.station;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping
public class StationController {
    private final StationService stationService;

    @Autowired
    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    @GetMapping(path = "api/shinkansen-station")
    public ResponseEntity<List<StationEntity>> getAllStationList() {
        List<StationEntity> response = stationService.getAllStationList();
        return ResponseEntity.ok(response);
    }
}
