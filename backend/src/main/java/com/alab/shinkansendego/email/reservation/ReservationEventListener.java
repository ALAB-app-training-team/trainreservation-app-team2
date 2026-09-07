package com.alab.shinkansendego.email.reservation;

import com.alab.shinkansendego.reservation.ReservationCanceledEvent;
import com.alab.shinkansendego.reservation.ReservationChangedEvent;
import com.alab.shinkansendego.reservation.ReservationCreatedEvent;
import com.alab.shinkansendego.reservation.ReserveRequestDto;
import com.alab.shinkansendego.reservedseat.ReservedSeatEntity;
import com.alab.shinkansendego.reservedseat.ReservedSeatReleaseEvent;
import com.alab.shinkansendego.reservedseat.ReservedSeatSetEvent;
import com.alab.shinkansendego.schedule.ScheduleEntity;
import com.alab.shinkansendego.schedule.ScheduleRepository;
import com.alab.shinkansendego.seat.SeatEntity;
import com.alab.shinkansendego.seat.SeatRepository;
import com.alab.shinkansendego.station.StationEntity;
import com.alab.shinkansendego.station.StationRepository;
import com.alab.shinkansendego.traincar.TrainCarRepository;
import com.alab.shinkansendego.traintype.TrainTypeEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.util.CollectionUtils;

import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Component
public class ReservationEventListener {
    private final ReservationEmailService reservationEmailService;
    private final StationRepository stationRepository;
    private final ScheduleRepository scheduleRepository;
    private final SeatRepository seatRepository;
    private final TrainCarRepository trainCarRepository;

    public ReservationEventListener(
        ReservationEmailService reservationEmailService,
        StationRepository stationRepository,
        ScheduleRepository scheduleRepository,
        SeatRepository seatRepository,
        TrainCarRepository trainCarRepository
    ) {
        this.reservationEmailService = reservationEmailService;
        this.stationRepository = stationRepository;
        this.scheduleRepository = scheduleRepository;
        this.seatRepository = seatRepository;
        this.trainCarRepository = trainCarRepository;
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleReservationCreated(ReservationCreatedEvent event) {
        ReservationEmailRequestParams emailParams = setEmailRequestParams(event.reservationId(), event.request(), event.departureTime(), event.arrivalTime(), null, null);
        emailParams.setIsGuest(event.isGuest());
        reservationEmailService.sendReservationConfirmation(emailParams);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleReservationChanged(ReservationChangedEvent event) {
        ReservationEmailRequestParams emailParams = setEmailRequestParams(event.reservationId(), event.request(), event.departureTime(), event.arrivalTime(), event.oldTotalAmount(), event.representativeName());
        emailParams.setIsGuest(event.isGuest());
        reservationEmailService.sendReservationChange(emailParams);
        if (!CollectionUtils.isEmpty(event.assignedReservedSeats())) {
            for (ReservedSeatEntity assignedSeat : event.assignedReservedSeats()) {
                String trainCarCd = trainCarRepository.findByTrainCarCd(assignedSeat.getTrainCarCd())
                    .orElseThrow(() -> new IllegalArgumentException("TrainCar is not found")).getSeatType().getTrainCarTypeCd();
                ReserveRequestDto companionDto = new ReserveRequestDto(
                    event.oldReservation().getScheduleCd(),
                    event.oldReservation().getRideDate(),
                    event.oldReservation().getDepartureStationCd(),
                    event.oldReservation().getArrivalStationCd(),
                    assignedSeat.getName(),
                    assignedSeat.getMail(),
                    event.oldReservation().getPaymentTrackingId(),
                    List.of(new ReserveRequestDto.SelectedSeatDto(
                        assignedSeat.getTrainCarCd(),
                        trainCarCd,
                        assignedSeat.getSeatCd(),
                        assignedSeat.getSeatFare()))
                );
                ReservationEmailRequestParams companionEmailParams = setEmailRequestParams(event.reservationId(), companionDto, event.departureTime(), event.arrivalTime(), event.oldTotalAmount(), event.representativeName());
                reservationEmailService.sendReleaseCompanion(companionEmailParams);
            }
        }
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleReservationCanceled(ReservationCanceledEvent event) {

        ReservationEmailRequestParams emailParams = setEmailRequestParams(event.reservationId(), event.request(), event.departureTime(), event.arrivalTime(), null, event.representativeName());
        emailParams.setIsGuest(event.isGuest());
        reservationEmailService.sendReservationCancel(emailParams);

        for (ReserveRequestDto.SelectedSeatDto seat : event.request().getSeats()) {
            ReservedSeatEntity info = event.reservedSeats().stream()
                .filter(companion -> companion.getTrainCarCd().equals(seat.getTrainCarCd())
                    && companion.getSeatCd().equals(seat.getSeatCd()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("CompanionInfo is Not Found"));
            if (info.getMail() != null && !info.getMail().isEmpty()) {
                ReserveRequestDto companionDto = new ReserveRequestDto(
                    event.request().getScheduleCd(),
                    event.request().getRideDate(),
                    event.request().getDepartureStationCd(),
                    event.request().getArrivalStationCd(),
                    info.getName(),
                    info.getMail(),
                    event.request().getPaymentToken(),
                    List.of(new ReserveRequestDto.SelectedSeatDto(info.getTrainCarCd(), seat.getTrainCarTypeCd(), info.getSeatCd(), info.getSeatFare()))
                );
                ReservationEmailRequestParams companionEmailParams = setEmailRequestParams(event.reservationId(), companionDto, event.departureTime(), event.arrivalTime(), null, event.representativeName());
                reservationEmailService.sendReleaseCompanion(companionEmailParams);
            }
        }
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleReservedSetReleased(ReservedSeatSetEvent event) {
        for (ReserveRequestDto request : event.requests()) {
            ReservationEmailRequestParams emailParams = setEmailRequestParams(event.reservationId(), request, event.departureTime(), event.arrivalTime(), null, event.representativeName());
            reservationEmailService.sendSetCompanion(emailParams);
        }
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleReservedSeatReleased(ReservedSeatReleaseEvent event) {
        for (ReserveRequestDto request : event.requests()) {
            ReservationEmailRequestParams emailParams = setEmailRequestParams(event.reservationId(), request, event.departureTime(), event.arrivalTime(), null, event.representativeName());
            reservationEmailService.sendReleaseCompanion(emailParams);
        }
    }

    private ReservationEmailRequestParams setEmailRequestParams(UUID reservationId,
                                                                ReserveRequestDto request,
                                                                LocalTime departureTime,
                                                                LocalTime arrivalTime,
                                                                Integer oldTotalAmount,
                                                                String representativeName) {
        String departureStationName = stationRepository.findById(request.getDepartureStationCd())
            .map(StationEntity::getName)
            .orElse(request.getDepartureStationCd());

        String arrivalStationName = stationRepository.findById(request.getArrivalStationCd())
            .map(StationEntity::getName)
            .orElse(request.getArrivalStationCd());

        String trainTypeName = scheduleRepository.findByScheduleCd(request.getScheduleCd())
            .map(ScheduleEntity::getTrainType)
            .map(TrainTypeEntity::getName)
            .orElse("");

        ReservationEmailRequestParams emailParams = new ReservationEmailRequestParams();
        emailParams.setReserverMail(request.getReserverMail());
        emailParams.setReserverName(request.getReserverName());
        emailParams.setReservationId(reservationId);
        emailParams.setRideDate(request.getRideDate());

        emailParams.setDepartureStationName(departureStationName);
        emailParams.setDepartureTime(departureTime);
        emailParams.setArrivalStationName(arrivalStationName);
        emailParams.setArrivalTime(arrivalTime);
        emailParams.setTrainTypeName(trainTypeName);

        emailParams.setSeats(setDisplaySeats(request.getSeats()));

        int totalAmount = request.getSeats().stream()
            .filter(seat -> seat.getSeatFare() != null)
            .mapToInt(ReserveRequestDto.SelectedSeatDto::getSeatFare)
            .sum();
        emailParams.setTotalAmount(totalAmount);

        int newTotalAmount = 0;
        if (request.getSeats() != null) {
            newTotalAmount = request.getSeats().stream()
                .filter(seat -> seat.getSeatFare() != null)
                .mapToInt(ReserveRequestDto.SelectedSeatDto::getSeatFare)
                .sum();
        }
        emailParams.setTotalAmount(newTotalAmount);
        emailParams.setOldAmount(oldTotalAmount);
        emailParams.setRepresentativeName(representativeName);

        return emailParams;
    }

    private List<ReservationEmailRequestParams.SelectedSeatParams> setDisplaySeats(List<ReserveRequestDto.SelectedSeatDto> seats) {
        List<SeatEntity> seatEntities = seatRepository.findAllById(
            seats.stream().map(ReserveRequestDto.SelectedSeatDto::getSeatCd).toList()
        );

        return seats.stream()
            .map(seat -> {
                String seatDisplay = seatEntities.stream()
                    .filter(entity -> entity.getSeatCd().equals(seat.getSeatCd()))
                    .findFirst()
                    .map(seatEntity -> seatEntity.getSeatNumber() + "番" + seatEntity.getSeatColumn() + "席")
                    .orElse(seat.getSeatCd());

                return new ReservationEmailRequestParams.SelectedSeatParams(
                    seat.getTrainCarCd(),
                    seat.getTrainCarTypeCd(),
                    seatDisplay,
                    seat.getSeatFare()
                );
            })
            .sorted(Comparator.comparing(ReservationEmailRequestParams.SelectedSeatParams::getTrainCarCd)
                .thenComparing(ReservationEmailRequestParams.SelectedSeatParams::getSeatCd))
            .toList();
    }
}
