package com.alab.shinkansendego.email.reservation;

public interface ReservationEmailService {
    void sendReservationConfirmation(ReservationEmailRequestParams dto);

    void sendReservationChange(ReservationEmailRequestParams dto);

    void sendReservationCancel(ReservationEmailRequestParams dto);

    void sendSetCompanion(ReservationEmailRequestParams dto);

    void sendReleaseCompanion(ReservationEmailRequestParams dto);
}
