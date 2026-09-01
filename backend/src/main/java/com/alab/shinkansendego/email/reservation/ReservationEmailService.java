package com.alab.shinkansendego.email.reservation;

public interface ReservationEmailService {
    void sendReservationConfirmation(ReservationEmailRequestParams params);

    void sendReservationChange(ReservationEmailRequestParams params);

    void sendReservationCancel(ReservationEmailRequestParams params);

    void sendSetCompanion(ReservationEmailRequestParams params);

    void sendReleaseCompanion(ReservationEmailRequestParams params);
}
