package com.alab.shinkansendego.stopstation;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StopStationService {
    private final StopStationRepository stopStationRepository;

    @Autowired
    public StopStationService(StopStationRepository repository) {
        this.stopStationRepository = repository;
    }

    public List<String> getStopStationWithoutTransfer(String stationCd) {
        List<StopStationEntity> entities = stopStationRepository.findByStationCd(stationCd);
        List<String> stationCds = entities.stream().map(stopStation -> stopStation.getStationCd()).collect(Collectors.toList());
        System.out.println(stationCds);
        return stationCds;
    }
}
