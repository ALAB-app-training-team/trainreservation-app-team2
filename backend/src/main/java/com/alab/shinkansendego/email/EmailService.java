package com.alab.shinkansendego.email;

public interface EmailService {
    void sendReservationConfirmation(EmailRequestDto dto);
}
