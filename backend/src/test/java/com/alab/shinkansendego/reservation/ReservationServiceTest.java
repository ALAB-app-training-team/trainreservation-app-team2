package com.alab.shinkansendego.reservation;

import com.alab.shinkansendego.purchase.*;
import com.alab.shinkansendego.purchasedseat.*;
import org.jspecify.annotations.*;
import org.junit.jupiter.api.*;
import org.mockito.*;

import java.time.*;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ReservationServiceTest {

    private final ReservationDto purchase = new ReservationDto("やまびこ1号", "THK01", "THK09", LocalDate.of(2026, 6, 1));
    private final UUID purchaseId = UUID.fromString("4156b939-2e3e-46c1-92d3-7aa64b6ca575");
    private final List<ReservedScheduleDto> scheduleList = new ArrayList<>();
    private final List<ReservedSeatDto> seatList = new ArrayList<>();
    private final ReservedSeatDto seat1 = new ReservedSeatDto("指定席", 1, 1, "A", "60a1ab63-a41f-430d-a2d1-10a76368d0f5");
    private final ReservedSeatDto seat2 = new ReservedSeatDto("グリーン車", 9, 1, "A", "3de8909e-32de-478e-bd9b-739f3fe6d6c3");
    private final ReservedSeatDto seat3 = new ReservedSeatDto("グランクラス", 10, 1, "A", "e192e5f1-318e-4d10-b76d-2f2bf15e8b70");

    @Mock
    private PurchaseRepository purchaseRepo;
    @Mock
    private PurchasedSeatRepository purchasedSeatRepo;
    @InjectMocks
    private ReservationService service;

    private @NonNull ReservationResponseDto getExpectReservationResponseDto() {
        List<ReservedSeatDto> reservedSeatList = Arrays.asList(seat1, seat2, seat3);
        return new ReservationResponseDto(
                "やまびこ1号",
                "東京",
                LocalTime.of(6, 4, 0),
                "仙台",
                LocalTime.of(7, 58, 0),
                LocalDate.of(2026, 6, 1),
                reservedSeatList);
    }

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        scheduleList.clear();
        ReservedScheduleDto schedule1 = new ReservedScheduleDto(LocalTime.of(6, 4, 0), "THK01", "東京", LocalTime.of(6, 9, 0), "THK02", "上野");
        ReservedScheduleDto schedule2 = new ReservedScheduleDto(LocalTime.of(6, 10, 0), "THK02", "上野", LocalTime.of(6, 28, 0), "CMN01", "大宮");
        ReservedScheduleDto schedule3 = new ReservedScheduleDto(LocalTime.of(6, 29, 0), "CMN01", "大宮", LocalTime.of(6, 52, 0), "THK04", "宇都宮");
        ReservedScheduleDto schedule4 = new ReservedScheduleDto(LocalTime.of(6, 53, 0), "THK04", "宇都宮", LocalTime.of(7, 23, 0), "THK07", "郡山");
        ReservedScheduleDto schedule5 = new ReservedScheduleDto(LocalTime.of(7, 24, 0), "THK07", "郡山", LocalTime.of(7, 37, 0), "CMN02", "福島");
        ReservedScheduleDto schedule6 = new ReservedScheduleDto(LocalTime.of(7, 38, 0), "CMN02", "福島", LocalTime.of(7, 58, 0), "THK09", "仙台");
        ReservedScheduleDto schedule7 = new ReservedScheduleDto(LocalTime.of(8, 0, 0), "THK09", "仙台", LocalTime.of(8, 12, 0), "THK10", "古川");
        ReservedScheduleDto schedule8 = new ReservedScheduleDto(LocalTime.of(8, 17, 0), "THK10", "古川", LocalTime.of(8, 26, 0), "THK11", "くりこま高原");
        ReservedScheduleDto schedule9 = new ReservedScheduleDto(LocalTime.of(8, 26, 0), "THK11", "くりこま高原", LocalTime.of(8, 35, 0), "THK12", "一ノ関");
        ReservedScheduleDto schedule10 = new ReservedScheduleDto(LocalTime.of(8, 36, 0), "THK12", "一ノ関", LocalTime.of(8, 45, 0), "THK13", "水沢江刺");
        ReservedScheduleDto schedule11 = new ReservedScheduleDto(LocalTime.of(8, 46, 0), "THK13", "水沢江刺", LocalTime.of(8, 54, 0), "THK14", "北上");
        ReservedScheduleDto schedule12 = new ReservedScheduleDto(LocalTime.of(8, 58, 0), "THK14", "北上", LocalTime.of(9, 5, 0), "THK15", "新花巻");
        ReservedScheduleDto schedule13 = new ReservedScheduleDto(LocalTime.of(9, 6, 0), "THK15", "新花巻", LocalTime.of(9, 17, 0), "CMN03", "盛岡");
        scheduleList.addAll(Arrays.asList(schedule1, schedule2, schedule3, schedule4, schedule5, schedule6, schedule7, schedule8, schedule9, schedule10, schedule11, schedule12, schedule13));
        seatList.clear();
        seatList.addAll(Arrays.asList(seat1, seat2, seat3));
    }

    @Test
    @DisplayName("購入情報IDから予約チケット情報が取得できる")
    void getReservation_withPurchaseId_returnGetReservationSuccess() {
        when(purchaseRepo.findReservationDtoByPurchaseId(purchaseId)).thenReturn(purchase);
        when(purchaseRepo.findReservationScheduleDtoByPurchaseId(purchaseId)).thenReturn(scheduleList);
        when(purchasedSeatRepo.findReservedSeatDtoByPurchaseId(purchaseId)).thenReturn(seatList);

        ReservationResponseDto expect = getExpectReservationResponseDto();

        ReservationResponseDto actual = service.getReservation(purchaseId);

        assertEquals(expect, actual);
    }

    @Test
    @DisplayName("購入情報データに存在しない購入情報IDがリクエストされた場合にエラーを発生させる")
    void getReservation_withNotExistPurchaseRequest_returnIllegalArgumentException() {
        when(purchaseRepo.findReservationDtoByPurchaseId(purchaseId)).thenReturn(null);
        Exception ex = assertThrows(
                IllegalArgumentException.class,
                () -> service.getReservation(purchaseId)
        );
        assertEquals("PurchaseId is Not found", ex.getMessage());
    }

    @Test
    @DisplayName("出発到着時刻データに存在しない出発駅CDを持つ購入情報IDがリクエストされた場合にエラーを発生させる")
    void getReservation_withNotExistScheduleOfDepartureStationRequest_returnIllegalArgumentException() {
        purchase.setDepartureStationCd("None");
        when(purchaseRepo.findReservationDtoByPurchaseId(purchaseId)).thenReturn(purchase);
        when(purchaseRepo.findReservationScheduleDtoByPurchaseId(purchaseId)).thenReturn(scheduleList);
        Exception ex = assertThrows(
                IllegalArgumentException.class,
                () -> service.getReservation(purchaseId)
        );
        assertEquals("DepartureAndArrivalStation is Not Found", ex.getMessage());
    }

    @Test
    @DisplayName("出発到着時刻データに存在しない到着駅CDを持つ購入情報IDがリクエストされた場合にエラーを発生させる")
    void getReservation_withNotExistScheduleOfArrivalStationRequest_returnIllegalArgumentException() {
        purchase.setArrivalStationCd("None");
        when(purchaseRepo.findReservationDtoByPurchaseId(purchaseId)).thenReturn(purchase);
        when(purchaseRepo.findReservationScheduleDtoByPurchaseId(purchaseId)).thenReturn(scheduleList);
        Exception ex = assertThrows(
                IllegalArgumentException.class,
                () -> service.getReservation(purchaseId)
        );
        assertEquals("DepartureAndArrivalStation is Not Found", ex.getMessage());
    }

}
