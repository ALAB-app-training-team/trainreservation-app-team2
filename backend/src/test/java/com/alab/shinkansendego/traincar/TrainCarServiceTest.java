package com.alab.shinkansendego.traincar;

import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeEntity;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.farekm.FareKmService;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionEntity;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionRepository;
import com.alab.shinkansendego.seattype.SeatTypeEntity;
import com.alab.shinkansendego.sectionkm.SectionKmEntity;
import com.alab.shinkansendego.sectionkm.SectionKmRepository;
import com.alab.shinkansendego.traincartype.TrainCarTypeEntity;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

public class TrainCarServiceTest {
    private final List<SeatResponseDto> emptySeatList = new ArrayList<>();
    private final List<String> emptySectionCdList = new ArrayList<>();
    private final List<DepartureArrivalTimeEntity> emptyDepartureArrivalTimeList = new ArrayList<>();
    private final SeatRequestDto request = new SeatRequestDto();
    private final List<SectionKmEntity> sectionKmEntities = new ArrayList<>();
    private final List<ReservedSeatSectionEntity> reservedSeatSectionEntities = new ArrayList<>();
    private final TrainCarEntity trainCarEntity = new TrainCarEntity();
    private final Map<String, Integer> fares = new HashMap<>();
    @Mock
    private TrainCarRepository trainCarRepo;
    @Mock
    private DepartureArrivalTimeRepository departureArrivalTimeRepo;
    @Mock
    private ReservedSeatSectionRepository reservedSeatSectionRepo;
    @Mock
    private SectionKmRepository sectionKmRepository;
    @Mock
    private FareKmService fareKmService;
    @InjectMocks
    private TrainCarService service;

    private static @NonNull List<SeatResponseDto> getSeatResponseDtosList() {
        SeatResponseDto expect01 = new SeatResponseDto("Test001", 1, "CAR01", "TestSeat1", 1, "T", 2610, false);
        SeatResponseDto expect02 = new SeatResponseDto("Test001", 1, "CAR01", "TestSeat2", 2, "E", 2610, true);
        SeatResponseDto expect03 = new SeatResponseDto("Test001", 1, "CAR01", "TestSeat3", 3, "S", 2610, false);
        SeatResponseDto expect04 = new SeatResponseDto("Test001", 1, "CAR01", "TestSeat4", 4, "T", 2610, true);
        return Arrays.asList(expect01, expect02, expect03, expect04);
    }

    private static @NonNull List<SeatResponseDto> getIsreservedIsNullList() {
        SeatResponseDto expect01 = new SeatResponseDto("Test001", 1, "CAR01", "TestSeat1", 1, "T", 0, null);
        SeatResponseDto expect02 = new SeatResponseDto("Test001", 1, "CAR01", "TestSeat2", 2, "E", 0, null);
        SeatResponseDto expect03 = new SeatResponseDto("Test001", 1, "CAR01", "TestSeat3", 3, "S", 0, null);
        SeatResponseDto expect04 = new SeatResponseDto("Test001", 1, "CAR01", "TestSeat4", 4, "T", 0, null);
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
        sectionKmEntities.add(new SectionKmEntity("Test1", "Teststart01", "Testend01", 10.0));
        sectionKmEntities.add(new SectionKmEntity("Test2", "Teststart02", "Testend02", 10.0));
        reservedSeatSectionEntities.add(new ReservedSeatSectionEntity(UUID.randomUUID(), UUID.randomUUID(), LocalDate.of(2026, 6, 1), "Test01",
            "Test001", "TestSeat2", "Test1", "CAR01"));
        reservedSeatSectionEntities.add(new ReservedSeatSectionEntity(UUID.randomUUID(), UUID.randomUUID(), LocalDate.of(2026, 6, 1), "Test01",
            "Test001", "TestSeat4", "Test1", "CAR01"));
        reservedSeatSectionEntities.add(new ReservedSeatSectionEntity(UUID.randomUUID(), UUID.randomUUID(), LocalDate.of(2026, 6, 1), "Test01",
            "Test001", "TestSeat4", "Test2", "CAR01"));
        TrainCarTypeEntity trainCarTypeEntity = new TrainCarTypeEntity();
        trainCarTypeEntity.setName("指定席");
        SeatTypeEntity seatTypeEntity = new SeatTypeEntity();
        seatTypeEntity.setTrainCarType(trainCarTypeEntity);
        trainCarEntity.setSeatType(seatTypeEntity);
        fares.put("reserved", 2610);
        fares.put("green", 2850);
        fares.put("gran-class", 9850);
    }

    @Test
    @DisplayName("号車コードから号車内の座席リストが取得できる")
    void getSeatListWithReserved_returnGetSeatListSuccess() {
        DepartureArrivalTimeEntity departureArrivalTime1 = new DepartureArrivalTimeEntity();
        DepartureArrivalTimeEntity departureArrivalTime2 = new DepartureArrivalTimeEntity();
        departureArrivalTime1.setSectionCd("Test1");
        departureArrivalTime2.setSectionCd("Test2");

        when(trainCarRepo.findSeatByTrainCarCd("Test001"))
            .thenReturn(getIsreservedIsNullList());
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeGreaterThanEqualAndArrivalTimeLessThanEqual(
            "Test01",
            LocalTime.of(12, 0, 0),
            LocalTime.of(13, 0, 0)))
            .thenReturn(List.of(departureArrivalTime1, departureArrivalTime2));
        when(reservedSeatSectionRepo.findByRideDateAndScheduleCdAndTrainCarCdAndReservedSectionCdOrderBySeatCd(
            LocalDate.of(2026, 6, 1),
            "Test01",
            "Test001",
            "Test1"))
            .thenReturn(List.of(reservedSeatSectionEntities.get(0), reservedSeatSectionEntities.get(1)));
        when(reservedSeatSectionRepo.findByRideDateAndScheduleCdAndTrainCarCdAndReservedSectionCdOrderBySeatCd(
            LocalDate.of(2026, 6, 1),
            "Test01",
            "Test001",
            "Test2"))
            .thenReturn(List.of(reservedSeatSectionEntities.get(2)));
        when(sectionKmRepository.findBySectionCdIn(List.of("Test1", "Test2"))).thenReturn(sectionKmEntities);
        when(trainCarRepo.findByTrainCarCd(request.getTrainCarCd())).thenReturn(trainCarEntity);
        when(fareKmService.getFareFromDistance(20.0)).thenReturn(fares);

        List<SeatResponseDto> expectList = getSeatResponseDtosList();

        List<SeatResponseDto> actualList = service.getSeatListWithReserved(request);

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
            () -> service.getSeatListWithReserved(request)
        );
        assertEquals("TrainCarCd is Not found", ex.getMessage());
    }

    @Test
    @DisplayName("出発到着時刻情報を持たないダイヤコードがリクエストされた場合にエラーを発生させる")
    void getSeatListWithReserved_withNotExistScheduleCdRequest_returnIllegalArgumentException() {
        when(trainCarRepo.findSeatByTrainCarCd("Test001"))
            .thenReturn(getIsreservedIsNullList());
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeGreaterThanEqualAndArrivalTimeLessThanEqual(
            "9999999",
            LocalTime.of(12, 0, 0),
            LocalTime.of(13, 0, 0)))
            .thenReturn(emptyDepartureArrivalTimeList);
        request.setScheduleCd("9999999");
        Exception ex = assertThrows(
            IllegalArgumentException.class,
            () -> service.getSeatListWithReserved(request)
        );
        assertEquals("SectionCdOfSeat is Not found", ex.getMessage());
    }
}
