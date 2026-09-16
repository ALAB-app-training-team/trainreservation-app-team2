package com.alab.shinkansendego.traincar;

import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeEntity;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.facility.FacilityEntity;
import com.alab.shinkansendego.farekm.FareKmService;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionEntity;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionRepository;
import com.alab.shinkansendego.seattype.SeatTypeEntity;
import com.alab.shinkansendego.sectionkm.SectionKmEntity;
import com.alab.shinkansendego.sectionkm.SectionKmRepository;
import com.alab.shinkansendego.traincarfacility.TrainCarFacilityEntity;
import com.alab.shinkansendego.traincarfacility.TrainCarFacilityRepository;
import com.alab.shinkansendego.traincartype.TrainCarTypeEntity;
import com.alab.shinkansendego.utils.FacilityUtils;
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
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

public class TrainCarServiceTest {
    private final List<SeatDto> emptySeatList = new ArrayList<>();
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
    private TrainCarFacilityRepository trainCarFacilityRepo;
    @Mock
    private FareKmService fareKmService;
    @InjectMocks
    private TrainCarService service;

    private static @NonNull List<SeatDto> getSeatResponseDtosList() {
        SeatDto expect01 = new SeatDto("Test001", 1, "CAR01", "TestSeat1", 1, "T", 2610, false);
        SeatDto expect02 = new SeatDto("Test001", 1, "CAR01", "TestSeat2", 2, "E", 2610, true);
        SeatDto expect03 = new SeatDto("Test001", 1, "CAR01", "TestSeat3", 3, "S", 2610, false);
        SeatDto expect04 = new SeatDto("Test001", 1, "CAR01", "TestSeat4", 4, "T", 2610, true);
        return Arrays.asList(expect01, expect02, expect03, expect04);
    }

    private static @NonNull List<SeatDto> getIsreservedIsNullList() {
        SeatDto expect01 = new SeatDto("Test001", 1, "CAR01", "TestSeat1", 1, "T", 0, null);
        SeatDto expect02 = new SeatDto("Test001", 1, "CAR01", "TestSeat2", 2, "E", 0, null);
        SeatDto expect03 = new SeatDto("Test001", 1, "CAR01", "TestSeat3", 3, "S", 0, null);
        SeatDto expect04 = new SeatDto("Test001", 1, "CAR01", "TestSeat4", 4, "T", 0, null);
        return Arrays.asList(expect01, expect02, expect03, expect04);
    }

    private static @NonNull TrainCarFacilityEntity trainCarFacility(
        String trainCarFacilityCd, String facilityCd, String facilityName, String position) {
        return new TrainCarFacilityEntity(
            trainCarFacilityCd, "Test001", facilityCd, position, new FacilityEntity(facilityCd, facilityName));
    }

    private void stubSeatListQuery() {
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
        when(trainCarRepo.findByTrainCarCd(request.getTrainCarCd())).thenReturn(Optional.of(trainCarEntity));
        when(fareKmService.getFareFromDistance(20.0)).thenReturn(fares);
    }

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        request.setScheduleCd("Test01");
        request.setDate(LocalDate.of(2026, 6, 1));
        request.setDepartureTime(LocalTime.of(12, 0, 0));
        request.setArrivalTime(LocalTime.of(13, 0, 0));
        request.setTrainCarCd("Test001");
        sectionKmEntities.add(new SectionKmEntity("Test1", "Teststart01", "Testend01", 10.0, "UP"));
        sectionKmEntities.add(new SectionKmEntity("Test2", "Teststart02", "Testend02", 10.0, "UP"));
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
        trainCarEntity.setTrainCarCd("Test001");
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
        when(trainCarRepo.findByTrainCarCd(request.getTrainCarCd())).thenReturn(Optional.of(trainCarEntity));
        when(fareKmService.getFareFromDistance(20.0)).thenReturn(fares);
        when(trainCarFacilityRepo.findByTrainCarCd("Test001")).thenReturn(List.of(
            trainCarFacility("TCFC001", "FC001", FacilityUtils.UNISEX_RESTROOM, FacilityUtils.POSITION_REAR)
        ));

        List<SeatDto> expectList = getSeatResponseDtosList();

        SeatResponseDto actual = service.getSeatListWithReserved(request);

        assertEquals(4, actual.getSeats().size());
        assertEquals(expectList, actual.getSeats());
        assertFalse(actual.getFrontFacilities().getIsUnisexRestroom());
        assertTrue(actual.getRearFacilities().getIsUnisexRestroom());
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

    @Test
    @DisplayName("存在しない号車情報コードがリクエストされた場合にエラーを発生させる")
    void getSeatListWithReserved_withNotExistTrainCar_returnIllegalArgumentException() {
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
        Exception ex = assertThrows(
            IllegalArgumentException.class,
            () -> service.getSeatListWithReserved(request)
        );
        assertEquals("TrainCar is Not found", ex.getMessage());
    }

    @Test
    @DisplayName("前方・後方それぞれの設備情報を取得できる")
    void getSeatListWithReserved_returnFrontAndRearFacilities() {
        stubSeatListQuery();
        when(trainCarFacilityRepo.findByTrainCarCd("Test001")).thenReturn(List.of(
            trainCarFacility("TCFC001", "FC001", FacilityUtils.UNISEX_RESTROOM, FacilityUtils.POSITION_FRONT),
            trainCarFacility("TCFC002", "FC006", FacilityUtils.LUGGAGE_STORAGE, FacilityUtils.POSITION_FRONT),
            trainCarFacility("TCFC003", "FC004", FacilityUtils.WHEELCHAIR_RESTROOM, FacilityUtils.POSITION_REAR),
            trainCarFacility("TCFC004", "FC007", FacilityUtils.MULTIPURPOSE_ROOM, FacilityUtils.POSITION_REAR)
        ));

        SeatResponseDto actual = service.getSeatListWithReserved(request);

        assertEquals(
            new FacilityDto(FacilityUtils.POSITION_FRONT, true, false, false, false, false, true, false),
            actual.getFrontFacilities());
        assertEquals(
            new FacilityDto(FacilityUtils.POSITION_REAR, false, false, false, true, false, false, true),
            actual.getRearFacilities());
    }

    @Test
    @DisplayName("設備を持たない号車の場合、前方・後方ともにすべての設備情報がfalseになる")
    void getSeatListWithReserved_withNoFacility_returnAllFalseFacilities() {
        stubSeatListQuery();
        when(trainCarFacilityRepo.findByTrainCarCd("Test001")).thenReturn(new ArrayList<>());

        SeatResponseDto actual = service.getSeatListWithReserved(request);

        assertEquals(
            new FacilityDto(FacilityUtils.POSITION_FRONT, false, false, false, false, false, false, false),
            actual.getFrontFacilities());
        assertEquals(
            new FacilityDto(FacilityUtils.POSITION_REAR, false, false, false, false, false, false, false),
            actual.getRearFacilities());
    }

    @Test
    @DisplayName("前方にのみ設備がある号車の場合、後方の設備はすべてfalseになる")
    void getSeatListWithReserved_withFrontFacilityOnly_returnRearAllFalse() {
        stubSeatListQuery();
        when(trainCarFacilityRepo.findByTrainCarCd("Test001")).thenReturn(List.of(
            trainCarFacility("TCFC001", "FC002", FacilityUtils.MEN_RESTROOM, FacilityUtils.POSITION_FRONT),
            trainCarFacility("TCFC002", "FC003", FacilityUtils.WOMEN_RESTROOM, FacilityUtils.POSITION_FRONT),
            trainCarFacility("TCFC003", "FC005", FacilityUtils.BABY_CHANGING_TABLE, FacilityUtils.POSITION_FRONT)
        ));

        SeatResponseDto actual = service.getSeatListWithReserved(request);

        assertEquals(
            new FacilityDto(FacilityUtils.POSITION_FRONT, false, true, true, false, true, false, false),
            actual.getFrontFacilities());
        assertEquals(
            new FacilityDto(FacilityUtils.POSITION_REAR, false, false, false, false, false, false, false),
            actual.getRearFacilities());
    }

    @Test
    @DisplayName("後方にのみ設備がある号車の場合、前方の設備はすべてfalseになる")
    void getSeatListWithReserved_withRearFacilityOnly_returnFrontAllFalse() {
        stubSeatListQuery();
        when(trainCarFacilityRepo.findByTrainCarCd("Test001")).thenReturn(List.of(
            trainCarFacility("TCFC001", "FC002", FacilityUtils.MEN_RESTROOM, FacilityUtils.POSITION_REAR),
            trainCarFacility("TCFC002", "FC003", FacilityUtils.WOMEN_RESTROOM, FacilityUtils.POSITION_REAR),
            trainCarFacility("TCFC003", "FC005", FacilityUtils.BABY_CHANGING_TABLE, FacilityUtils.POSITION_REAR)
        ));

        SeatResponseDto actual = service.getSeatListWithReserved(request);

        assertEquals(
            new FacilityDto(FacilityUtils.POSITION_FRONT, false, false, false, false, false, false, false),
            actual.getFrontFacilities());
        assertEquals(
            new FacilityDto(FacilityUtils.POSITION_REAR, false, true, true, false, true, false, false),
            actual.getRearFacilities());
    }
}
