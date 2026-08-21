package com.alab.shinkansendego.email;

import com.alab.shinkansendego.reservation.ReservationCanceledEvent;
import com.alab.shinkansendego.reservation.ReservationChangedEvent;
import com.alab.shinkansendego.reservation.ReservationCreatedEvent;
import com.alab.shinkansendego.reservation.ReserveRequestDto;
import com.alab.shinkansendego.reservedseat.ReservedSeatEntity;
import com.alab.shinkansendego.reservedseat.ReservedSeatRepository;
import com.alab.shinkansendego.schedule.ScheduleEntity;
import com.alab.shinkansendego.schedule.ScheduleRepository;
import com.alab.shinkansendego.seat.SeatEntity;
import com.alab.shinkansendego.seat.SeatRepository;
import com.alab.shinkansendego.station.StationEntity;
import com.alab.shinkansendego.station.StationRepository;
import com.alab.shinkansendego.traintype.TrainTypeEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Component
public class ReservationEventListener {
    private final EmailService emailService;
    private final StationRepository stationRepository;
    private final ScheduleRepository scheduleRepository;
    private final SeatRepository seatRepository;
    private final ReservedSeatRepository reservedSeatRepository;

    public ReservationEventListener(
        EmailService emailService,
        StationRepository stationRepository,
        ScheduleRepository scheduleRepository,
        SeatRepository seatRepository,
        ReservedSeatRepository reservedSeatRepository
    ) {
        this.emailService = emailService;
        this.stationRepository = stationRepository;
        this.scheduleRepository = scheduleRepository;
        this.seatRepository = seatRepository;
        this.reservedSeatRepository = reservedSeatRepository;
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleReservationCreated(ReservationCreatedEvent event) {

        EmailRequestDto emailDto = setEmailRequestDto(event.reservationId(), event.request(), event.departureTime(), event.arrivalTime(), null);
        emailService.sendReservationConfirmation(emailDto);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleReservationChanged(ReservationChangedEvent event) {
        EmailRequestDto emailDto = setEmailRequestDto(event.reservationId(), event.request(), event.departureTime(), event.arrivalTime(), event.oldTotalAmount());
        emailService.sendReservationChange(emailDto);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleReservationCanceled(ReservationCanceledEvent event) {

        EmailRequestDto emailDto = setEmailRequestDto(event.reservationId(), event.request(), event.departureTime(), event.arrivalTime(), null);
        emailService.sendReservationCancel(emailDto);

        List<ReservedSeatEntity> companions = reservedSeatRepository.findByReservationId(event.reservationId());

        for (ReserveRequestDto.SelectedSeatDto seat : event.request().getSeats()) {
            ReservedSeatEntity info = companions.stream()
                .filter(companion -> companion.getTrainCarCd().equals(seat.getTrainCarCd())
                    && companion.getSeatCd().equals(seat.getSeatCd()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("CompanionInfo is Not Found"));
            if (info.getMail() != null && !info.getMail().isEmpty()) {
                emailDto.setReserverMail(info.getMail());
                emailDto.setReserverName(info.getName());
                emailDto.setSeats(setDisplaySeats(List.of(new ReserveRequestDto.SelectedSeatDto(info.getTrainCarCd(), seat.getTrainCarTypeCd(), info.getSeatCd(), info.getSeatFare()))));
                emailService.sendReleaseCompanion(emailDto);
            }
        }
    }

    private EmailRequestDto setEmailRequestDto(UUID reservationId,
                                               ReserveRequestDto request,
                                               LocalTime departureTime,
                                               LocalTime arrivalTime,
                                               Integer oldTotalAmount) {
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

        EmailRequestDto emailDto = new EmailRequestDto();
        emailDto.setReserverMail(request.getReserverMail());
        emailDto.setReserverName(request.getReserverName());
        emailDto.setReservationId(reservationId);
        emailDto.setRideDate(request.getRideDate());

        emailDto.setDepartureStationName(departureStationName);
        emailDto.setDepartureTime(departureTime);
        emailDto.setArrivalStationName(arrivalStationName);
        emailDto.setArrivalTime(arrivalTime);
        emailDto.setTrainTypeName(trainTypeName);

        emailDto.setSeats(setDisplaySeats(request.getSeats()));

        int totalAmount = request.getSeats().stream()
            .filter(seat -> seat.getSeatFare() != null)
            .mapToInt(ReserveRequestDto.SelectedSeatDto::getSeatFare)
            .sum();
        emailDto.setTotalAmount(totalAmount);

        int newTotalAmount = 0;
        if (request.getSeats() != null) {
            newTotalAmount = request.getSeats().stream()
                .filter(seat -> seat.getSeatFare() != null)
                .mapToInt(ReserveRequestDto.SelectedSeatDto::getSeatFare)
                .sum();
        }
        emailDto.setTotalAmount(newTotalAmount);
        emailDto.setOldAmount(oldTotalAmount);

        return emailDto;
    }

    private List<EmailRequestDto.SelectedSeatDto> setDisplaySeats(List<ReserveRequestDto.SelectedSeatDto> seats) {
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

                return new EmailRequestDto.SelectedSeatDto(
                    seat.getTrainCarCd(),
                    seat.getTrainCarTypeCd(),
                    seatDisplay,
                    seat.getSeatFare()
                );
            })
            .toList();
    }
}
