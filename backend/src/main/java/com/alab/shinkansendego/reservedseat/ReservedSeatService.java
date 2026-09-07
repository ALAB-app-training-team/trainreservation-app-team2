package com.alab.shinkansendego.reservedseat;

import com.alab.shinkansendego.account.AccountEntity;
import com.alab.shinkansendego.account.AccountRepository;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeEntity;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.reservation.ReservationEntity;
import com.alab.shinkansendego.reservation.ReservationRepository;
import com.alab.shinkansendego.reservation.ReserveRequestDto;
import com.alab.shinkansendego.traincar.TrainCarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import static com.alab.shinkansendego.utils.StringUtils.removeSpaces;

@Service
public class ReservedSeatService {
    private final ReservationRepository reservationRepository;
    private final ReservedSeatRepository reservedSeatRepository;
    private final DepartureArrivalTimeRepository departureArrivalTimeRepository;
    private final TrainCarRepository trainCarRepository;
    private final AccountRepository accountRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Autowired
    public ReservedSeatService(
        ReservationRepository reservationRepository,
        ReservedSeatRepository reservedSeatRepository,
        DepartureArrivalTimeRepository departureArrivalTimeRepository,
        TrainCarRepository trainCarRepository,
        AccountRepository accountRepository,
        ApplicationEventPublisher eventPublisher
    ) {
        this.reservationRepository = reservationRepository;
        this.reservedSeatRepository = reservedSeatRepository;
        this.departureArrivalTimeRepository = departureArrivalTimeRepository;
        this.trainCarRepository = trainCarRepository;
        this.accountRepository = accountRepository;
        this.eventPublisher = eventPublisher;
    }

    /**
     * 同行者割り当てメソッド
     *
     * @param reservationId 同行者を変更した予約情報ID
     * @param reservedSeats 同行者を変更した座席情報
     * @param accountId     同行者割り当てを実施した予約代表者のアカウントID
     * @param name          同行者割り当てを実施したゲスト予約代表者氏名
     * @param mail          同行者割り当てを実施したゲスト予約代表者メールアドレス
     */
    @Transactional
    public void updateReservedSeats(UUID reservationId, List<ReservedSeatUpdateDto> reservedSeats, UUID accountId, String name, String mail) {
        String representativeName;
        ReservationEntity reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new IllegalArgumentException("Reservation is Not found"));
        if (reservation.getIsDeleted()) {
            throw new IllegalArgumentException("Reservation is Not found");
        }

        if (accountId != null) {
            if (!accountId.equals(reservation.getAccountId())) {
                throw new AccessDeniedException("Forbidden");
            }
            AccountEntity account = accountRepository.findById(accountId).orElseThrow(() -> new IllegalArgumentException("Account is Not found"));
            representativeName = account.getName();
        } else {
            if (reservation.getAccountId() != null) {
                throw new AccessDeniedException("Login Required");
            }
            if (name.isEmpty() || mail.isEmpty()) throw new IllegalArgumentException("Name and Mail is required");
            if (!name.equals(reservation.getReserverName()) || !mail.equals(reservation.getReserverMail())) {
                throw new AccessDeniedException("Forbidden");
            }
            representativeName = name;
        }

        List<DepartureArrivalTimeEntity> schedules = departureArrivalTimeRepository.findByScheduleCd(reservation.getScheduleCd());
        LocalTime departureTime = schedules.stream()
            .filter(schedule -> schedule.getSectionKm().getStartStationCd().equals(reservation.getDepartureStationCd()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("DepartureTime is Not found"))
            .getDepartureTime();
        LocalTime arrivalTime = schedules.stream()
            .filter(schedule -> schedule.getSectionKm().getGoalStationCd().equals(reservation.getArrivalStationCd()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("ArrivalTime is Not found"))
            .getArrivalTime();

        List<ReserveRequestDto> releaseSeats = new ArrayList<>();
        List<ReserveRequestDto> setSeats = new ArrayList<>();

        for (ReservedSeatUpdateDto reservedSeat : reservedSeats) {
            ReservedSeatEntity reservedSeatEntity =
                reservedSeatRepository.findByIdAndReservationIdAndIsDeleted(reservedSeat.getId(),
                    reservationId, false).orElseThrow(() -> new IllegalArgumentException("ReservedSeat is Not found"));

            if ((reservedSeatEntity.getMail() == null || reservedSeatEntity.getMail().isBlank()) && !reservedSeat.getMail().isBlank()) {
                // 未割当を割り当て
                setSeats.add(setNameAndMail(reservation, reservedSeat.getName(), reservedSeat.getMail(), reservedSeatEntity));
            } else if (!reservedSeat.getMail().isBlank() && !Objects.equals(reservedSeatEntity.getMail(), reservedSeat.getMail())) {
                // 割り当て済を別の人に割り当て
                releaseSeats.add(setNameAndMail(reservation, reservedSeatEntity.getName(), reservedSeatEntity.getMail(), reservedSeatEntity));
                setSeats.add(setNameAndMail(reservation, reservedSeat.getName(), reservedSeat.getMail(), reservedSeatEntity));
            } else if ((reservedSeatEntity.getMail() != null && !reservedSeatEntity.getMail().isBlank()) && reservedSeat.getMail().isBlank()) {
                // 割り当て済を未割当
                releaseSeats.add(setNameAndMail(reservation, reservedSeatEntity.getName(), reservedSeatEntity.getMail(), reservedSeatEntity));
            }

            reservedSeatEntity.setName(removeSpaces(reservedSeat.getName()));
            reservedSeatEntity.setMail(removeSpaces(reservedSeat.getMail()));
        }
        if (!releaseSeats.isEmpty()) {
            eventPublisher.publishEvent(new ReservedSeatReleaseEvent(
                reservationId,
                releaseSeats,
                departureTime,
                arrivalTime,
                representativeName
            ));
        }
        if (!setSeats.isEmpty()) {
            eventPublisher.publishEvent(new ReservedSeatSetEvent(
                reservationId,
                setSeats,
                departureTime,
                arrivalTime,
                representativeName
            ));
        }
    }

    /**
     * メール送信要リクエストDTOを設定するメソッド
     *
     * @param reservation        同行者を変更した予約情報
     * @param name               送信先氏名
     * @param mail               送信先メールアドレス
     * @param reservedSeatEntity 同行者割り当て変更該当Entity
     */
    private ReserveRequestDto setNameAndMail(ReservationEntity reservation, String name, String mail, ReservedSeatEntity reservedSeatEntity) {
        return new ReserveRequestDto(
            reservation.getScheduleCd(),
            reservation.getRideDate(),
            reservation.getDepartureStationCd(),
            reservation.getArrivalStationCd(),
            removeSpaces(name),
            removeSpaces(mail),
            reservation.getPaymentTrackingId(),
            List.of(new ReserveRequestDto.SelectedSeatDto(
                reservedSeatEntity.getTrainCarCd(),
                trainCarRepository.findByTrainCarCd(reservedSeatEntity.getTrainCarCd()).orElseThrow(() -> new IllegalArgumentException("TrainCar is Not found")).getSeatType().getTrainCarTypeCd(),
                reservedSeatEntity.getSeatCd(),
                reservedSeatEntity.getSeatFare()
            ))
        );
    }
}
