package com.alab.shinkansendego.reservedseat;

import com.alab.shinkansendego.account.AccountRepository;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeEntity;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.reservation.ReservationEntity;
import com.alab.shinkansendego.reservation.ReservationRepository;
import com.alab.shinkansendego.seattype.SeatTypeEntity;
import com.alab.shinkansendego.sectionkm.SectionKmEntity;
import com.alab.shinkansendego.station.StationEntity;
import com.alab.shinkansendego.traincar.TrainCarEntity;
import com.alab.shinkansendego.traincar.TrainCarRepository;
import org.jspecify.annotations.NonNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class ReservedSeatServiceTest {
    @Mock
    private ReservationRepository reservationRepo;
    @Mock
    private ReservedSeatRepository reservedSeatRepo;
    @Mock
    private DepartureArrivalTimeRepository departureArrivalTimeRepo;
    @Mock
    private TrainCarRepository trainCarRepo;
    @Mock
    private AccountRepository accountRepo;
    @Mock
    private ApplicationEventPublisher eventPublisher;
    private ReservedSeatService service;
    private final UUID reservationId = UUID.randomUUID();
    private final UUID accountId = UUID.randomUUID();
    private final UUID reservedSeat1Id = UUID.randomUUID();
    private final UUID reservedSeat2Id = UUID.randomUUID();
    private ReservedSeatUpdateDto reservedSeatUpdateDto1;
    private ReservedSeatUpdateDto reservedSeatUpdateDto2;
    private List<ReservedSeatUpdateDto> updateRequest;
    private ReservationEntity reservation;
    private ReservedSeatEntity reservedSeat1;
    private ReservedSeatEntity reservedSeat2;

    /**
     * スケジュールを作成するメソッド
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

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        this.service = new ReservedSeatService(reservationRepo, reservedSeatRepo, departureArrivalTimeRepo, trainCarRepo, accountRepo, eventPublisher);

        reservedSeatUpdateDto1 = new ReservedSeatUpdateDto(reservedSeat1Id, "一般次郎",
            "test2-common@test.com");
        reservedSeatUpdateDto2 = new ReservedSeatUpdateDto(reservedSeat2Id, "",
            "");
        updateRequest = List.of(reservedSeatUpdateDto1, reservedSeatUpdateDto2);
        reservation = new ReservationEntity();
        reservation.setId(reservationId);
        reservation.setAccountId(accountId);
        reservation.setDepartureStationCd("THK01");
        reservation.setArrivalStationCd("THK02");
        reservation.setIsDeleted(false);
        reservation.setReserverName("一般太郎");
        reservation.setReserverMail("test-common@test.com");
        reservedSeat1 = new ReservedSeatEntity();
        reservedSeat1.setId(reservedSeat1Id);
        reservedSeat1.setReservationId(reservationId);
        reservedSeat1.setIsDeleted(false);
        reservedSeat1.setName("");
        reservedSeat1.setMail("");
        reservedSeat2 = new ReservedSeatEntity();
        reservedSeat2.setId(reservedSeat2Id);
        reservedSeat2.setReservationId(reservationId);
        reservedSeat2.setIsDeleted(false);
        reservedSeat2.setName("");
        reservedSeat2.setMail("");
    }

    @Test
    @DisplayName("ログインユーザーが同行者を割り当てできる")
    void updateReservedSeats_withAuthorized() {
        TrainCarEntity trainCar = new TrainCarEntity();
        SeatTypeEntity seatType = new SeatTypeEntity();
        seatType.setTrainCarTypeCd("CAR01");
        trainCar.setSeatType(seatType);
        when(reservationRepo.findById(reservationId)).thenReturn(Optional.of(reservation));
        when(departureArrivalTimeRepo.findByScheduleCd(any())).thenReturn(List.of(
            buildSchedule(LocalTime.of(6, 0, 0), "THK01", "東京", LocalTime.of(6, 30, 0), "THK02", "上野"),
            buildSchedule(LocalTime.of(7, 0, 0), "THK02", "上野", LocalTime.of(7, 30, 0), "CMN01", "大宮"),
            buildSchedule(LocalTime.of(8, 0, 0), "CMN01", "大宮", LocalTime.of(8, 30, 0), "THK09", "仙台")));
        when(reservedSeatRepo.findByIdAndReservationIdAndIsDeleted(reservedSeat1Id, reservationId, false)).thenReturn(Optional.of(reservedSeat1));
        when(reservedSeatRepo.findByIdAndReservationIdAndIsDeleted(reservedSeat2Id, reservationId, false)).thenReturn(Optional.of(reservedSeat2));
        when(trainCarRepo.findByTrainCarCd(any())).thenReturn(Optional.of(trainCar));

        service.updateReservedSeats(reservationId, updateRequest, accountId, null, null);
        assertEquals("一般次郎", reservedSeat1.getName());
        assertEquals("test2-common@test.com", reservedSeat1.getMail());
        assertEquals("", reservedSeat2.getName());
        assertEquals("", reservedSeat2.getMail());

        verify(reservationRepo, times(1)).findById(reservationId);
        verify(reservedSeatRepo, times(1)).findByIdAndReservationIdAndIsDeleted(reservedSeat1Id, reservationId, false);
        verify(reservedSeatRepo, times(1)).findByIdAndReservationIdAndIsDeleted(reservedSeat2Id, reservationId, false);
    }

    @Test
    @DisplayName("ゲストユーザーが同行者を割り当てできる")
    void updateReservedSeats_withNotAuthorized() {
        TrainCarEntity trainCar = new TrainCarEntity();
        SeatTypeEntity seatType = new SeatTypeEntity();
        seatType.setTrainCarTypeCd("CAR01");
        trainCar.setSeatType(seatType);
        reservation.setAccountId(null);
        when(reservationRepo.findById(reservationId)).thenReturn(Optional.of(reservation));
        when(departureArrivalTimeRepo.findByScheduleCd(any())).thenReturn(List.of(
            buildSchedule(LocalTime.of(6, 0, 0), "THK01", "東京", LocalTime.of(6, 30, 0), "THK02", "上野"),
            buildSchedule(LocalTime.of(7, 0, 0), "THK02", "上野", LocalTime.of(7, 30, 0), "CMN01", "大宮"),
            buildSchedule(LocalTime.of(8, 0, 0), "CMN01", "大宮", LocalTime.of(8, 30, 0), "THK09", "仙台")));
        when(reservedSeatRepo.findByIdAndReservationIdAndIsDeleted(reservedSeat1Id, reservationId, false)).thenReturn(Optional.of(reservedSeat1));
        when(reservedSeatRepo.findByIdAndReservationIdAndIsDeleted(reservedSeat2Id, reservationId, false)).thenReturn(Optional.of(reservedSeat2));
        when(trainCarRepo.findByTrainCarCd(any())).thenReturn(Optional.of(trainCar));

        service.updateReservedSeats(reservationId, updateRequest, null, "一般太郎", "test-common@test.com");
        assertEquals("一般次郎", reservedSeat1.getName());
        assertEquals("test2-common@test.com", reservedSeat1.getMail());
        assertEquals("", reservedSeat2.getName());
        assertEquals("", reservedSeat2.getMail());

        verify(reservationRepo, times(1)).findById(reservationId);
        verify(reservedSeatRepo, times(1)).findByIdAndReservationIdAndIsDeleted(reservedSeat1Id, reservationId, false);
        verify(reservedSeatRepo, times(1)).findByIdAndReservationIdAndIsDeleted(reservedSeat2Id, reservationId, false);
    }

    @Test
    @DisplayName("Reservationが見つからなかった場合、IllegalArgumentExceptionを投げる")
    void updateReservedSeats_withReservationNotFound() {
        reservation.setAccountId(UUID.randomUUID());
        when(reservationRepo.findById(reservationId)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            service.updateReservedSeats(reservationId, updateRequest, accountId, null, null);
        });
        assertEquals("Reservation is Not found", exception.getMessage());
    }

    @Test
    @DisplayName("Reservationが削除済みの場合、IllegalArgumentExceptionを投げる")
    void updateReservedSeats_withReservationIsDeleted() {
        reservation.setIsDeleted(true);
        reservation.setAccountId(UUID.randomUUID());
        when(reservationRepo.findById(reservationId)).thenReturn(Optional.of(reservation));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            service.updateReservedSeats(reservationId, updateRequest, accountId, null, null);
        });
        assertEquals("Reservation is Not found", exception.getMessage());
    }

    @Test
    @DisplayName("ログインユーザーが権限のない予約を更新しようとした場合、AccessDeniedExceptionを投げる")
    void updateReservedSeats_withAuthorizedAndUnauthorizedReservation() {
        reservation.setAccountId(UUID.randomUUID());
        when(reservationRepo.findById(reservationId)).thenReturn(Optional.of(reservation));

        AccessDeniedException exception = assertThrows(AccessDeniedException.class, () -> {
            service.updateReservedSeats(reservationId, updateRequest, accountId, null, null);
        });
        assertEquals("Forbidden", exception.getMessage());
    }

    @Test
    @DisplayName("ゲストユーザーがアカウントIDが登録済みの予約を更新しようとした場合、AccessDeniedExceptionを投げる")
    void updateReservedSeats_withNotAuthorizedAndReservationAccountId() {
        when(reservationRepo.findById(reservationId)).thenReturn(Optional.of(reservation));

        AccessDeniedException exception = assertThrows(AccessDeniedException.class, () -> {
            service.updateReservedSeats(reservationId, updateRequest, null, "一般太郎", "test-common@test.com");
        });
        assertEquals("Login Required", exception.getMessage());
    }

    @Test
    @DisplayName("同行者が予約を更新しようとした場合、AccessDeniedExceptionを投げる")
    void updateReservedSeats_withNotAuthorizedAndCompanionUser() {
        reservation.setAccountId(null);
        when(reservationRepo.findById(reservationId)).thenReturn(Optional.of(reservation));

        AccessDeniedException exception = assertThrows(AccessDeniedException.class, () -> {
            service.updateReservedSeats(reservationId, updateRequest, null, "一般次郎", "test2-common@test.com");
        });
        assertEquals("Forbidden", exception.getMessage());
    }

    @Test
    @DisplayName("ReservationSeatが見つからなかった場合、IllegalArgumentExceptionを投げる")
    void updateReservedSeats_withDeletedReservedSeat() {
        TrainCarEntity trainCar = new TrainCarEntity();
        SeatTypeEntity seatType = new SeatTypeEntity();
        seatType.setTrainCarTypeCd("CAR01");
        trainCar.setSeatType(seatType);
        when(reservationRepo.findById(reservationId)).thenReturn(Optional.of(reservation));
        when(reservedSeatRepo.findByIdAndReservationIdAndIsDeleted(reservedSeat1Id, reservationId, false)).thenReturn(Optional.of(reservedSeat1));
        when(departureArrivalTimeRepo.findByScheduleCd(any())).thenReturn(List.of(
            buildSchedule(LocalTime.of(6, 0, 0), "THK01", "東京", LocalTime.of(6, 30, 0), "THK02", "上野"),
            buildSchedule(LocalTime.of(7, 0, 0), "THK02", "上野", LocalTime.of(7, 30, 0), "CMN01", "大宮"),
            buildSchedule(LocalTime.of(8, 0, 0), "CMN01", "大宮", LocalTime.of(8, 30, 0), "THK09", "仙台")));
        when(reservedSeatRepo.findByIdAndReservationIdAndIsDeleted(reservedSeat2Id, reservationId, false)).thenReturn(Optional.empty());
        when(trainCarRepo.findByTrainCarCd(any())).thenReturn(Optional.of(trainCar));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            service.updateReservedSeats(reservationId, updateRequest, accountId, null, null);
        });
        assertEquals("ReservedSeat is Not found", exception.getMessage());
    }

    @Test
    @DisplayName("出発駅に該当する時刻情報が存在しない場合、IllegalArgumentExceptionを投げる")
    void updateReservedSeats_withNotExistingDepartureTime() {
        when(reservationRepo.findById(reservationId)).thenReturn(Optional.of(reservation));
        when(reservedSeatRepo.findByIdAndReservationIdAndIsDeleted(reservedSeat1Id, reservationId, false)).thenReturn(Optional.of(reservedSeat1));
        when(departureArrivalTimeRepo.findByScheduleCd(any())).thenReturn(List.of(
            buildSchedule(LocalTime.of(7, 0, 0), "THK02", "上野", LocalTime.of(7, 30, 0), "CMN01", "大宮"),
            buildSchedule(LocalTime.of(8, 0, 0), "CMN01", "大宮", LocalTime.of(8, 30, 0), "THK09", "仙台")));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            service.updateReservedSeats(reservationId, updateRequest, accountId, null, null);
        });
        assertEquals("DepartureTime is Not found", exception.getMessage());
    }

    @Test
    @DisplayName("到着駅に該当する時刻情報が存在しない場合、IllegalArgumentExceptionを投げる")
    void updateReservedSeats_withNotExistingArrivalTime() {
        when(reservationRepo.findById(reservationId)).thenReturn(Optional.of(reservation));
        when(reservedSeatRepo.findByIdAndReservationIdAndIsDeleted(reservedSeat1Id, reservationId, false)).thenReturn(Optional.of(reservedSeat1));
        when(departureArrivalTimeRepo.findByScheduleCd(any())).thenReturn(List.of(
            buildSchedule(LocalTime.of(7, 0, 0), "THK01", "東京", LocalTime.of(7, 30, 0), "CMN01", "大宮"),
            buildSchedule(LocalTime.of(8, 0, 0), "CMN01", "大宮", LocalTime.of(8, 30, 0), "THK09", "仙台")));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            service.updateReservedSeats(reservationId, updateRequest, accountId, null, null);
        });
        assertEquals("ArrivalTime is Not found", exception.getMessage());
    }

    @Test
    @DisplayName("座席に紐づく号車情報が存在しない場合、IllegalArgumentExceptionを投げる")
    void updateReservedSeats_withNotExistingTrainCar() {
        when(reservationRepo.findById(reservationId)).thenReturn(Optional.of(reservation));
        when(reservedSeatRepo.findByIdAndReservationIdAndIsDeleted(reservedSeat1Id, reservationId, false)).thenReturn(Optional.of(reservedSeat1));
        when(departureArrivalTimeRepo.findByScheduleCd(any())).thenReturn(List.of(
            buildSchedule(LocalTime.of(6, 0, 0), "THK01", "東京", LocalTime.of(6, 30, 0), "THK02", "上野"),
            buildSchedule(LocalTime.of(7, 0, 0), "THK02", "上野", LocalTime.of(7, 30, 0), "CMN01", "大宮"),
            buildSchedule(LocalTime.of(8, 0, 0), "CMN01", "大宮", LocalTime.of(8, 30, 0), "THK09", "仙台")));
        when(reservedSeatRepo.findByIdAndReservationIdAndIsDeleted(reservedSeat1Id, reservationId, false)).thenReturn(Optional.of(reservedSeat1));
        when(reservedSeatRepo.findByIdAndReservationIdAndIsDeleted(reservedSeat2Id, reservationId, false)).thenReturn(Optional.of(reservedSeat2));
        when(trainCarRepo.findByTrainCarCd(any())).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            service.updateReservedSeats(reservationId, updateRequest, accountId, null, null);
        });
        assertEquals("TrainCar is Not found", exception.getMessage());
    }
}
