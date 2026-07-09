package com.alab.shinkansendego.reservation;

import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeEntity;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.reservedseat.ReservedSeatEntity;
import com.alab.shinkansendego.reservedseat.ReservedSeatRepository;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionEntity;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionRepository;
import com.alab.shinkansendego.sectionkm.SectionKmRepository;
import org.jspecify.annotations.NonNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;

public class ReservationServiceTest {

    private final ReservationDto purchase = new ReservationDto("やまびこ1号", "THK01", "THK09", LocalDate.of(2026, 6, 1));
    private final UUID purchaseId1 = UUID.fromString("4156b939-2e3e-46c1-92d3-7aa64b6ca575");
    private final UUID purchaseId2 = UUID.fromString("3136b939-2e3e-46c1-92d3-7aa64b6ca666");
    private final List<ReservedScheduleDto> scheduleList = new ArrayList<>();
    private final List<ReservedSeatDto> seatList = new ArrayList<>();
    private final ReservedSeatDto seat1 = new ReservedSeatDto("指定席", 1, 1, "A", UUID.fromString("60a1ab63-a41f-430d-a2d1-10a76368d0f5"));
    private final ReservedSeatDto seat2 = new ReservedSeatDto("グリーン車", 9, 1, "A", UUID.fromString("3de8909e-32de-478e-bd9b-739f3fe6d6c3"));
    private final ReservedSeatDto seat3 = new ReservedSeatDto("グランクラス", 10, 1, "A", UUID.fromString("e192e5f1-318e-4d10-b76d-2f2bf15e8b70"));

    @Mock
    private ReservationRepository purchaseRepo;
    @Mock
    private ReservedSeatRepository purchasedSeatRepo;
    @Mock
    private SectionKmRepository sectionKmRepo;
    @Mock
    private DepartureArrivalTimeRepository departureArrivalTimeRepo;
    @Mock
    private ReservedSeatSectionRepository reservedSeatSectionRepo;
    private ReservationService service;
    private MockRestServiceServer mockRestServiceServer;

    private @NonNull ReservationResponseDto getExpectReservationResponseDto(UUID purchaseId) {
        List<ReservedSeatDto> reservedSeatList = Arrays.asList(seat1, seat2, seat3);
        return new ReservationResponseDto(
                purchaseId,
                "やまびこ1号",
                "東京",
                LocalTime.of(6, 4, 0),
                "仙台",
                LocalTime.of(7, 58, 0),
                LocalDate.of(2026, 6, 1),
                reservedSeatList);
    }

    private @NonNull List<ReservationEntity> getPurchaseList() {
        ReservationEntity purchase1 = new ReservationEntity();
        purchase1.setId(purchaseId1);
        purchase1.setRideDate(LocalDate.of(2026, 6, 1));
        purchase1.setScheduleCd("THK01");
        purchase1.setDepartureStationCd("THK01");
        purchase1.setArrivalStationCd("THK02");
        ReservationEntity purchase2 = new ReservationEntity();
        purchase2.setId(purchaseId2);
        purchase2.setRideDate(LocalDate.of(2026, 6, 1));
        purchase2.setScheduleCd("THK01");
        purchase2.setDepartureStationCd("THK01");
        purchase2.setArrivalStationCd("THK02");
        return Arrays.asList(purchase1, purchase2);
    }

    @Autowired
    private RestClient.Builder restClientBuilder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        restClientBuilder = RestClient.builder();
        this.mockRestServiceServer = MockRestServiceServer.bindTo(restClientBuilder).build();
        this.service = new ReservationService(
                purchaseRepo, purchasedSeatRepo, sectionKmRepo, departureArrivalTimeRepo, reservedSeatSectionRepo, restClientBuilder
        );
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
    @DisplayName("予約情報の全取得ができる")
    void getReservationList_returnGetReservationSuccess() {
        when(purchaseRepo.findAll(Sort.by("rideDate").ascending())).thenReturn(getPurchaseList());
        when(purchaseRepo.findReservationDtoByReservationId(purchaseId1)).thenReturn(purchase);
        when(purchaseRepo.findReservationScheduleDtoByReservationId(purchaseId1)).thenReturn(scheduleList);
        when(purchasedSeatRepo.findReservedSeatDtoByReservationId(purchaseId1)).thenReturn(seatList);
        when(purchaseRepo.findReservationDtoByReservationId(purchaseId2)).thenReturn(purchase);
        when(purchaseRepo.findReservationScheduleDtoByReservationId(purchaseId2)).thenReturn(scheduleList);
        when(purchasedSeatRepo.findReservedSeatDtoByReservationId(purchaseId2)).thenReturn(seatList);

        List<ReservationResponseDto> expectList = Arrays.asList(getExpectReservationResponseDto(purchaseId1), getExpectReservationResponseDto(purchaseId2));

        List<ReservationResponseDto> actualList = service.getReservationList();

        assertEquals(expectList, actualList);
    }

    @Test
    @DisplayName("購入情報IDから予約チケット情報が取得できる")
    void getReservation_withPurchaseId_returnGetReservationSuccess() {
        when(purchaseRepo.findReservationDtoByReservationId(purchaseId1)).thenReturn(purchase);
        when(purchaseRepo.findReservationScheduleDtoByReservationId(purchaseId1)).thenReturn(scheduleList);
        when(purchasedSeatRepo.findReservedSeatDtoByReservationId(purchaseId1)).thenReturn(seatList);

        ReservationResponseDto expect = getExpectReservationResponseDto(null);

        ReservationResponseDto actual = service.getReservation(purchaseId1);

        assertEquals(expect, actual);
    }

    @Test
    @DisplayName("購入情報データに存在しない購入情報IDがリクエストされた場合にエラーを発生させる")
    void getReservation_withNotExistPurchaseRequest_returnIllegalArgumentException() {
        when(purchaseRepo.findReservationDtoByReservationId(purchaseId1)).thenReturn(null);
        Exception ex = assertThrows(
                IllegalArgumentException.class,
                () -> service.getReservation(purchaseId1)
        );
        assertEquals("PurchaseId is Not found", ex.getMessage());
    }

    @Test
    @DisplayName("出発到着時刻データに存在しない出発駅CDを持つ購入情報IDがリクエストされた場合にエラーを発生させる")
    void getReservation_withNotExistScheduleOfDepartureStationRequest_returnIllegalArgumentException() {
        purchase.setDepartureStationCd("None");
        when(purchaseRepo.findReservationDtoByReservationId(purchaseId1)).thenReturn(purchase);
        when(purchaseRepo.findReservationScheduleDtoByReservationId(purchaseId1)).thenReturn(scheduleList);
        Exception ex = assertThrows(
                IllegalArgumentException.class,
                () -> service.getReservation(purchaseId1)
        );
        assertEquals("DepartureAndArrivalStation is Not Found", ex.getMessage());
    }

    @Test
    @DisplayName("出発到着時刻データに存在しない到着駅CDを持つ購入情報IDがリクエストされた場合にエラーを発生させる")
    void getReservation_withNotExistScheduleOfArrivalStationRequest_returnIllegalArgumentException() {
        purchase.setArrivalStationCd("None");
        when(purchaseRepo.findReservationDtoByReservationId(purchaseId1)).thenReturn(purchase);
        when(purchaseRepo.findReservationScheduleDtoByReservationId(purchaseId1)).thenReturn(scheduleList);
        Exception ex = assertThrows(
                IllegalArgumentException.class,
                () -> service.getReservation(purchaseId1)
        );
        assertEquals("DepartureAndArrivalStation is Not Found", ex.getMessage());
    }

    @Test
    @DisplayName("購入情報・購入座席情報を挿入できる")
    void savePurchase_withValidReserveRequestDto_returnInsertReservationId() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01002"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01003"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01004"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01005"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01006")));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getScheduleCd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        when(sectionKmRepo.findSectionCdByStartStationCd(request.getDepartureStationCd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(sectionKmRepo.findSectionCdByGoalStationCd(request.getArrivalStationCd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getScheduleCd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeAndArrivalTime(request.getScheduleCd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(purchaseRepo.save(any())).thenReturn(new ReservationEntity() {{
            setId(UUID.randomUUID());
        }});
        when(purchasedSeatRepo.saveAll(any())).thenReturn(Stream.generate(ReservedSeatEntity::new).limit(request.getSeats().size()).collect(Collectors.toList()));
        when(reservedSeatSectionRepo.saveAll(any())).
                thenReturn(Stream.generate(ReservedSeatSectionEntity::new).
                        limit((List.of(departureArrivalTime.getSectionCd())).size() * request.getSeats().size())
                        .collect(Collectors.toList()));
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();
        mockRequest.setRequestURI("/api/reservations");
        mockRequest.setServerName("localhost");
        mockRequest.setServerPort(8080);
        mockRequest.setScheme("http");

        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(mockRequest));

        this.mockRestServiceServer.expect(requestTo("http://localhost:8080/api/payments"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Content-Type", "application/json"))
                .andRespond(withStatus(HttpStatus.CREATED)
                        .contentType(MediaType.TEXT_PLAIN)
                        .body("paymentTrackingId"));
        UUID result = service.insertReservation(request);
        assertNotNull(result);
        this.mockRestServiceServer.verify();
    }

    @Test
    @DisplayName("座席リストが空の場合、IllegalArgumentExceptionが発生する")
    void savePurchase_withEmptySelectedSeatDto_throwsIllegalArgumentException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of());
        assertThrows(IllegalArgumentException.class, () -> service.insertReservation(request));
    }

    @Test
    @DisplayName("座席リストがnullの場合、IllegalArgumentExceptionが発生する")
    void savePurchase_withNullSelectedSeatDto_throwsIllegalArgumentException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", null);
        assertThrows(IllegalArgumentException.class, () -> service.insertReservation(request));
    }

    @Test
    @DisplayName("座席リストが6以上の場合、IllegalArgumentExceptionが発生する")
    void savePurchase_withMaxSelectedSeatDto_throwsIllegalArgumentException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001")));
        assertThrows(IllegalArgumentException.class, () -> service.insertReservation(request));
    }

    @Test
    @DisplayName("該当区間の出発到着時刻が存在しない場合、IllegalArgumentExceptionが発生する")
    void savePurchase_withNotExistingSection_throwsIllegalArgumentException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01002"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01003"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01004"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01005"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01006")));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getScheduleCd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        when(sectionKmRepo.findSectionCdByStartStationCd(request.getDepartureStationCd())).thenReturn(List.of());
        when(sectionKmRepo.findSectionCdByGoalStationCd(request.getArrivalStationCd())).thenReturn(List.of());
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getScheduleCd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(null);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeAndArrivalTime(request.getScheduleCd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of());

        assertThrows(IllegalArgumentException.class, () -> service.insertReservation(request));
    }

    @Test
    @DisplayName("同一購入情報IDで重複した座席を予約しようとした場合、DataAccessExceptionが発生する")
    void savePurchase_withSameSelectedSeatDto_throwsDataAccessException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001")));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getScheduleCd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        when(sectionKmRepo.findSectionCdByStartStationCd(request.getDepartureStationCd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(sectionKmRepo.findSectionCdByGoalStationCd(request.getArrivalStationCd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getScheduleCd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeAndArrivalTime(request.getScheduleCd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(purchaseRepo.save(any())).thenReturn(new ReservationEntity() {{
            setId(UUID.randomUUID());
        }});
        when(purchasedSeatRepo.saveAll(any()).size()).thenThrow(new DuplicateKeyException("UNIQUE制約エラー"));
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();
        mockRequest.setRequestURI("/api/reservations");
        mockRequest.setServerName("localhost");
        mockRequest.setServerPort(8080);
        mockRequest.setScheme("http");

        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(mockRequest));

        this.mockRestServiceServer.expect(requestTo("http://localhost:8080/api/payments"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Content-Type", "application/json"))
                .andRespond(withStatus(HttpStatus.CREATED)
                        .contentType(MediaType.TEXT_PLAIN)
                        .body("paymentTrackingId"));
        assertThrows(org.springframework.dao.DataAccessException.class, () -> service.insertReservation(request));
    }

    @Test
    @DisplayName("insertPurchaseが失敗した場合、RuntimeExceptionが発生する")
    void savePurchase_withInsertInsertReservationFails_throwsRuntimeException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001")));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getScheduleCd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        when(sectionKmRepo.findSectionCdByStartStationCd(request.getDepartureStationCd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(sectionKmRepo.findSectionCdByGoalStationCd(request.getArrivalStationCd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getScheduleCd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeAndArrivalTime(request.getScheduleCd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(purchaseRepo.save(any())).thenReturn(null);
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();
        mockRequest.setRequestURI("/api/reservations");
        mockRequest.setServerName("localhost");
        mockRequest.setServerPort(8080);
        mockRequest.setScheme("http");

        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(mockRequest));

        this.mockRestServiceServer.expect(requestTo("http://localhost:8080/api/payments"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Content-Type", "application/json"))
                .andRespond(withStatus(HttpStatus.CREATED)
                        .contentType(MediaType.TEXT_PLAIN)
                        .body("paymentTrackingId"));
        assertThrows(RuntimeException.class, () -> service.insertReservation(request));
    }

    @Test
    @DisplayName("saveAllが失敗した場合、RuntimeExceptionが発生する")
    void savePurchase_withInsertPurchasedFails_throwsRuntimeException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001")));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getScheduleCd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        when(sectionKmRepo.findSectionCdByStartStationCd(request.getDepartureStationCd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(sectionKmRepo.findSectionCdByGoalStationCd(request.getArrivalStationCd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getScheduleCd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeAndArrivalTime(request.getScheduleCd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(purchaseRepo.save(any())).thenReturn(new ReservationEntity() {{
            setId(UUID.randomUUID());
        }});
        when(purchasedSeatRepo.saveAll(any())).thenReturn(null);
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();
        mockRequest.setRequestURI("/api/reservations");
        mockRequest.setServerName("localhost");
        mockRequest.setServerPort(8080);
        mockRequest.setScheme("http");

        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(mockRequest));

        this.mockRestServiceServer.expect(requestTo("http://localhost:8080/api/payments"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Content-Type", "application/json"))
                .andRespond(withStatus(HttpStatus.CREATED)
                        .contentType(MediaType.TEXT_PLAIN)
                        .body("paymentTrackingId"));

        assertThrows(RuntimeException.class, () -> service.insertReservation(request));
    }

    @Test
    @DisplayName("既に予約済みの座席を予約しようとした場合、DataAccessExceptionが発生する")
    void savePurchase_withAlreadyReservedSeat_throwsDataAccessException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001")));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getScheduleCd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        when(sectionKmRepo.findSectionCdByStartStationCd(request.getDepartureStationCd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(sectionKmRepo.findSectionCdByGoalStationCd(request.getArrivalStationCd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getScheduleCd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeAndArrivalTime(request.getScheduleCd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(purchaseRepo.save(any())).thenReturn(new ReservationEntity() {{
            setId(UUID.randomUUID());
        }});
        when(purchasedSeatRepo.saveAll(any())).thenReturn(List.of(new ReservedSeatEntity(), new ReservedSeatEntity()));
        when(reservedSeatSectionRepo.saveAll(any())).thenThrow(new DuplicateKeyException("UNIQUE制約エラー"));
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();
        mockRequest.setRequestURI("/api/reservations");
        mockRequest.setServerName("localhost");
        mockRequest.setServerPort(8080);
        mockRequest.setScheme("http");

        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(mockRequest));

        this.mockRestServiceServer.expect(requestTo("http://localhost:8080/api/payments"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Content-Type", "application/json"))
                .andRespond(withStatus(HttpStatus.CREATED)
                        .contentType(MediaType.TEXT_PLAIN)
                        .body("paymentTrackingId"));

        assertThrows(org.springframework.dao.DataAccessException.class, () -> service.insertReservation(request));
    }

    @Test
    @DisplayName("saveAllReservedSeatSectionsが失敗した場合、RuntimeExceptionが発生する")
    void savePurchase_withSaveAllReservedSeatSectionsFails_throwsRuntimeException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001")));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();

        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getScheduleCd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");

        when(sectionKmRepo.findSectionCdByStartStationCd(request.getDepartureStationCd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(sectionKmRepo.findSectionCdByGoalStationCd(request.getArrivalStationCd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getScheduleCd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeAndArrivalTime(request.getScheduleCd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(purchaseRepo.save(any())).thenReturn(new ReservedSeatEntity() {{
            setId(UUID.randomUUID());
        }});
        when(purchasedSeatRepo.saveAll(any())).thenReturn(List.of(new ReservedSeatEntity(), new ReservedSeatEntity()));
        when(reservedSeatSectionRepo.saveAll(any())).thenReturn(List.of());
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();
        mockRequest.setRequestURI("/api/reservations");
        mockRequest.setServerName("localhost");
        mockRequest.setServerPort(8080);
        mockRequest.setScheme("http");

        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(mockRequest));

        this.mockRestServiceServer.expect(requestTo("http://localhost:8080/api/payments"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Content-Type", "application/json"))
                .andRespond(withStatus(HttpStatus.CREATED)
                        .contentType(MediaType.TEXT_PLAIN)
                        .body("paymentTrackingId"));

        assertThrows(RuntimeException.class, () -> service.insertReservation(request));
    }
}
