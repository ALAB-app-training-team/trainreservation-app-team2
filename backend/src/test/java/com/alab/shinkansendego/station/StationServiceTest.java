package com.alab.shinkansendego.station;

import org.jspecify.annotations.NonNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class StationServiceTest {
    @Mock
    private StationRepository stationRepo;
    @InjectMocks
    private StationService service;

    private static @NonNull List<StationEntity> getStationEntityList() {
        StationEntity expect01 = new StationEntity("Test1", "TestStation01");
        StationEntity expect02 = new StationEntity("Test2", "TestStation02");
        StationEntity expect03 = new StationEntity("Test3", "TestStation03");
        StationEntity expect04 = new StationEntity("Test4", "TestStation04");
        return Arrays.asList(expect01, expect02, expect03, expect04);
    }

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("駅コードと駅名が全件取得できる")
    void getAllStationList_returnGetStationListSuccess() {
        when(stationRepo.findAll()).thenReturn(getStationEntityList());

        List<StationEntity> expectList = getStationEntityList();

        List<StationEntity> actualList = service.getAllStationList();

        assertEquals(4, actualList.size());
        assertEquals(expectList, actualList);
    }
}
