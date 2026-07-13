package com.alab.shinkansendego.traincar;

import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionRepository;
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

public class TrainCarServiceTest {

    private final List<SeatResponseDto> emptySeatList = new ArrayList<>();
    private final List<String> emptySectionCdList = new ArrayList<>();
    private final SeatRequestDto request = new SeatRequestDto();

    @Mock
    private TrainCarRepository trainCarRepo;
    @Mock
    private DepartureArrivalTimeRepository departureArrivalTimeRepo;
    @Mock
    private ReservedSeatSectionRepository reservedSeatSectionRepo;
    @InjectMocks
    private TrainCarService service;

    private static @NonNull List<SeatResponseDto> getSeatResponseDtosList() {
        SeatResponseDto expect01 = new SeatResponseDto("Test001", 1, "TestSeat1", 1, "T", false);
        SeatResponseDto expect02 = new SeatResponseDto("Test001", 1, "TestSeat2", 2, "E", true);
        SeatResponseDto expect03 = new SeatResponseDto("Test001", 1, "TestSeat3", 3, "S", false);
        SeatResponseDto expect04 = new SeatResponseDto("Test001", 1, "TestSeat4", 4, "T", true);
        return Arrays.asList(expect01, expect02, expect03, expect04);
    }

    private static @NonNull List<SeatResponseDto> getIsreservedIsNullList() {
        SeatResponseDto expect01 = new SeatResponseDto("Test001", 1, "TestSeat1", 1, "T", null);
        SeatResponseDto expect02 = new SeatResponseDto("Test001", 1, "TestSeat2", 2, "E", null);
        SeatResponseDto expect03 = new SeatResponseDto("Test001", 1, "TestSeat3", 3, "S", null);
        SeatResponseDto expect04 = new SeatResponseDto("Test001", 1, "TestSeat4", 4, "T", null);
        return Arrays.asList(expect01, expect02, expect03, expect04);
    }

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        request.setScheduleCd("Test01");
        request.setDate(LocalDate.of(2026, 6, 1));
        request.setDepartureTime(LocalTime.of(12, 0, 0));
        request.setArrivalTime(LocalTime.of(13, 0, 0));
        request.setTrainCarCd("Test001");
    }

    @Test
    @DisplayName("号車コードから号車内の座席リストが取得できる")
    void getSeatListWithReserved_returnGetSeatListSuccess() {
        when(trainCarRepo.findSeatByTrainCarCd("Test001"))
                .thenReturn(getIsreservedIsNullList());
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeAndArrivalTime(
                "Test01",
                LocalTime.of(12, 0, 0),
                LocalTime.of(13, 0, 0)))
                .thenReturn(List.of("Test1", "Test2"));
        when(reservedSeatSectionRepo.findReservedSeatCdByRideDateAndScheduleCdAndTrainCarCdAndReservedSeatSectionCd(
                LocalDate.of(2026, 6, 1),
                "Test01",
                "Test001",
                "Test1"))
                .thenReturn(List.of("TestSeat2", "TestSeat4"));
        when(reservedSeatSectionRepo.findReservedSeatCdByRideDateAndScheduleCdAndTrainCarCdAndReservedSeatSectionCd(
                LocalDate.of(2026, 6, 1),
                "Test01",
                "Test001",
                "Test2"))
                .thenReturn(List.of("TestSeat4"));

        List<SeatResponseDto> expectList = getSeatResponseDtosList();

        List<SeatResponseDto> actualList = service.getSeatListWithReserved("Test001", request);

        assertEquals(4, actualList.size());
        assertEquals(expectList, actualList);
    }

    @Test
    @DisplayName("座席情報を持たない号車コードがリクエストされた場合にエラーを発生させる")
    void getSeatListWithReserved_withNotExistTrainCarCdRequest_returnIllegalArgumentException() {
        when(trainCarRepo.findSeatByTrainCarCd("9999999")).thenReturn(emptySeatList);
        request.setTrainCarCd("9999999");
        Exception ex = assertThrows(
                IllegalArgumentException.class,
                () -> service.getSeatListWithReserved("9999999", request)
        );
        assertEquals("TrainCarCd is Not found", ex.getMessage());
    }

    @Test
    @DisplayName("出発到着時刻情報を持たないダイヤコードがリクエストされた場合にエラーを発生させる")
    void getSeatListWithReserved_withNotExistScheduleCdRequest_returnIllegalArgumentException() {
        when(trainCarRepo.findSeatByTrainCarCd("Test001"))
                .thenReturn(getIsreservedIsNullList());
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeAndArrivalTime(
                "9999999",
                LocalTime.of(12, 0, 0),
                LocalTime.of(13, 0, 0)))
                .thenReturn(emptySectionCdList);
        request.setScheduleCd("9999999");
        Exception ex = assertThrows(
                IllegalArgumentException.class,
                () -> service.getSeatListWithReserved("Test001", request)
        );
        assertEquals("SectionCdOfSeat is Not found", ex.getMessage());
    }
}
