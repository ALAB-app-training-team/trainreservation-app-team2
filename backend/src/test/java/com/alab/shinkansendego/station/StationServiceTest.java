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

    private static @NonNull List<StationResponseDto> getStationResponseDtosList() {
        StationResponseDto expect01 = new StationResponseDto("Test1", "TestStation01");
        StationResponseDto expect02 = new StationResponseDto("Test2", "TestStation02");
        StationResponseDto expect03 = new StationResponseDto("Test3", "TestStation03");
        StationResponseDto expect04 = new StationResponseDto("Test4", "TestStation04");
        return Arrays.asList(expect01, expect02, expect03, expect04);
    }

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("駅コードと駅名が全件取得できる")
    void getAllStationList_returnGetStationListSuccess() {
        when(stationRepo.findAllStation()).thenReturn(getStationResponseDtosList());

        List<StationResponseDto> expectList = getStationResponseDtosList();

        List<StationResponseDto> actualList = service.getAllStationList();

        assertEquals(4, actualList.size());
        assertEquals(expectList, actualList);
    }
}
