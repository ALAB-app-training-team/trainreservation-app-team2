package com.alab.shinkansendego.reservedseat;

import com.alab.shinkansendego.reservation.ReservationEntity;
import com.alab.shinkansendego.reservation.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public class ReservedSeatService {
    private final ReservationRepository reservationRepository;
    private final ReservedSeatRepository reservedSeatRepository;

    @Autowired
    public ReservedSeatService(ReservationRepository reservationRepository, ReservedSeatRepository reservedSeatRepository) {
        this.reservationRepository = reservationRepository;
        this.reservedSeatRepository = reservedSeatRepository;
    }

    @Transactional
    // TODO: nullを受け取れるか確認
    public void updateReservedSeats(UUID reservationId, List<ReservedSeatUpdateDto> reservedSeats, UUID accountId) {
        ReservationEntity reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new IllegalArgumentException("Reservation is Not found"));

        if (accountId != null) {
            if (!accountId.equals(reservation.getAccountId())) {
                // TODO: Exception&StatusCode検討
                throw new SecurityException("権限がありません（所有者が一致しません）");
            }
        } else {
            if (reservation.getAccountId() != null) {
                // TODO: Exception&StatusCode検討
                throw new SecurityException("権限がありません（ログインが必要です）");
            }
        }

        for (ReservedSeatUpdateDto reservedSeat : reservedSeats) {
            ReservedSeatEntity reservedSeatEntity =
                reservedSeatRepository.findByIdAndReservationId(reservedSeat.getId(),
                    reservationId).orElseThrow(() -> new IllegalArgumentException("ReservedSeat is Not found"));
            reservedSeatEntity.setName(reservedSeat.getName());
            reservedSeatEntity.setMail(reservedSeat.getMail());
        }
    }
}
