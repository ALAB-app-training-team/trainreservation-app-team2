package com.alab.shinkansendego.features.schedule.servicies;

import com.alab.shinkansendego.features.schedule.dtos.StationResponseDto;
import com.alab.shinkansendego.features.schedule.repositories.StationRepository;
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
