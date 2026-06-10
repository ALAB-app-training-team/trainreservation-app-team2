package com.alab.shinkansendego.features.schedule.controllers;

import com.alab.shinkansendego.features.schedule.dtos.StationResponseDto;
import com.alab.shinkansendego.features.schedule.servicies.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping
public class SearchController {
    private final SearchService searchService;

    @Autowired
    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping(path = "api/shinkansen-station")
    public ResponseEntity<List<StationResponseDto>> getStationList() {
        List<StationResponseDto> response = searchService.getAllStationList();
        return ResponseEntity.ok(response);
    }
}
