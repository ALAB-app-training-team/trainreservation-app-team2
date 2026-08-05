package com.alab.shinkansendego.reservation;

import com.alab.shinkansendego.account.AccountEntity;
import com.alab.shinkansendego.account.AccountRepository;
import com.alab.shinkansendego.account.AccountSessionDto;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeEntity;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.reservedseat.ReservedSeatEntity;
import com.alab.shinkansendego.reservedseat.ReservedSeatRepository;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionEntity;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionRepository;
import com.alab.shinkansendego.schedule.ScheduleEntity;
import com.alab.shinkansendego.seat.SeatEntity;
import com.alab.shinkansendego.seat.SeatRepository;
import com.alab.shinkansendego.seattype.SeatTypeEntity;
import com.alab.shinkansendego.sectionkm.SectionKmEntity;
import com.alab.shinkansendego.sectionkm.SectionKmRepository;
import com.alab.shinkansendego.station.StationEntity;
import com.alab.shinkansendego.trainSeries.TrainSeriesEntity;
import com.alab.shinkansendego.traincar.TrainCarEntity;
import com.alab.shinkansendego.traincar.TrainCarRepository;
import com.alab.shinkansendego.traincartype.TrainCarTypeEntity;
import com.alab.shinkansendego.traintype.TrainTypeEntity;
import org.jspecify.annotations.NonNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;

public class ReservationServiceTest {
    private final Optional<ReservationEntity> reservation = Optional.of(new ReservationEntity());
    private final UUID reservationId1 = UUID.fromString("4156b939-2e3e-46c1-92d3-7aa64b6ca575");
    private final UUID reservationId2 = UUID.fromString("3136b939-2e3e-46c1-92d3-7aa64b6ca666");
    private final ReservedSeatDto seat1 = new ReservedSeatDto(UUID.fromString("60a1ab63-a41f-430d-a2d1-10a76368d0f5"), "指定席", 1, 1, "A", UUID.fromString("60a1ab63-a41f-430d-a2d1-10a76368d0f5"), 5000, "一般太郎");
    private final ReservedSeatDto seat2 = new ReservedSeatDto(UUID.fromString("3de8909e-32de-478e-bd9b-739f3fe6d6c3"), "グリーン車", 9, 1, "A", UUID.fromString("3de8909e-32de-478e-bd9b-739f3fe6d6c3"), 10000, "一般次郎");
    private final ReservedSeatDto seat3 = new ReservedSeatDto(UUID.fromString("e192e5f1-318e-4d10-b76d-2f2bf15e8b70"), "グランクラス", 10, 1, "A", UUID.fromString("e192e5f1-318e-4d10-b76d-2f2bf15e8b70"), 15000, "一般三郎");
    private final UUID accountId = UUID.fromString("f79d8bbc-fcba-b538-b132-2f726ce0120c");
    private final UUID noReservationAccountId = UUID.fromString("f79d8bbc-fcba-b538-b132-2f726ce0120c");
    private final AccountSessionDto session = new AccountSessionDto(accountId, "test-common@test.com", "一般太郎");
    private final AccountEntity account = new AccountEntity();
    @Mock
    private ReservationRepository reservationRepo;
    @Mock
    private ReservedSeatRepository reservedSeatRepo;
    @Mock
    private SectionKmRepository sectionKmRepo;
    @Mock
    private DepartureArrivalTimeRepository departureArrivalTimeRepo;
    @Mock
    private ReservedSeatSectionRepository reservedSeatSectionRepo;
    @Mock
    private TrainCarRepository trainCarRepo;
    @Mock
    private SeatRepository seatRepo;
    @Mock
    private AccountRepository accountRepo;
    private ReservationService service;
    private MockRestServiceServer mockRestServiceServer;
    @Autowired
    private RestClient.Builder restClientBuilder;

    private @NonNull ReservationResponseDto getExpectReservationResponseDto(UUID reservationId) {
        List<ReservedSeatDto> reservedSeatList = Arrays.asList(seat1, seat2, seat3);
        return new ReservationResponseDto(
            reservationId,
            "Test01",
            "やまびこ1号",
            "THK01",
            "東京",
            LocalTime.of(6, 4, 0),
            "THK09",
            "仙台",
            LocalTime.of(7, 58, 0),
            LocalDate.of(2026, 6, 1),
            false,
            reservedSeatList);
    }

    /**
     * 予約一覧に関するテストケースのインスタンスを作成するためのメソッド
     *
     * @return DepartureArrivalTimeEntity
     */
    private @NonNull DepartureArrivalTimeEntity buildSchedule(LocalTime departureTime, String departureStationCd, String departureStationName, LocalTime arrivalTime, String arrivalStationCd, String arrivalStationName) {
        StationEntity startStation = new StationEntity(departureStationCd, departureStationName);
        StationEntity goalStation = new StationEntity(arrivalStationCd, arrivalStationName);
        SectionKmEntity sectionKm = new SectionKmEntity();
        sectionKm.setStartStationCd(departureStationCd);
        sectionKm.setGoalStationCd(arrivalStationCd);
        sectionKm.setStartStation(startStation);
        sectionKm.setGoalStation(goalStation);
        DepartureArrivalTimeEntity schedule = new DepartureArrivalTimeEntity();
        schedule.setDepartureTime(departureTime);
        schedule.setArrivalTime(arrivalTime);
        schedule.setSectionKm(sectionKm);
        return schedule;
    }

    /**
     * 予約一覧に関するテストケースのインスタンスを作成するためのメソッド
     *
     * @return ReservedSeatEntity
     */
    private @NonNull ReservedSeatEntity buildSeat(UUID reservationId, String trainCarTypeName, Integer trainCarNumber, Integer seatNumber, String seatColumn, UUID codeToken, Integer seatFare) {
        TrainCarTypeEntity trainCarType = new TrainCarTypeEntity();
        trainCarType.setName(trainCarTypeName);
        SeatTypeEntity seatType = new SeatTypeEntity();
        seatType.setTrainCarType(trainCarType);
        TrainCarEntity trainCar = new TrainCarEntity();
        trainCar.setTrainCarNumber(trainCarNumber);
        trainCar.setSeatType(seatType);
        SeatEntity seat = new SeatEntity();
        seat.setSeatNumber(seatNumber);
        seat.setSeatColumn(seatColumn);
        ReservedSeatEntity reservedSeat = new ReservedSeatEntity();
        reservedSeat.setReservationId(reservationId);
        reservedSeat.setCodeToken(codeToken);
        reservedSeat.setSeatFare(seatFare);
        reservedSeat.setTrainCar(trainCar);
        reservedSeat.setSeat(seat);
        reservedSeat.setSeatFare(seatFare);
        return reservedSeat;
    }

    /**
     * 予約一覧に関するテストケースのインスタンスを作成するためのメソッド
     *
     * @return ReservationEntity
     */
    private @NonNull ReservationEntity buildReservation(UUID id) {
        TrainTypeEntity trainType = new TrainTypeEntity();
        trainType.setName("やまびこ1号");
        ScheduleEntity schedule = new ScheduleEntity();
        schedule.setTrainType(trainType);

        DepartureArrivalTimeEntity departure = buildSchedule(LocalTime.of(6, 4, 0), "THK01", "東京", LocalTime.of(6, 9, 0), "THK02", "上野");
        DepartureArrivalTimeEntity dummy = buildSchedule(LocalTime.of(7, 0, 0), "THK05", "郡山", LocalTime.of(7, 30, 0), "THK06", "福島");
        DepartureArrivalTimeEntity arrival = buildSchedule(LocalTime.of(7, 50, 0), "THK08", "白石", LocalTime.of(7, 58, 0), "THK09", "仙台");

        Set<ReservedSeatEntity> seats = Set.of(
            buildSeat(id, "指定席", 1, 1, "A", UUID.fromString("60a1ab63-a41f-430d-a2d1-10a76368d0f5"), 5000),
            buildSeat(id, "グリーン車", 9, 1, "A", UUID.fromString("3de8909e-32de-478e-bd9b-739f3fe6d6c3"), 10000)
        );

        ReservationEntity reservation = new ReservationEntity();
        reservation.setId(id);
        reservation.setRideDate(LocalDate.of(2026, 6, 1));
        reservation.setScheduleCd("THK01");
        reservation.setDepartureStationCd("THK01");
        reservation.setArrivalStationCd("THK09");
        reservation.setIsDeleted(false);
        reservation.setSchedule(schedule);
        reservation.setDepartureArrivalTime(Set.of(departure, dummy, arrival));
        reservation.setReservedSeat(seats);
        return reservation;
    }

    /**
     * 予約削除に関するテストケースのインスタンスを作成するためのメソッド（予約情報）
     *
     * @return ReservationEntity
     */
    private @NonNull ReservationEntity getReservation(UUID reservationId) {
        ReservationEntity reservation = new ReservationEntity();
        reservation.setId(reservationId);
        reservation.setRideDate(LocalDate.now());
        reservation.setScheduleCd("THK01");
        reservation.setDepartureStationCd("THK01");
        reservation.setArrivalStationCd("THK02");
        reservation.setPaymentTrackingId(UUID.randomUUID().toString());
        reservation.setReserverName("User");
        reservation.setReserverMail("test@test.co.jp");
        reservation.setIsDeleted(false);
        return reservation;
    }

    /**
     * 予約削除に関するテストケースのインスタンスを作成するためのメソッド（予約座席除法）
     *
     * @return List<ReservedSeatEntity>
     */
    private @NonNull List<ReservedSeatEntity> getReservedSeats(UUID reservationId) {
        ReservedSeatEntity seat1 = new ReservedSeatEntity();
        seat1.setId(UUID.randomUUID());
        seat1.setReservationId(reservationId);
        seat1.setTrainCarCd("E5SER01");
        seat1.setSeatCd("SEAT01001");
        seat1.setCodeToken(UUID.randomUUID());
        seat1.setSeatFare(2600);
        seat1.setIsDeleted(false);
        ReservedSeatEntity seat2 = new ReservedSeatEntity();
        seat2.setId(UUID.randomUUID());
        seat2.setReservationId(reservationId);
        seat2.setTrainCarCd("E5SER01");
        seat2.setSeatCd("SEAT01005");
        seat2.setCodeToken(UUID.randomUUID());
        seat2.setSeatFare(2600);
        seat2.setIsDeleted(false);
        return Arrays.asList(seat1, seat2);
    }

    /**
     * 予約削除に関するテストケースのインスタンスを作成するためのメソッド（予約済座席区間）
     *
     * @return List<ReservedSeatSectionEntity>
     */
    private @NonNull List<ReservedSeatSectionEntity> getReservedSeatSections(UUID reservationId) {
        ReservedSeatSectionEntity section1
            = new ReservedSeatSectionEntity(UUID.randomUUID(), reservationId, LocalDate.now(), "THK01", "E5SER01", "SEAT01001", "THK01", "CAR01");
        ReservedSeatSectionEntity section2
            = new ReservedSeatSectionEntity(UUID.randomUUID(), reservationId, LocalDate.now(), "THK01", "E5SER01", "SEAT01005", "THK01", "CAR01");
        return Arrays.asList(section1, section2);
    }

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        restClientBuilder = RestClient.builder();
        this.mockRestServiceServer = MockRestServiceServer.bindTo(restClientBuilder).build();
        this.service = new ReservationService(
            reservationRepo, reservedSeatRepo, sectionKmRepo, departureArrivalTimeRepo, reservedSeatSectionRepo, trainCarRepo, seatRepo, accountRepo, restClientBuilder
        );

        DepartureArrivalTimeEntity departureArrivalTime1 = buildSchedule(LocalTime.of(6, 4, 0), "THK01", "東京", LocalTime.of(6, 9, 0), "THK02", "上野");
        DepartureArrivalTimeEntity departureArrivalTime2 = buildSchedule(LocalTime.of(6, 10, 0), "THK02", "上野", LocalTime.of(6, 28, 0), "CMN01", "大宮");
        DepartureArrivalTimeEntity departureArrivalTime3 = buildSchedule(LocalTime.of(6, 29, 0), "CMN01", "大宮", LocalTime.of(6, 52, 0), "THK04", "宇都宮");
        DepartureArrivalTimeEntity departureArrivalTime4 = buildSchedule(LocalTime.of(6, 53, 0), "THK04", "宇都宮", LocalTime.of(7, 23, 0), "THK07", "郡山");
        DepartureArrivalTimeEntity departureArrivalTime5 = buildSchedule(LocalTime.of(7, 24, 0), "THK07", "郡山", LocalTime.of(7, 37, 0), "CMN02", "福島");
        DepartureArrivalTimeEntity departureArrivalTime6 = buildSchedule(LocalTime.of(7, 38, 0), "CMN02", "福島", LocalTime.of(7, 58, 0), "THK09", "仙台");
        DepartureArrivalTimeEntity departureArrivalTime7 = buildSchedule(LocalTime.of(8, 0, 0), "THK09", "仙台", LocalTime.of(8, 12, 0), "THK10", "古川");

        Set<ReservedSeatEntity> seats = Set.of(
            buildSeat(reservationId1, "指定席", 1, 1, "A", UUID.fromString("60a1ab63-a41f-430d-a2d1-10a76368d0f5"), 5000),
            buildSeat(reservationId1, "グリーン車", 9, 1, "A", UUID.fromString("3de8909e-32de-478e-bd9b-739f3fe6d6c3"), 10000),
            buildSeat(reservationId1, "グランクラス", 10, 1, "A", UUID.fromString("e192e5f1-318e-4d10-b76d-2f2bf15e8b70"), 15000)
        );

        reservation.get().setId(reservationId1);
        reservation.get().setDepartureArrivalTime(Set.of(departureArrivalTime1, departureArrivalTime2, departureArrivalTime3, departureArrivalTime4, departureArrivalTime5, departureArrivalTime6, departureArrivalTime7));

        TrainTypeEntity trainType = new TrainTypeEntity("YM001", "やまびこ1号", "E5SER", new TrainSeriesEntity());
        ScheduleEntity schedule = new ScheduleEntity("Test01", "YM001", trainType);
        reservation.get().setScheduleCd("Test01");
        reservation.get().setDepartureStationCd("THK01");
        reservation.get().setArrivalStationCd("THK09");
        reservation.get().setRideDate(LocalDate.of(2026, 6, 1));
        reservation.get().setIsDeleted(false);
        reservation.get().setSchedule(schedule);
        reservation.get().setReservedSeat(seats);
        reservation.get().setDepartureArrivalTime(Set.of(departureArrivalTime1, departureArrivalTime2, departureArrivalTime3, departureArrivalTime4, departureArrivalTime5, departureArrivalTime6, departureArrivalTime7));
        account.setId(UUID.fromString("f79d8bbc-fcba-b538-b132-2f726ce0120c"));
        account.setName("一般太郎");
        account.setMail("test-common@test.com");
    }

    @Test
    @DisplayName("予約者氏名とメールアドレスで予約した予約情報の一覧取得ができる")
    void getReservationList_withSession_returnGetReservationSuccess() {
        List<ReservationEntity> reservationList = Arrays.asList(buildReservation(reservationId1), buildReservation(reservationId2));
        when(reservationRepo.findByAccountId(ArgumentMatchers.any(UUID.class))).thenReturn(reservationList);

        List<ReservationResponseDto> result = service.getReservationList(accountId);

        assertAll(
            () -> assertEquals(2, result.size()),
            () -> assertEquals(reservationId1, result.getFirst().getReservationId()),
            () -> assertEquals("やまびこ1号", result.getFirst().getTrainTypeName()),
            () -> assertEquals("東京", result.getFirst().getDepartureStationName()),
            () -> assertEquals(LocalTime.of(6, 4, 0), result.getFirst().getDepartureTime()),
            () -> assertEquals("仙台", result.getFirst().getArrivalStationName()),
            () -> assertEquals(LocalTime.of(7, 58, 0), result.getFirst().getArrivalTime()),
            () -> assertEquals(LocalDate.of(2026, 6, 1), result.getFirst().getRideDate()),
            () -> assertEquals(2, result.getFirst().getReservedSeats().size()),
            () -> assertEquals("指定席", result.getFirst().getReservedSeats().getFirst().getTrainCarTypeName()),
            () -> assertEquals(5000, result.getFirst().getReservedSeats().getFirst().getSeatFare())
        );
    }

    @Test
    @DisplayName("予約者情報に一致する予約がなかった場合に空のリストを返す")
    void getReservationList_withSession_returnEmptyList() {
        List<ReservationEntity> reservationList = Arrays.asList(buildReservation(reservationId1), buildReservation(reservationId2));
        when(reservationRepo.findByAccountId(ArgumentMatchers.any(UUID.class))).thenReturn(new ArrayList<>());

        List<ReservationResponseDto> result = service.getReservationList(noReservationAccountId);

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("ゲストログインとして予約情報IDと予約者氏名とメールアドレスから予約チケット情報が取得できる")
    void getGuestReservation_withReservationIdAndReserverNameAndReserverMail_returnGetGuestReservationSuccess() {
        when(reservationRepo.findByIdAndReserverNameAndReserverMail(reservationId1, "山田太郎", "email@sample.com")).thenReturn(reservation);

        ReservationResponseDto expect = getExpectReservationResponseDto(null);

        ReservationResponseDto actual = service.getGuestReservation(reservationId1, "山田太郎", "email@sample.com");

        assertEquals(expect, actual);
    }

    @Test
    @DisplayName("ゲストログインとして予約情報データに存在しない予約情報IDがリクエストされた場合にNullを返す")
    void getGuestReservation_withNotExistGuestReservationRequest_returnIllegalArgumentException() {
        when(reservationRepo.findByIdAndReserverNameAndReserverMail(reservationId1, "山田太郎", "email@sample.com")).thenReturn(Optional.empty());
        ReservationResponseDto actual = service.getGuestReservation(reservationId1, "山田太郎", "email@sample.com");
        assertNull(actual);
    }

    @Test
    @DisplayName("予約情報データに存在しないゲスト予約者氏名がリクエストされた場合にエラーを発生させる")
    void getGuestReservation_withNotExistReserverName_returnIllegalArgumentException() {
        when(reservationRepo.findByIdAndReserverNameAndReserverMail(reservationId1, "NotFound太郎", "email@sample.com")).thenReturn(Optional.empty());
        ReservationResponseDto actual = service.getGuestReservation(reservationId1, "NotFound太郎", "email@sample.com");
        assertNull(actual);
    }

    @Test
    @DisplayName("予約情報IDとアカウントログイン情報から予約チケット情報が取得できる")
    void getAccountReservation_withReservationIdAndSession_returnGetAccountReservationSuccess() {

        when(reservationRepo.findWithEntityGraphByIdAndAccountId(reservationId1, accountId)).thenReturn(reservation);

        ReservationResponseDto expect = getExpectReservationResponseDto(null);

        ReservationResponseDto actual = service.getAccountReservation(reservationId1, accountId);

        assertEquals(actual, expect);
    }

    @Test
    @DisplayName("予約情報データに存在しない予約情報IDがリクエストされた場合にエラーを発生させる")
    void getAccountReservation_withNotExistReservationId_returnIllegalArgumentException() {
        when(reservationRepo.findWithEntityGraphByIdAndAccountId(reservationId1, noReservationAccountId)).thenReturn(Optional.empty());
        Exception ex = assertThrows(
            IllegalArgumentException.class,
            () -> service.getAccountReservation(reservationId1, noReservationAccountId)
        );
        assertEquals("ReservationId is Not found", ex.getMessage());
    }

    @Test
    @DisplayName("予約情報データに存在しないアカウントログイン情報がリクエストされた場合にエラーを発生させる")
    void getAccountReservation_withNotExistSession_returnIllegalArgumentException() {
        when(reservationRepo.findWithEntityGraphByIdAndAccountId(reservationId1, accountId)).thenReturn(Optional.empty());
        Exception ex = assertThrows(
            IllegalArgumentException.class,
            () -> service.getAccountReservation(reservationId1, accountId)
        );
        assertEquals("ReservationId is Not found", ex.getMessage());
    }

    @Test
    @DisplayName("出発到着時刻データに存在しない出発駅CDを持つ予約情報IDがリクエストされた場合にエラーを発生させる")
    void getGuestReservation_withNotExistScheduleOfDepartureStationRequest_returnIllegalArgumentException() {
        reservation.get().setDepartureStationCd("None");
        when(reservationRepo.findByIdAndReserverNameAndReserverMail(reservationId1, "山田太郎", "email@sample.com")).thenReturn(reservation);
        Exception ex = assertThrows(
            IllegalArgumentException.class,
            () -> service.getGuestReservation(reservationId1, "山田太郎", "email@sample.com")
        );
        assertEquals("DepartureAndArrivalStation is Not Found", ex.getMessage());
    }

    @Test
    @DisplayName("出発到着時刻データに存在しない到着駅CDを持つ予約情報IDがリクエストされた場合にエラーを発生させる")
    void getGuestReservation_withNotExistScheduleOfArrivalStationRequest_returnIllegalArgumentException() {
        reservation.get().setArrivalStationCd("None");
        when(reservationRepo.findByIdAndReserverNameAndReserverMail(reservationId1, "山田太郎", "email@sample.com")).thenReturn(reservation);
        Exception ex = assertThrows(
            IllegalArgumentException.class,
            () -> service.getGuestReservation(reservationId1, "山田太郎", "email@sample.com")
        );
        assertEquals("DepartureAndArrivalStation is Not Found", ex.getMessage());
    }

    @Test
    @DisplayName("ログイン状態で予約情報・予約座席情報を挿入できる")
    void insertReservation_withLoginAndValidReserveRequestDto_returnInsertReservationId() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "", "", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01002", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01003", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01004", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01005", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01006", 2800)));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getScheduleCd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        SectionKmEntity sectionKm = new SectionKmEntity();
        sectionKm.setSectionCd(departureArrivalTime.getSectionCd());
        when(sectionKmRepo.findByStartStationCd(request.getDepartureStationCd())).thenReturn(List.of(sectionKm));
        when(sectionKmRepo.findByGoalStationCd(request.getArrivalStationCd())).thenReturn(List.of(sectionKm));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getScheduleCd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeGreaterThanEqualAndArrivalTimeLessThanEqual(request.getScheduleCd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime));
        when(reservationRepo.save(any())).thenReturn(new ReservationEntity() {{
            setId(UUID.randomUUID());
        }});
        when(reservedSeatRepo.saveAll(any())).thenReturn(Stream.generate(ReservedSeatEntity::new).limit(request.getSeats().size()).collect(Collectors.toList()));
        when(trainCarRepo.findById(any())).thenReturn(Optional.of(new TrainCarEntity()));
        when(seatRepo.findById(any())).thenReturn(Optional.of(new SeatEntity()));
        when(reservedSeatSectionRepo.findByRideDateAndScheduleCdAndTrainCarCdInAndReservedSectionCdIn(any(), any(), any(), any()))
            .thenReturn(Collections.emptyList());
        when(reservedSeatSectionRepo.saveAll(any())).
            thenReturn(Stream.generate(ReservedSeatSectionEntity::new).
                limit((List.of(departureArrivalTime.getSectionCd())).size() * request.getSeats().size())
                .collect(Collectors.toList()));
        when(accountRepo.findById(any())).thenReturn(Optional.of(account));
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
        UUID result = service.insertReservation(request, session);
        assertNotNull(result);
        this.mockRestServiceServer.verify();
    }

    @Test
    @DisplayName("ゲストで予約情報・予約座席情報を挿入できる")
    void insertReservation_withGuestAndValidReserveRequestDto_returnInsertReservationId() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01002", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01003", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01004", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01005", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01006", 2800)));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getScheduleCd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        SectionKmEntity sectionKm = new SectionKmEntity();
        sectionKm.setSectionCd(departureArrivalTime.getSectionCd());
        when(sectionKmRepo.findByStartStationCd(request.getDepartureStationCd())).thenReturn(List.of(sectionKm));
        when(sectionKmRepo.findByGoalStationCd(request.getArrivalStationCd())).thenReturn(List.of(sectionKm));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getScheduleCd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeGreaterThanEqualAndArrivalTimeLessThanEqual(request.getScheduleCd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime));
        when(reservationRepo.save(any())).thenReturn(new ReservationEntity() {{
            setId(UUID.randomUUID());
        }});
        when(reservedSeatRepo.saveAll(any())).thenReturn(Stream.generate(ReservedSeatEntity::new).limit(request.getSeats().size()).collect(Collectors.toList()));
        when(trainCarRepo.findById(any())).thenReturn(Optional.of(new TrainCarEntity()));
        when(seatRepo.findById(any())).thenReturn(Optional.of(new SeatEntity()));
        when(reservedSeatSectionRepo.findByRideDateAndScheduleCdAndTrainCarCdInAndReservedSectionCdIn(any(), any(), any(), any()))
            .thenReturn(Collections.emptyList());
        when(reservedSeatSectionRepo.saveAll(any())).
            thenReturn(Stream.generate(ReservedSeatSectionEntity::new).
                limit((List.of(departureArrivalTime.getSectionCd())).size() * request.getSeats().size())
                .collect(Collectors.toList()));
        when(accountRepo.findById(any())).thenReturn(Optional.of(account));
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
        UUID result = service.insertReservation(request, null);
        assertNotNull(result);
        this.mockRestServiceServer.verify();
    }

    @Test
    @DisplayName("DBに存在しないアカウントからのリクエストの場合BadCredentialsExceptionが発生する")
    void insertReservation_withNotExistAccount_throwsBadCredentialsException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "", "", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01002", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01003", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01004", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01005", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01006", 2800)));
        when(accountRepo.findById(any())).thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () -> service.insertReservation(request, session));
    }

    @Test
    @DisplayName("未ログインかつ氏名・メールアドレスがないリクエストの場合IllegalArgumentExceptionが発生する")
    void insertReservation_withGuestAndNoMailNoName_throwsIllegalArgumentException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "", "", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01002", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01003", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01004", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01005", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01006", 2800)));
        assertThrows(IllegalArgumentException.class, () -> service.insertReservation(request, null));
    }

    @Test
    @DisplayName("座席リストが空の場合、IllegalArgumentExceptionが発生する")
    void insertReservation_withEmptySelectedSeatDto_throwsIllegalArgumentException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of());
        assertThrows(IllegalArgumentException.class, () -> service.insertReservation(request, null));
    }

    @Test
    @DisplayName("座席リストがnullの場合、IllegalArgumentExceptionが発生する")
    void insertReservation_withNullSelectedSeatDto_throwsIllegalArgumentException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", null);
        assertThrows(IllegalArgumentException.class, () -> service.insertReservation(request, null));
    }

    @Test
    @DisplayName("座席リストが6以上の場合、IllegalArgumentExceptionが発生する")
    void insertReservation_withMaxSelectedSeatDto_throwsIllegalArgumentException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 1000), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 1000), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 1000), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 1000), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 1000), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 1000), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 1000)));
        assertThrows(IllegalArgumentException.class, () -> service.insertReservation(request, null));
    }

    @Test
    @DisplayName("該当区間の出発到着時刻が存在しない場合、IllegalArgumentExceptionが発生する")
    void insertReservation_withNotExistingSection_throwsIllegalArgumentException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 1000), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01002", 1000), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01003", 1000), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01004", 1000), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01005", 1000), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01006", 1000)));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getScheduleCd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        when(sectionKmRepo.findByStartStationCd(request.getDepartureStationCd())).thenReturn(List.of());
        when(sectionKmRepo.findByGoalStationCd(request.getArrivalStationCd())).thenReturn(List.of());
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getScheduleCd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(null);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeGreaterThanEqualAndArrivalTimeLessThanEqual(request.getScheduleCd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of());

        assertThrows(IllegalArgumentException.class, () -> service.insertReservation(request, null));
    }

    @Test
    @DisplayName("同一予約情報IDで重複した座席を予約しようとした場合、DataAccessExceptionが発生する")
    void insertReservation_withSameSelectedSeatDto_throwsDataAccessException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 2800)));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getScheduleCd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        SectionKmEntity sectionKm = new SectionKmEntity();
        sectionKm.setSectionCd(departureArrivalTime.getSectionCd());
        when(sectionKmRepo.findByStartStationCd(request.getDepartureStationCd())).thenReturn(List.of(sectionKm));
        when(sectionKmRepo.findByGoalStationCd(request.getArrivalStationCd())).thenReturn(List.of(sectionKm));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getScheduleCd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeGreaterThanEqualAndArrivalTimeLessThanEqual(request.getScheduleCd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime));
        when(reservationRepo.save(any())).thenReturn(new ReservationEntity() {{
            setId(UUID.randomUUID());
        }});
        when(trainCarRepo.findById(any())).thenReturn(Optional.of(new TrainCarEntity()));
        when(seatRepo.findById(any())).thenReturn(Optional.of(new SeatEntity()));
        when(reservedSeatSectionRepo.findByRideDateAndScheduleCdAndTrainCarCdInAndReservedSectionCdIn(any(), any(), any(), any()))
            .thenReturn(Collections.emptyList());
        when(reservedSeatRepo.saveAll(any()).size()).thenThrow(new DuplicateKeyException("UNIQUE制約エラー"));

        assertThrows(org.springframework.dao.DataAccessException.class, () -> service.insertReservation(request, null));
    }

    @Test
    @DisplayName("insertReservationが失敗した場合、RuntimeExceptionが発生する")
    void insertReservation_withInsertInsertReservationFails_throwsRuntimeException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 2800)));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getScheduleCd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        SectionKmEntity sectionKm = new SectionKmEntity();
        sectionKm.setSectionCd(departureArrivalTime.getSectionCd());
        when(sectionKmRepo.findByStartStationCd(request.getDepartureStationCd())).thenReturn(List.of(sectionKm));
        when(sectionKmRepo.findByGoalStationCd(request.getArrivalStationCd())).thenReturn(List.of(sectionKm));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getScheduleCd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeGreaterThanEqualAndArrivalTimeLessThanEqual(request.getScheduleCd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime));
        when(reservationRepo.save(any())).thenReturn(null);

        assertThrows(RuntimeException.class, () -> service.insertReservation(request, null));
    }

    @Test
    @DisplayName("trainCarが存在しないとき、IllegalArgumentExceptionが発生する")
    void insertReservation_withNotExistingTrainCar_throwsIllegalArgumentException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 2800)));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getScheduleCd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        SectionKmEntity sectionKm = new SectionKmEntity();
        sectionKm.setSectionCd(departureArrivalTime.getSectionCd());
        when(sectionKmRepo.findByStartStationCd(request.getDepartureStationCd())).thenReturn(List.of(sectionKm));
        when(sectionKmRepo.findByGoalStationCd(request.getArrivalStationCd())).thenReturn(List.of(sectionKm));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getScheduleCd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeGreaterThanEqualAndArrivalTimeLessThanEqual(request.getScheduleCd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime));
        when(reservationRepo.save(any())).thenReturn(new ReservationEntity() {{
            setId(UUID.randomUUID());
        }});
        when(trainCarRepo.findById(any())).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> service.insertReservation(request, null));
        assertEquals("TrainCar is not found", exception.getMessage());
    }

    @Test
    @DisplayName("seatが存在しないとき、IllegalArgumentExceptionが発生する")
    void insertReservation_withNotExistingSeat_throwsIllegalArgumentException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 2800)));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getScheduleCd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        SectionKmEntity sectionKm = new SectionKmEntity();
        sectionKm.setSectionCd(departureArrivalTime.getSectionCd());
        when(sectionKmRepo.findByStartStationCd(request.getDepartureStationCd())).thenReturn(List.of(sectionKm));
        when(sectionKmRepo.findByGoalStationCd(request.getArrivalStationCd())).thenReturn(List.of(sectionKm));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getScheduleCd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeGreaterThanEqualAndArrivalTimeLessThanEqual(request.getScheduleCd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime));
        when(reservationRepo.save(any())).thenReturn(new ReservationEntity() {{
            setId(UUID.randomUUID());
        }});
        when(trainCarRepo.findById(any())).thenReturn(Optional.of(new TrainCarEntity()));
        when(seatRepo.findById(any())).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> service.insertReservation(request, null));
        assertEquals("Seat is not found", exception.getMessage());
    }

    @Test
    @DisplayName("saveAllが失敗した場合、RuntimeExceptionが発生する")
    void insertReservation_withInsertReservedFails_throwsRuntimeException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 2800)));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getScheduleCd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        SectionKmEntity sectionKm = new SectionKmEntity();
        sectionKm.setSectionCd(departureArrivalTime.getSectionCd());
        when(sectionKmRepo.findByStartStationCd(request.getDepartureStationCd())).thenReturn(List.of(sectionKm));
        when(sectionKmRepo.findByGoalStationCd(request.getArrivalStationCd())).thenReturn(List.of(sectionKm));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getScheduleCd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeGreaterThanEqualAndArrivalTimeLessThanEqual(request.getScheduleCd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime));
        when(reservationRepo.save(any())).thenReturn(new ReservationEntity() {{
            setId(UUID.randomUUID());
        }});
        when(reservedSeatRepo.saveAll(any())).thenReturn(null);

        assertThrows(RuntimeException.class, () -> service.insertReservation(request, null));
    }

    @Test
    @DisplayName("既に予約済みの座席を予約しようとした場合、ResponseStatusException(CONFLICT)が発生する")
    void insertReservation_withAlreadyReservedSeat_throwsResponseStatusException() {
        TrainCarEntity trainCar = new TrainCarEntity();
        trainCar.setTrainCarNumber(1);
        SeatTypeEntity seatType = new SeatTypeEntity();
        seatType.setTrainCarTypeCd("CAR01");
        trainCar.setSeatType(seatType);
        SeatEntity seat = new SeatEntity();
        seat.setSeatColumn("A");
        seat.setSeatNumber(2);
        ReservedSeatEntity existingSeat = new ReservedSeatEntity();
        existingSeat.setSeatCd("existingSeatCd");
        existingSeat.setTrainCarCd("existingTrainCd");
        existingSeat.setSeat(seat);
        existingSeat.setTrainCar(trainCar);
        ReservedSeatSectionEntity existingSec = new ReservedSeatSectionEntity();
        existingSec.setSeatCd("existingSeatCd");
        existingSec.setTrainCarCd("existingTrainCd");

        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 2800)));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getScheduleCd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        SectionKmEntity sectionKm = new SectionKmEntity();
        sectionKm.setSectionCd(departureArrivalTime.getSectionCd());
        when(sectionKmRepo.findByStartStationCd(request.getDepartureStationCd())).thenReturn(List.of(sectionKm));
        when(sectionKmRepo.findByGoalStationCd(request.getArrivalStationCd())).thenReturn(List.of(sectionKm));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getScheduleCd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeGreaterThanEqualAndArrivalTimeLessThanEqual(request.getScheduleCd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime));
        when(reservationRepo.save(any())).thenReturn(new ReservationEntity() {{
            setId(UUID.randomUUID());
        }});
        when(trainCarRepo.findById(any())).thenReturn(Optional.of(new TrainCarEntity()));
        when(seatRepo.findById(any())).thenReturn(Optional.of(new SeatEntity()));

        when(reservedSeatRepo.saveAll(any())).thenReturn(List.of(existingSeat, new ReservedSeatEntity()));

        when(reservedSeatSectionRepo.findByRideDateAndScheduleCdAndTrainCarCdInAndReservedSectionCdIn(any(), any(), any(), any()))
            .thenReturn(List.of(existingSec));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> service.insertReservation(request, null));
        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        assertTrue(exception.getReason().contains(existingSeat.getSeatCd()));
        assertTrue(exception.getReason().contains(existingSeat.getTrainCarCd()));
    }

    @Test
    @DisplayName("saveAllReservedSeatSectionsが失敗した場合、RuntimeExceptionが発生する")
    void insertReservation_withSaveAllReservedSeatSectionsFails_throwsRuntimeException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 2800)));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();

        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getScheduleCd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        SectionKmEntity sectionKm = new SectionKmEntity();
        sectionKm.setSectionCd(departureArrivalTime.getSectionCd());
        when(sectionKmRepo.findByStartStationCd(request.getDepartureStationCd())).thenReturn(List.of(sectionKm));
        when(sectionKmRepo.findByGoalStationCd(request.getArrivalStationCd())).thenReturn(List.of(sectionKm));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getScheduleCd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeGreaterThanEqualAndArrivalTimeLessThanEqual(request.getScheduleCd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime));
        when(reservationRepo.save(any())).thenReturn(new ReservedSeatEntity() {{
            setId(UUID.randomUUID());
        }});
        when(reservedSeatRepo.saveAll(any())).thenReturn(List.of(new ReservedSeatEntity(), new ReservedSeatEntity()));
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

        assertThrows(RuntimeException.class, () -> service.insertReservation(request, null));
    }

    @Test
    @DisplayName("決済会社に問い合わせて決済IDの発行に失敗した場合、RuntimeExceptionが発生する")
    void insertReservation_withGetPaymentTrackingIdFailed_throwsRuntimeException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01001", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01002", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01003", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01004", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01005", 2800), new ReserveRequestDto.SelectedSeatDto("E5SER01", "CAR01", "SEAT01006", 2800)));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getScheduleCd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        SectionKmEntity sectionKm = new SectionKmEntity();
        sectionKm.setSectionCd(departureArrivalTime.getSectionCd());
        when(sectionKmRepo.findByStartStationCd(request.getDepartureStationCd())).thenReturn(List.of(sectionKm));
        when(sectionKmRepo.findByGoalStationCd(request.getArrivalStationCd())).thenReturn(List.of(sectionKm));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getScheduleCd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeGreaterThanEqualAndArrivalTimeLessThanEqual(request.getScheduleCd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime));
        when(reservationRepo.save(any())).thenReturn(new ReservationEntity() {{
            setId(UUID.randomUUID());
        }});
        when(reservedSeatRepo.saveAll(any())).thenReturn(Stream.generate(ReservedSeatEntity::new).limit(request.getSeats().size()).collect(Collectors.toList()));
        when(trainCarRepo.findById(any())).thenReturn(Optional.of(new TrainCarEntity()));
        when(seatRepo.findById(any())).thenReturn(Optional.of(new SeatEntity()));
        when(reservedSeatSectionRepo.findByRideDateAndScheduleCdAndTrainCarCdInAndReservedSectionCdIn(any(), any(), any(), any()))
            .thenReturn(Collections.emptyList());
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
            .andRespond(withStatus(HttpStatus.INTERNAL_SERVER_ERROR));

        assertThrows(RuntimeException.class, () -> service.insertReservation(request, null));
        this.mockRestServiceServer.verify();
    }

    @Test
    @DisplayName("予約情報・予約座席情報の論理削除、予約済座席区間の物理削除ができる")
    void deleteReservation_withReservationId() {
        UUID reservationId = UUID.randomUUID();
        UUID accountId = UUID.fromString("f79d8bbc-fcba-b538-b132-2f726ce0120c");
        ReservationEntity deletedReservation = getReservation(reservationId);
        List<ReservedSeatEntity> deletedSeats = getReservedSeats(reservationId);
        List<ReservedSeatSectionEntity> deletedSections = getReservedSeatSections(reservationId);

        when(reservationRepo.findByIdAndAccountId(reservationId, accountId)).thenReturn(Optional.of(deletedReservation));
        when(reservedSeatRepo.findByReservationId(reservationId)).thenReturn(deletedSeats);
        when(reservedSeatSectionRepo.findByReservationId(reservationId)).thenReturn(deletedSections);

        service.deleteReservation(reservationId, accountId);
        assertTrue(deletedReservation.getIsDeleted());
        verify(reservationRepo).save(deletedReservation);
        assertTrue(deletedSeats.get(0).getIsDeleted());
        assertTrue(deletedSeats.get(1).getIsDeleted());
        verify(reservedSeatRepo).saveAll(deletedSeats);
        verify(reservedSeatSectionRepo).deleteAll(deletedSections);
    }

    @Test
    @DisplayName("該当予約情報が存在しない場合、IllegalArgumentExceptionが発生する")
    void deleteReservation_withNotExistingReservationId_throwsIllegalArgumentException() {
        UUID reservationId = UUID.randomUUID();
        UUID accountId = UUID.fromString("f79d8bbc-fcba-b538-b132-2f726ce0120c");
        Exception ex = assertThrows(IllegalArgumentException.class, () -> service.deleteReservation(reservationId, accountId));
        assertEquals("Reservation is not found", ex.getMessage());
    }

    @Test
    @DisplayName("該当予約座席情報が存在しない場合、IllegalArgumentExceptionが発生する")
    void deleteReservation_withNotExistingReservationIdOfReservedSeat_throwsIllegalArgumentException() {
        UUID reservationId = UUID.randomUUID();
        UUID accountId = UUID.fromString("f79d8bbc-fcba-b538-b132-2f726ce0120c");
        ReservationEntity deletedReservation = getReservation(reservationId);

        when(reservationRepo.findByIdAndAccountId(reservationId, accountId)).thenReturn(Optional.of(deletedReservation));
        when(reservedSeatRepo.findByReservationId(reservationId)).thenReturn(List.of());

        Exception ex = assertThrows(IllegalArgumentException.class, () -> service.deleteReservation(reservationId, accountId));
        assertEquals("Reserved Seats is Not found", ex.getMessage());
    }

    @Test
    @DisplayName("該当予約済座席区間が存在しない場合、IllegalArgumentExceptionが発生する")
    void deleteReservation_withNotExistingReservationIdOfReservedSeatSection_throwsIllegalArgumentException() {
        UUID reservationId = UUID.randomUUID();
        UUID accountId = UUID.fromString("f79d8bbc-fcba-b538-b132-2f726ce0120c");
        ReservationEntity deletedReservation = getReservation(reservationId);
        List<ReservedSeatEntity> deletedSeats = getReservedSeats(reservationId);

        when(reservationRepo.findByIdAndAccountId(reservationId, accountId)).thenReturn(Optional.of(deletedReservation));
        when(reservedSeatRepo.findByReservationId(reservationId)).thenReturn(deletedSeats);
        when(reservedSeatSectionRepo.findByReservationId(reservationId)).thenReturn(List.of());

        Exception ex = assertThrows(IllegalArgumentException.class, () -> service.deleteReservation(reservationId, accountId));
        assertEquals("Reserved Seat Sections is Not found", ex.getMessage());
    }
}
