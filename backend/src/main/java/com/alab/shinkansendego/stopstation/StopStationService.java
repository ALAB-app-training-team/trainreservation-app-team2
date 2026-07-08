package com.alab.shinkansendego.stopstation;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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

    public List<StationResponseDto> getStopStationWithoutTransfer(String stationCd) {
        List<String> cates = stopStationRepository.findByStationCd(stationCd)
                .stream().map(entity -> entity.getStopCategory())
                .collect(Collectors.toList());

        List<StopStationEntity> entities = stopStationRepository.findByStopCategoryIn(cates);
        Map<String, StationResponseDto> dtoMap = new LinkedHashMap<>();

        for (StopStationEntity ss : entities) {
            String cd = ss.getStationCd();
            StationResponseDto dto = dtoMap.computeIfAbsent(cd, key ->
                    new StationResponseDto(cd, ss.getStation().getName(), new ArrayList<>()));
            if (!dto.getCategories().contains(ss.getStopCategory())) {
                dto.getCategories().add(ss.getStopCategory());
            }
        }

        return new ArrayList<>(dtoMap.values());
    }
}
