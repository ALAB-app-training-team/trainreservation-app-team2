package com.alab.shinkansendego.features.schedule.services;

import com.alab.shinkansendego.features.schedule.dtos.SeatRequestDto;
import com.alab.shinkansendego.features.schedule.dtos.SeatResponseDto;
import com.alab.shinkansendego.features.schedule.repositories.TrainCarRepository;
import com.alab.shinkansendego.features.schedule.servicies.SeatService;
import org.jspecify.annotations.NonNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

public class SeatServiceTest {

    private final List<SeatResponseDto> emptySeatList = new ArrayList<>();
    private final SeatRequestDto request = new SeatRequestDto();

    @Mock
    private TrainCarRepository trainCarRepo;
    @InjectMocks
    private SeatService service;

    private static @NonNull List<SeatResponseDto> getSeatResponseDtosList() {
        SeatResponseDto expect01 = new SeatResponseDto("Test001", 1, "TestSeat1", 1, "T", false);
        SeatResponseDto expect02 = new SeatResponseDto("Test001", 1, "TestSeat2", 2, "E", true);
        SeatResponseDto expect03 = new SeatResponseDto("Test001", 1, "TestSeat3", 3, "S", false);
        SeatResponseDto expect04 = new SeatResponseDto("Test001", 1, "TestSeat4", 4, "T", true);
        return Arrays.asList(expect01, expect02, expect03, expect04);
    }

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        request.setSchedule_cd("Test01");
        request.setDate(LocalDate.of(2026, 6, 1));
        request.setDeparture_station_cd("Test1");
        request.setDeparture_time(LocalTime.of(12, 0, 0));
        request.setArrival_station_cd("Test2");
        request.setArrival_time(LocalTime.of(13, 0, 0));
        request.setTrain_car_cd("Test001");
    }

    @Test
    @DisplayName("号車コードから号車内の座席リストが取得できる")
    void getSeatListByTrainCar_returnGetSeatListSuccess() {
        when(trainCarRepo.findSeatByTrainCarCd("Test001")).thenReturn(getSeatResponseDtosList());

        List<SeatResponseDto> expectList = getSeatResponseDtosList();

        List<SeatResponseDto> actualList = service.getSeatListByTrainCar(request);

        assertEquals(4, actualList.size());
        assertEquals(expectList, actualList);
    }

    @Test
    @DisplayName("座席情報を持たない号車コードがリクエストされた場合にエラーを発生させる")
    void getSearchedScheduleByStation_withNotExistStartSectionRequest_returnIllegalArgumentException() {
        when(trainCarRepo.findSeatByTrainCarCd("9999999")).thenReturn(emptySeatList);
        request.setTrain_car_cd("9999999");
        Exception ex = assertThrows(
                IllegalArgumentException.class,
                () -> service.getSeatListByTrainCar(request)
        );
        assertEquals("TrainCarCd is Not found", ex.getMessage());
    }
}
