package com.alab.shinkansendego.email.reservation;

import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

public class LocalReservationEmailServiceTest {
    private LocalReservationEmailService service;
    @Mock
    private JavaMailSender mailSender;
    private MimeMessage sentMessage;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        service = new LocalReservationEmailService(mailSender);
        ReflectionTestUtils.setField(service, "baseUrl", "http://localhost:5173");
        sentMessage = new MimeMessage((Session) null);
        when(mailSender.createMimeMessage()).thenReturn(sentMessage);
    }

    private ReservationEmailRequestParams createParams(Boolean isGuest) {
        ReservationEmailRequestParams dto = new ReservationEmailRequestParams();
        dto.setReserverMail("test@test.com");
        dto.setReserverName("テスト太郎");
        dto.setReservationId(UUID.fromString("11111111-1111-1111-1111-111111111111"));
        dto.setTrainTypeName("のぞみ");
        dto.setDepartureStationName("東京");
        dto.setArrivalStationName("新大阪");
        dto.setTotalAmount(10000);
        dto.setSeats(java.util.List.of());
        dto.setIsGuest(isGuest);
        return dto;
    }

    private String getSentBody() throws IOException, jakarta.mail.MessagingException {
        Object content = sentMessage.getContent();
        return content.toString();
    }

    @Test
    @DisplayName("ゲスト予約の場合、確認メールにゲストログイン用URLが添付されること")
    void sendReservationConfirmation_withGuestReservation_attachGuestLoginUrl() throws Exception {
        service.sendReservationConfirmation(createParams(true));

        String body = getSentBody();
        assertTrue(body.contains(
            "http://localhost:5173/reservationGuestLogin?reservationId=11111111-1111-1111-1111-111111111111"));
        assertFalse(body.contains("http://localhost:5173/login"));
    }

    @Test
    @DisplayName("アカウント予約の場合、確認メールにログインURLが添付されること")
    void sendReservationConfirmation_withAccountReservation_attachLoginUrl() throws Exception {
        service.sendReservationConfirmation(createParams(false));

        String body = getSentBody();
        assertTrue(body.contains("http://localhost:5173/login"));
        assertFalse(body.contains("/reservationGuestLogin"));
    }

    @Test
    @DisplayName("isGuestが未設定の場合、確認メールにログインURLが添付されること")
    void sendReservationConfirmation_withNullIsGuest_attachLoginUrl() throws Exception {
        service.sendReservationConfirmation(createParams(null));

        String body = getSentBody();
        assertTrue(body.contains("http://localhost:5173/login"));
        assertFalse(body.contains("/reservationGuestLogin"));
    }

    @Test
    @DisplayName("ゲスト予約の場合、キャンセルメールにゲストログイン用URLが添付されること")
    void sendReservationCancel_withGuestReservation_attachGuestLoginUrl() throws Exception {
        service.sendReservationCancel(createParams(true));

        String body = getSentBody();
        assertTrue(body.contains(
            "http://localhost:5173/reservationGuestLogin?reservationId=11111111-1111-1111-1111-111111111111"));
        assertFalse(body.contains("http://localhost:5173/login"));
    }

    @Test
    @DisplayName("アカウント予約の場合、キャンセルメールにログインURLが添付されること")
    void sendReservationCancel_withAccountReservation_attachLoginUrl() throws Exception {
        service.sendReservationCancel(createParams(false));

        String body = getSentBody();
        assertTrue(body.contains("http://localhost:5173/login"));
        assertFalse(body.contains("/reservationGuestLogin"));
    }

    @Test
    @DisplayName("ゲスト予約の場合、変更メールにゲストログイン用URLが添付されること")
    void sendReservationChange_withGuestReservation_attachGuestLoginUrl() throws Exception {
        service.sendReservationChange(createParams(true));

        String body = getSentBody();
        assertTrue(body.contains(
            "http://localhost:5173/reservationGuestLogin?reservationId=11111111-1111-1111-1111-111111111111"));
        assertFalse(body.contains("http://localhost:5173/login"));
    }

    @Test
    @DisplayName("アカウント予約の場合、変更メールにログインURLが添付されること")
    void sendReservationChange_withAccountReservation_attachLoginUrl() throws Exception {
        service.sendReservationChange(createParams(false));

        String body = getSentBody();
        assertTrue(body.contains("http://localhost:5173/login"));
        assertFalse(body.contains("/reservationGuestLogin"));
    }
}
