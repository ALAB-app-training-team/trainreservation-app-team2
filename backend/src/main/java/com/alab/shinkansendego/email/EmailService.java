package com.alab.shinkansendego.email;

public interface EmailService {
    void sendReservationConfirmation(EmailRequestDto dto);

    void sendReservationCancel(EmailRequestDto dto);

    void sendReleaseCompanion(EmailRequestDto dto);
}
