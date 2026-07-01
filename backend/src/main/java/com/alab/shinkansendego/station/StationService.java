package com.alab.shinkansendego.station;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StationService {
    private final StationRepository stationRepository;

    @Autowired
    public StationService(
            StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    public List<StationResponseDto> getAllStationList() {
        return stationRepository.findAllStation();
    }
}
