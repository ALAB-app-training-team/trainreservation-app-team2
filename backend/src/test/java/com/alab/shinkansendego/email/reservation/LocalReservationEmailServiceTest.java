package com.alab.shinkansendego.email.reservation;

import com.alab.shinkansendego.utils.EmailUtils;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Properties;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LocalReservationEmailServiceTest {

    private static final String BASE_URL = "http://localhost:3000";

    @Mock
    private JavaMailSender mailSender;

    private LocalReservationEmailService service;

    @BeforeEach
    void setUp() {
        service = new LocalReservationEmailService(mailSender);
        ReflectionTestUtils.setField(service, "baseUrl", BASE_URL);
        when(mailSender.createMimeMessage()).thenReturn(new MimeMessage(Session.getDefaultInstance(new Properties())));
    }

    private ReservationEmailRequestParams createParams() {
        ReservationEmailRequestParams params = new ReservationEmailRequestParams();
        params.setReserverMail("user@example.com");
        params.setReserverName("山田太郎");
        params.setReservationId(UUID.fromString("00000000-0000-0000-0000-000000000001"));
        params.setTrainTypeName("はやぶさ");
        params.setRideDate(LocalDate.of(2026, 9, 10));
        params.setDepartureStationName("東京");
        params.setDepartureTime(LocalTime.of(9, 0));
        params.setArrivalStationName("仙台");
        params.setArrivalTime(LocalTime.of(10, 30));
        params.setTotalAmount(10000);
        params.setOldAmount(8000);
        params.setRepresentativeName("鈴木花子");
        params.setSeats(List.of(new ReservationEmailRequestParams.SelectedSeatParams("0001", "普通車", "1A", 10000)));
        return params;
    }

    @Test
    @DisplayName("予約完了メールを正しい宛先・件名・本文で送信する")
    void sendReservationConfirmation_sendsMailToReserver() throws Exception {
        ReservationEmailRequestParams params = createParams();

        service.sendReservationConfirmation(params);

        ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender, times(1)).send(captor.capture());
        MimeMessage sent = captor.getValue();
        assertEquals(EmailUtils.SUBJECT, sent.getSubject());
        assertEquals("user@example.com", sent.getAllRecipients()[0].toString());
        String content = (String) sent.getContent();
        assertTrue(content.contains(params.getReservationId().toString()));
        assertTrue(content.contains("10,000 円"));
    }

    @Test
    @DisplayName("予約変更メールを正しい宛先・件名・本文で送信する")
    void sendReservationChange_sendsMailToReserver() throws Exception {
        ReservationEmailRequestParams params = createParams();

        service.sendReservationChange(params);

        ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender, times(1)).send(captor.capture());
        MimeMessage sent = captor.getValue();
        assertEquals(EmailUtils.CHANGE_SUBJECT, sent.getSubject());
        assertEquals("user@example.com", sent.getAllRecipients()[0].toString());
        String content = (String) sent.getContent();
        assertTrue(content.contains("変更差額　+2,000円"));
    }

    @Test
    @DisplayName("予約キャンセルメールに手数料と払戻金額を反映して送信する")
    void sendReservationCancel_sendsMailWithRefundDetail() throws Exception {
        ReservationEmailRequestParams params = createParams();

        service.sendReservationCancel(params);

        ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender, times(1)).send(captor.capture());
        MimeMessage sent = captor.getValue();
        assertEquals(EmailUtils.CANCEL_SUBJECT, sent.getSubject());
        String content = (String) sent.getContent();
        assertTrue(content.contains("手数料：320 円"));
        assertTrue(content.contains("払戻金額：9,680 円"));
    }

    @Test
    @DisplayName("同行者割り当てメールにチケットURLを含めて送信する")
    void sendSetCompanion_sendsMailWithTicketUrl() throws Exception {
        ReservationEmailRequestParams params = createParams();

        service.sendSetCompanion(params);

        ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender, times(1)).send(captor.capture());
        MimeMessage sent = captor.getValue();
        assertEquals(EmailUtils.SET_SUBJECT, sent.getSubject());
        String content = (String) sent.getContent();
        assertTrue(content.contains(BASE_URL + EmailUtils.TICKET_PATH + params.getReservationId()));
        assertTrue(content.contains("鈴木花子"));
    }

    @Test
    @DisplayName("同行者割り当て解除メールを正しい件名で送信する")
    void sendReleaseCompanion_sendsMail() throws Exception {
        ReservationEmailRequestParams params = createParams();

        service.sendReleaseCompanion(params);

        ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender, times(1)).send(captor.capture());
        MimeMessage sent = captor.getValue();
        assertEquals(EmailUtils.RELEASE_SUBJECT, sent.getSubject());
    }

    @Test
    @DisplayName("メール送信に失敗しても例外を外部に伝播させない")
    void sendReservationConfirmation_whenSendFails_doesNotPropagateException() {
        ReservationEmailRequestParams params = createParams();
        doThrow(new MailSendException("smtp error")).when(mailSender).send(any(MimeMessage.class));

        assertDoesNotThrow(() -> service.sendReservationConfirmation(params));
        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }
}
