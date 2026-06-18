package com.alab.shinkansendego.features.schedule.services;

import com.alab.shinkansendego.features.schedule.dtos.TrainCarFormationResponseDto;
import com.alab.shinkansendego.features.schedule.repositories.TrainCarFormationRepository;
import com.alab.shinkansendego.features.schedule.servicies.TrainCarFormationService;
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

public class TrainCarFormationServiceTest {

    @Mock
    private TrainCarFormationRepository trainCarRepo;
    @InjectMocks
    private TrainCarFormationService service;

    private static @NonNull List<TrainCarFormationResponseDto> getTrainCarResponseDtosList() {
        TrainCarFormationResponseDto expect01 = new TrainCarFormationResponseDto("E5SER01", 1, "SEAT01", "指定席");
        TrainCarFormationResponseDto expect02 = new TrainCarFormationResponseDto("E5SER02", 2, "SEAT01", "指定席");

        return Arrays.asList(expect01, expect02);
    }

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("ダイヤコードを指定して車両編成が取得できる")
    void getTrainCarList_returnTrainCarListSuccess() {
        String scheduleCd = "TEST01";
        List<TrainCarFormationResponseDto> expectList = getTrainCarResponseDtosList();

        when(trainCarRepo.findTrainCarFormationByScheduleCd(scheduleCd)).thenReturn(expectList);

        List<TrainCarFormationResponseDto> actualList = service.getTrainCarList(scheduleCd);

        assertEquals(2, actualList.size());
        assertEquals(expectList, actualList);
    }
}
