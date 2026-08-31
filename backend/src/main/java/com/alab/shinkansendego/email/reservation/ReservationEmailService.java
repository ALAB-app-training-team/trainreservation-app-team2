package com.alab.shinkansendego.email.reservation;

public interface ReservationEmailService {
    void sendReservationConfirmation(ReservationEmailRequestDto dto);

    void sendReservationChange(ReservationEmailRequestDto dto);

    void sendReservationCancel(ReservationEmailRequestDto dto);

    void sendSetCompanion(ReservationEmailRequestDto dto);

    void sendReleaseCompanion(ReservationEmailRequestDto dto);
}
