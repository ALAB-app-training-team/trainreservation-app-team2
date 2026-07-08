package com.alab.shinkansendego.stopstation;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/stopstations")
public class StopStationController {
    private final StopStationService stopStationService;

    @Autowired
    public StopStationController(StopStationService service) {
        this.stopStationService = service;
    }

    @GetMapping
    public ResponseEntity<List<StationResponseDto>> getStopStation() {
        List<StationResponseDto> response = stopStationService.getStopStationWithoutTransfer();
        return ResponseEntity.ok(response);
    }
}
