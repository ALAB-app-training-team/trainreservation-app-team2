package com.alab.shinkansendego.email;

import com.alab.shinkansendego.reservation.ReservationCreatedEvent;
import com.alab.shinkansendego.schedule.ScheduleEntity;
import com.alab.shinkansendego.schedule.ScheduleRepository;
import com.alab.shinkansendego.seat.SeatRepository;
import com.alab.shinkansendego.station.StationEntity;
import com.alab.shinkansendego.station.StationRepository;
import com.alab.shinkansendego.traintype.TrainTypeEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.List;

@Component
public class ReservationEventListener {
    private final EmailService emailService;
    private final StationRepository stationRepository;
    private final ScheduleRepository scheduleRepository;
    private final SeatRepository seatRepository;

    public ReservationEventListener(
        EmailService emailService,
        StationRepository stationRepository,
        ScheduleRepository scheduleRepository,
        SeatRepository seatRepository
    ) {
        this.emailService = emailService;
        this.stationRepository = stationRepository;
        this.scheduleRepository = scheduleRepository;
        this.seatRepository = seatRepository;
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleReservationCreated(ReservationCreatedEvent event) {
        String departureStationName = stationRepository.findById(event.request().getDepartureStationCd())
            .map(StationEntity::getName)
            .orElse(event.request().getDepartureStationCd());

        String arrivalStationName = stationRepository.findById(event.request().getArrivalStationCd())
            .map(StationEntity::getName)
            .orElse(event.request().getArrivalStationCd());

        String trainTypeName = scheduleRepository.findByScheduleCd(event.request().getScheduleCd())
            .map(ScheduleEntity::getTrainType)
            .map(TrainTypeEntity::getName)
            .orElse("");

        EmailRequestDto emailDto = new EmailRequestDto();
        emailDto.setReserverMail(event.request().getReserverMail());
        emailDto.setReserverName(event.request().getReserverName());
        emailDto.setReservationId(event.reservationId());
        emailDto.setRideDate(event.request().getRideDate());

        emailDto.setDepartureStationName(departureStationName);
        emailDto.setDepartureTime(event.departureTime());
        emailDto.setArrivalStationName(arrivalStationName);
        emailDto.setArrivalTime(event.arrivalTime());
        emailDto.setTrainTypeName(trainTypeName);

        int totalAmount = event.request().getSeats().stream()
            .filter(seat -> seat.getSeatFare() != null)
            .mapToInt(seat -> seat.getSeatFare())
            .sum();
        emailDto.setTotalAmount(totalAmount);

        if (event.request().getSeats() != null) {
            List<EmailRequestDto.SelectedSeatDto> emailSeats = event.request().getSeats().stream()
                .map(seat -> {
                    String seatDisplay = seatRepository.findById(seat.getSeatCd())
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
            emailDto.setSeats(emailSeats);
        }
        emailService.sendReservationConfirmation(emailDto);
    }
}
