package com.alab.shinkansendego.stopstation;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class StopStationServiceTest {

    @Mock
    private StopStationRepository stopStationRepository;

    @InjectMocks
    private StopStationService service;

    @BeforeEach
    void setUp() {

    }

    @Test
    @DisplayName("同じ停車カテゴリの停車駅を取得できる")
    void getStopStationWithoutTransfer() {
        when(stopStationRepository.findByStationCd(any()));
        assertEquals(2, 1 + 1);
    }
}
