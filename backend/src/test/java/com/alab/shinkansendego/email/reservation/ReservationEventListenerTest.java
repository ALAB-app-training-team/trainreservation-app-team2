package com.alab.shinkansendego.email.reservation;

import com.alab.shinkansendego.reservation.ReservationCanceledEvent;
import com.alab.shinkansendego.reservation.ReservationChangedEvent;
import com.alab.shinkansendego.reservation.ReservationCreatedEvent;
import com.alab.shinkansendego.reservation.ReservationEntity;
import com.alab.shinkansendego.reservation.ReserveRequestDto;
import com.alab.shinkansendego.reservedseat.ReservedSeatEntity;
import com.alab.shinkansendego.reservedseat.ReservedSeatReleaseEvent;
import com.alab.shinkansendego.reservedseat.ReservedSeatSetEvent;
import com.alab.shinkansendego.schedule.ScheduleEntity;
import com.alab.shinkansendego.schedule.ScheduleRepository;
import com.alab.shinkansendego.seat.SeatEntity;
import com.alab.shinkansendego.seat.SeatRepository;
import com.alab.shinkansendego.seattype.SeatTypeEntity;
import com.alab.shinkansendego.station.StationEntity;
import com.alab.shinkansendego.station.StationRepository;
import com.alab.shinkansendego.traincar.TrainCarEntity;
import com.alab.shinkansendego.traincar.TrainCarRepository;
import com.alab.shinkansendego.traintype.TrainTypeEntity;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyIterable;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReservationEventListenerTest {

    private static final String SCHEDULE_CD = "S001";
    private static final String DEPARTURE_STATION_CD = "THK01";
    private static final String ARRIVAL_STATION_CD = "THK09";

    @Mock
    private ReservationEmailService reservationEmailService;
    @Mock
    private StationRepository stationRepository;
    @Mock
    private ScheduleRepository scheduleRepository;
    @Mock
    private SeatRepository seatRepository;
    @Mock
    private TrainCarRepository trainCarRepository;

    private ReservationEventListener listener;

    private void initListener() {
        listener = new ReservationEventListener(
            reservationEmailService, stationRepository, scheduleRepository, seatRepository, trainCarRepository
        );
    }

    private void stubStationsAndSchedule() {
        when(stationRepository.findById(DEPARTURE_STATION_CD)).thenReturn(Optional.of(new StationEntity(DEPARTURE_STATION_CD, "東京")));
        when(stationRepository.findById(ARRIVAL_STATION_CD)).thenReturn(Optional.of(new StationEntity(ARRIVAL_STATION_CD, "仙台")));
        TrainTypeEntity trainType = new TrainTypeEntity("TT01", "はやぶさ", "TS01", null);
        ScheduleEntity schedule = new ScheduleEntity(SCHEDULE_CD, "TT01", trainType);
        when(scheduleRepository.findByScheduleCd(SCHEDULE_CD)).thenReturn(Optional.of(schedule));
    }

    private SeatEntity seatEntity(String seatCd, int seatNumber, String seatColumn) {
        SeatEntity seat = new SeatEntity();
        seat.setSeatCd(seatCd);
        seat.setSeatNumber(seatNumber);
        seat.setSeatColumn(seatColumn);
        return seat;
    }

    private ReserveRequestDto createRequest(String reserverMail, String reserverName, List<ReserveRequestDto.SelectedSeatDto> seats) {
        return new ReserveRequestDto(
            SCHEDULE_CD, LocalDate.of(2026, 9, 10), DEPARTURE_STATION_CD, ARRIVAL_STATION_CD,
            reserverName, reserverMail, "payment-token", seats
        );
    }

    @Test
    @DisplayName("予約作成イベントを受けて駅名・列車名・合計金額を解決し予約完了メールを送信する")
    void handleReservationCreated_sendsConfirmationWithResolvedParams() {
        initListener();
        stubStationsAndSchedule();
        when(seatRepository.findAllById(anyIterable())).thenReturn(List.of(
            seatEntity("SEAT2B", 2, "B"),
            seatEntity("SEAT1A", 1, "A")
        ));
        List<ReserveRequestDto.SelectedSeatDto> seats = List.of(
            new ReserveRequestDto.SelectedSeatDto("0002", "普通車", "SEAT2B", 6000),
            new ReserveRequestDto.SelectedSeatDto("0001", "普通車", "SEAT1A", 5000)
        );
        ReserveRequestDto request = createRequest("user@example.com", "山田太郎", seats);
        UUID reservationId = UUID.randomUUID();
        ReservationCreatedEvent event = new ReservationCreatedEvent(reservationId, request, LocalTime.of(9, 0), LocalTime.of(10, 30));

        listener.handleReservationCreated(event);

        ArgumentCaptor<ReservationEmailRequestParams> captor = ArgumentCaptor.forClass(ReservationEmailRequestParams.class);
        verify(reservationEmailService, times(1)).sendReservationConfirmation(captor.capture());
        ReservationEmailRequestParams params = captor.getValue();
        assertEquals("user@example.com", params.getReserverMail());
        assertEquals(reservationId, params.getReservationId());
        assertEquals("東京", params.getDepartureStationName());
        assertEquals("仙台", params.getArrivalStationName());
        assertEquals("はやぶさ", params.getTrainTypeName());
        assertEquals(11000, params.getTotalAmount());
        assertEquals(2, params.getSeats().size());
        assertEquals("0001", params.getSeats().get(0).getTrainCarCd());
        assertEquals("1番A席", params.getSeats().get(0).getSeatCd());
        assertEquals("0002", params.getSeats().get(1).getTrainCarCd());
    }

    @Test
    @DisplayName("駅・スケジュールが見つからない場合は駅コード・空文字にフォールバックする")
    void handleReservationCreated_whenStationOrScheduleNotFound_fallsBackToRawCodes() {
        initListener();
        when(stationRepository.findById(DEPARTURE_STATION_CD)).thenReturn(Optional.empty());
        when(stationRepository.findById(ARRIVAL_STATION_CD)).thenReturn(Optional.empty());
        when(scheduleRepository.findByScheduleCd(SCHEDULE_CD)).thenReturn(Optional.empty());
        when(seatRepository.findAllById(anyIterable())).thenReturn(List.of());
        List<ReserveRequestDto.SelectedSeatDto> seats = List.of(
            new ReserveRequestDto.SelectedSeatDto("0001", "普通車", "SEAT1A", 5000)
        );
        ReserveRequestDto request = createRequest("user@example.com", null, seats);
        ReservationCreatedEvent event = new ReservationCreatedEvent(UUID.randomUUID(), request, LocalTime.of(9, 0), LocalTime.of(10, 30));

        listener.handleReservationCreated(event);

        ArgumentCaptor<ReservationEmailRequestParams> captor = ArgumentCaptor.forClass(ReservationEmailRequestParams.class);
        verify(reservationEmailService, times(1)).sendReservationConfirmation(captor.capture());
        ReservationEmailRequestParams params = captor.getValue();
        assertEquals(DEPARTURE_STATION_CD, params.getDepartureStationName());
        assertEquals(ARRIVAL_STATION_CD, params.getArrivalStationName());
        assertEquals("", params.getTrainTypeName());
        assertEquals("SEAT1A", params.getSeats().get(0).getSeatCd());
    }

    @Test
    @DisplayName("予約変更イベントで変更メールと、割当された同行者への割当メールを送信する")
    void handleReservationChanged_sendsChangeMail_andReleaseCompanionForAssignedSeats() {
        initListener();
        stubStationsAndSchedule();
        when(seatRepository.findAllById(anyIterable())).thenReturn(List.of(seatEntity("SEAT1A", 1, "A")));

        TrainCarEntity trainCar = new TrainCarEntity();
        SeatTypeEntity seatType = new SeatTypeEntity();
        seatType.setTrainCarTypeCd("GREEN");
        trainCar.setSeatType(seatType);
        when(trainCarRepository.findByTrainCarCd("0001")).thenReturn(Optional.of(trainCar));

        ReservedSeatEntity assignedSeat = new ReservedSeatEntity();
        assignedSeat.setTrainCarCd("0001");
        assignedSeat.setSeatCd("SEAT1A");
        assignedSeat.setSeatFare(5000);
        assignedSeat.setName("同行者A");
        assignedSeat.setMail("companion@example.com");

        ReservationEntity oldReservation = new ReservationEntity();
        oldReservation.setScheduleCd(SCHEDULE_CD);
        oldReservation.setRideDate(LocalDate.of(2026, 9, 10));
        oldReservation.setDepartureStationCd(DEPARTURE_STATION_CD);
        oldReservation.setArrivalStationCd(ARRIVAL_STATION_CD);
        oldReservation.setPaymentTrackingId("payment-token");

        List<ReserveRequestDto.SelectedSeatDto> seats = List.of(
            new ReserveRequestDto.SelectedSeatDto("0001", "普通車", "SEAT1A", 5000)
        );
        ReserveRequestDto request = createRequest("user@example.com", "山田太郎", seats);
        ReservationChangedEvent event = new ReservationChangedEvent(
            UUID.randomUUID(), request, LocalTime.of(9, 0), LocalTime.of(10, 30),
            8000, "山田太郎", oldReservation, List.of(assignedSeat)
        );

        listener.handleReservationChanged(event);

        verify(reservationEmailService, times(1)).sendReservationChange(any());
        ArgumentCaptor<ReservationEmailRequestParams> companionCaptor = ArgumentCaptor.forClass(ReservationEmailRequestParams.class);
        verify(reservationEmailService, times(1)).sendReleaseCompanion(companionCaptor.capture());
        ReservationEmailRequestParams companionParams = companionCaptor.getValue();
        assertEquals("companion@example.com", companionParams.getReserverMail());
        assertEquals("同行者A", companionParams.getReserverName());
    }

    @Test
    @DisplayName("割当された同行者がいない場合は割当解除メールを送信しない")
    void handleReservationChanged_withNoAssignedSeats_doesNotSendReleaseCompanion() {
        initListener();
        stubStationsAndSchedule();
        when(seatRepository.findAllById(anyIterable())).thenReturn(List.of(seatEntity("SEAT1A", 1, "A")));

        ReservationEntity oldReservation = new ReservationEntity();
        List<ReserveRequestDto.SelectedSeatDto> seats = List.of(
            new ReserveRequestDto.SelectedSeatDto("0001", "普通車", "SEAT1A", 5000)
        );
        ReserveRequestDto request = createRequest("user@example.com", "山田太郎", seats);
        ReservationChangedEvent event = new ReservationChangedEvent(
            UUID.randomUUID(), request, LocalTime.of(9, 0), LocalTime.of(10, 30),
            8000, "山田太郎", oldReservation, List.of()
        );

        listener.handleReservationChanged(event);

        verify(reservationEmailService, times(1)).sendReservationChange(any());
        verify(reservationEmailService, never()).sendReleaseCompanion(any());
    }

    @Test
    @DisplayName("割当先の車両が見つからない場合は例外を送出する")
    void handleReservationChanged_whenTrainCarNotFound_throwsException() {
        initListener();
        stubStationsAndSchedule();
        when(seatRepository.findAllById(anyIterable())).thenReturn(List.of(seatEntity("SEAT1A", 1, "A")));
        when(trainCarRepository.findByTrainCarCd("0001")).thenReturn(Optional.empty());

        ReservedSeatEntity assignedSeat = new ReservedSeatEntity();
        assignedSeat.setTrainCarCd("0001");
        assignedSeat.setSeatCd("SEAT1A");
        assignedSeat.setSeatFare(5000);
        assignedSeat.setName("同行者A");
        assignedSeat.setMail("companion@example.com");

        ReservationEntity oldReservation = new ReservationEntity();
        List<ReserveRequestDto.SelectedSeatDto> seats = List.of(
            new ReserveRequestDto.SelectedSeatDto("0001", "普通車", "SEAT1A", 5000)
        );
        ReserveRequestDto request = createRequest("user@example.com", "山田太郎", seats);
        ReservationChangedEvent event = new ReservationChangedEvent(
            UUID.randomUUID(), request, LocalTime.of(9, 0), LocalTime.of(10, 30),
            8000, "山田太郎", oldReservation, List.of(assignedSeat)
        );

        assertThrows(IllegalArgumentException.class, () -> listener.handleReservationChanged(event));
    }

    @Test
    @DisplayName("予約キャンセルイベントでキャンセルメールと、メールアドレスを持つ同行者への割当解除メールを送信する")
    void handleReservationCanceled_sendsCancelMail_andReleaseCompanionWhenCompanionHasMail() {
        initListener();
        stubStationsAndSchedule();
        when(seatRepository.findAllById(anyIterable())).thenReturn(List.of(seatEntity("SEAT1A", 1, "A")));

        ReservedSeatEntity companionSeat = new ReservedSeatEntity();
        companionSeat.setTrainCarCd("0001");
        companionSeat.setSeatCd("SEAT1A");
        companionSeat.setSeatFare(5000);
        companionSeat.setName("同行者A");
        companionSeat.setMail("companion@example.com");

        List<ReserveRequestDto.SelectedSeatDto> seats = List.of(
            new ReserveRequestDto.SelectedSeatDto("0001", "普通車", "SEAT1A", 5000)
        );
        ReserveRequestDto request = createRequest("user@example.com", "山田太郎", seats);
        ReservationCanceledEvent event = new ReservationCanceledEvent(
            UUID.randomUUID(), request, LocalTime.of(9, 0), LocalTime.of(10, 30), "山田太郎", List.of(companionSeat)
        );

        listener.handleReservationCanceled(event);

        verify(reservationEmailService, times(1)).sendReservationCancel(any());
        ArgumentCaptor<ReservationEmailRequestParams> companionCaptor = ArgumentCaptor.forClass(ReservationEmailRequestParams.class);
        verify(reservationEmailService, times(1)).sendReleaseCompanion(companionCaptor.capture());
        assertEquals("companion@example.com", companionCaptor.getValue().getReserverMail());
    }

    @Test
    @DisplayName("同行者にメールアドレスが登録されていない場合は割当解除メールを送信しない")
    void handleReservationCanceled_doesNotSendReleaseCompanion_whenCompanionHasNoMail() {
        initListener();
        stubStationsAndSchedule();
        when(seatRepository.findAllById(anyIterable())).thenReturn(List.of(seatEntity("SEAT1A", 1, "A")));

        ReservedSeatEntity companionSeat = new ReservedSeatEntity();
        companionSeat.setTrainCarCd("0001");
        companionSeat.setSeatCd("SEAT1A");
        companionSeat.setSeatFare(5000);
        companionSeat.setName("同行者A");
        companionSeat.setMail(null);

        List<ReserveRequestDto.SelectedSeatDto> seats = List.of(
            new ReserveRequestDto.SelectedSeatDto("0001", "普通車", "SEAT1A", 5000)
        );
        ReserveRequestDto request = createRequest("user@example.com", "山田太郎", seats);
        ReservationCanceledEvent event = new ReservationCanceledEvent(
            UUID.randomUUID(), request, LocalTime.of(9, 0), LocalTime.of(10, 30), "山田太郎", List.of(companionSeat)
        );

        listener.handleReservationCanceled(event);

        verify(reservationEmailService, times(1)).sendReservationCancel(any());
        verify(reservationEmailService, never()).sendReleaseCompanion(any());
    }

    @Test
    @DisplayName("キャンセル対象座席の同行者情報が見つからない場合は例外を送出する")
    void handleReservationCanceled_whenCompanionInfoMissing_throwsException() {
        initListener();
        stubStationsAndSchedule();
        when(seatRepository.findAllById(anyIterable())).thenReturn(List.of(seatEntity("SEAT1A", 1, "A")));

        List<ReserveRequestDto.SelectedSeatDto> seats = List.of(
            new ReserveRequestDto.SelectedSeatDto("0001", "普通車", "SEAT1A", 5000)
        );
        ReserveRequestDto request = createRequest("user@example.com", "山田太郎", seats);
        ReservationCanceledEvent event = new ReservationCanceledEvent(
            UUID.randomUUID(), request, LocalTime.of(9, 0), LocalTime.of(10, 30), "山田太郎", List.of()
        );

        assertThrows(IllegalArgumentException.class, () -> listener.handleReservationCanceled(event));
    }

    @Test
    @DisplayName("同行者座席割当イベントのリクエストごとに割当完了メールを送信する")
    void handleReservedSetReleased_sendsSetCompanionForEachRequest() {
        initListener();
        stubStationsAndSchedule();
        when(seatRepository.findAllById(anyIterable())).thenReturn(List.of(seatEntity("SEAT1A", 1, "A"), seatEntity("SEAT2B", 2, "B")));

        ReserveRequestDto request1 = createRequest("companion1@example.com", "同行者1", List.of(
            new ReserveRequestDto.SelectedSeatDto("0001", "普通車", "SEAT1A", 5000)
        ));
        ReserveRequestDto request2 = createRequest("companion2@example.com", "同行者2", List.of(
            new ReserveRequestDto.SelectedSeatDto("0002", "普通車", "SEAT2B", 6000)
        ));
        ReservedSeatSetEvent event = new ReservedSeatSetEvent(
            UUID.randomUUID(), List.of(request1, request2), LocalTime.of(9, 0), LocalTime.of(10, 30), "山田太郎"
        );

        listener.handleReservedSetReleased(event);

        verify(reservationEmailService, times(2)).sendSetCompanion(any());
    }

    @Test
    @DisplayName("同行者座席解除イベントのリクエストごとに割当解除メールを送信する")
    void handleReservedSeatReleased_sendsReleaseCompanionForEachRequest() {
        initListener();
        stubStationsAndSchedule();
        when(seatRepository.findAllById(anyIterable())).thenReturn(List.of(seatEntity("SEAT1A", 1, "A")));

        ReserveRequestDto request1 = createRequest("companion1@example.com", "同行者1", List.of(
            new ReserveRequestDto.SelectedSeatDto("0001", "普通車", "SEAT1A", 5000)
        ));
        ReservedSeatReleaseEvent event = new ReservedSeatReleaseEvent(
            UUID.randomUUID(), List.of(request1), LocalTime.of(9, 0), LocalTime.of(10, 30), "山田太郎"
        );

        listener.handleReservedSeatReleased(event);

        ArgumentCaptor<ReservationEmailRequestParams> captor = ArgumentCaptor.forClass(ReservationEmailRequestParams.class);
        verify(reservationEmailService, times(1)).sendReleaseCompanion(captor.capture());
        assertEquals("companion1@example.com", captor.getValue().getReserverMail());
    }
}
