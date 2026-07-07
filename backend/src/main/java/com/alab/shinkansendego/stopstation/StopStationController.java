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
@RequestMapping("api/shinkansen-stopstationlist")
public class StopStationController {
    private final StopStationService stopStationService;

    @Autowired
    public StopStationController(StopStationService service) {
        this.stopStationService = service;
    }

    @GetMapping(value = "{code}")
    public ResponseEntity<List<String>> getStopStation(@PathVariable("code") String stationCd) {
        List<String> response = stopStationService.getStopStationWithoutTransfer(stationCd);
        return ResponseEntity.ok(response);
    }

}
