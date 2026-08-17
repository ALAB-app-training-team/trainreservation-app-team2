package com.alab.shinkansendego.reservedseat;

import com.alab.shinkansendego.reservation.ReservationEntity;
import com.alab.shinkansendego.reservation.ReservationRepository;
import com.alab.shinkansendego.utils.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ReservedSeatService {
    private final ReservationRepository reservationRepository;
    private final ReservedSeatRepository reservedSeatRepository;

    @Autowired
    public ReservedSeatService(ReservationRepository reservationRepository, ReservedSeatRepository reservedSeatRepository) {
        this.reservationRepository = reservationRepository;
        this.reservedSeatRepository = reservedSeatRepository;
    }

    @Transactional
    public void updateReservedSeats(UUID reservationId, List<ReservedSeatUpdateDto> reservedSeats, UUID accountId, String name, String mail) {
        ReservationEntity reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new IllegalArgumentException("Reservation is Not found"));
        if (reservation.getIsDeleted()) {
            throw new IllegalArgumentException("Reservation is Not found");
        }

        if (accountId != null) {
            if (!accountId.equals(reservation.getAccountId())) {
                throw new AccessDeniedException("Forbidden");
            }
        } else {
            if (reservation.getAccountId() != null) {
                throw new AccessDeniedException("Login Required");
            }
            if (name.isEmpty() || mail.isEmpty()) throw new IllegalArgumentException("Name and Mail is required");
            if (!name.equals(reservation.getReserverName()) || !mail.equals(reservation.getReserverMail())) {
                throw new AccessDeniedException("Forbidden");
            }
        }

        for (ReservedSeatUpdateDto reservedSeat : reservedSeats) {
            ReservedSeatEntity reservedSeatEntity =
                reservedSeatRepository.findByIdAndReservationIdAndIsDeleted(reservedSeat.getId(),
                    reservationId, false).orElseThrow(() -> new IllegalArgumentException("ReservedSeat is Not found"));
            reservedSeatEntity.setName(StringUtils.removeSpaces(reservedSeat.getName()));
            reservedSeatEntity.setMail(StringUtils.removeSpaces(reservedSeat.getMail()));
        }
    }
}
