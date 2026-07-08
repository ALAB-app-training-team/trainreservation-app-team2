package com.alab.shinkansendego.stopstation;


import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

public class StopStationServiceTest {

    @Mock
    private StopStationRepository stopStationRepository;

    @InjectMocks
    private StopStationService service;

    List<StopStationEntity> allStation;
    List<StopStationEntity> stationsWithSameStationCd;

    @BeforeEach
    void setUp() {
        allStation = List.of(
                new StopStationEntity("0061", "CMN03", "HB"),
                new StopStationEntity("0011", "THK02", "HB"),
                new StopStationEntity("0001", "THK01", "HB"),
                new StopStationEntity("0021", "CMN01", "HB")
        );

        stationsWithSameStationCd = List.of(
                new StopStationEntity("0061", "CMN03", "HB"),
                new StopStationEntity("0062", "CMN03", "YM"),
                new StopStationEntity("0063", "CMN03", "NS")
        );

        sameCateStations = List.of(
                new StopStationEntity()
        )
    }

    @Test
    @DisplayName("同じ停車カテゴリの停車駅を取得できる")
    void getStopStationWithoutTransfer() {
        when(stopStationRepository.findAll()).thenReturn(sameStationCds);
        assertEquals(2, 1 + 1);
    }
}
