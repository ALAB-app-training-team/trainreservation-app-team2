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

    List<StopStationEntity> sameStationCds;
    List<StopStationEntity> sameCateStations;

    @BeforeEach
    void setUp() {
        sameStationCds = List.of(
                new StopStationEntity("0001", "THK01", "HB"),
                new StopStationEntity("0002", "THK01", "YM"),
                new StopStationEntity("0003", "THK01", "NS"),
                new StopStationEntity("0004", "THK01", "KM")
        );

        sameCateStations = List.of(
                new StopStationEntity()
        )
    }

    @Test
    @DisplayName("同じ停車カテゴリの停車駅を取得できる")
    void getStopStationWithoutTransfer() {
        when(stopStationRepository.findByStationCd(anyString())).thenReturn(sameStationCds);
        when(stopStationRepository.findByStopCategoryIn(anyList())).thenReturn();
        assertEquals(2, 1 + 1);
    }
}
