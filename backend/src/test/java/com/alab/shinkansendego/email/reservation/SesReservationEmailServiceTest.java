package com.alab.shinkansendego.email.reservation;

import com.alab.shinkansendego.utils.EmailUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import software.amazon.awssdk.services.sesv2.SesV2Client;
import software.amazon.awssdk.services.sesv2.model.SendEmailRequest;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class SesReservationEmailServiceTest {

    private static final String BASE_URL = "http://localhost:3000";
    private static final String MAIL_FROM = "noreply@example.com";

    @Mock
    private SesV2Client sesV2Client;

    private SesReservationEmailService service;

    @BeforeEach
    void setUp() {
        service = new SesReservationEmailService("ap-northeast-1");
        ReflectionTestUtils.setField(service, "sesV2Client", sesV2Client);
        ReflectionTestUtils.setField(service, "baseUrl", BASE_URL);
        ReflectionTestUtils.setField(service, "mailFrom", MAIL_FROM);
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
    @DisplayName("予約完了メールを正しい宛先・件名・本文でSES経由送信する")
    void sendReservationConfirmation_sendsMailToReserver() {
        ReservationEmailRequestParams params = createParams();

        service.sendReservationConfirmation(params);

        ArgumentCaptor<SendEmailRequest> captor = ArgumentCaptor.forClass(SendEmailRequest.class);
        verify(sesV2Client, times(1)).sendEmail(captor.capture());
        SendEmailRequest sent = captor.getValue();
        assertEquals(List.of("user@example.com"), sent.destination().toAddresses());
        assertEquals(EmailUtils.SUBJECT, sent.content().simple().subject().data());
        assertTrue(sent.fromEmailAddress().contains(MAIL_FROM));
        String body = sent.content().simple().body().text().data();
        assertTrue(body.contains(params.getReservationId().toString()));
        assertTrue(body.contains("10,000 円"));
    }

    @Test
    @DisplayName("予約変更メールに変更差額を反映してSES経由送信する")
    void sendReservationChange_sendsMailWithDifference() {
        ReservationEmailRequestParams params = createParams();

        service.sendReservationChange(params);

        ArgumentCaptor<SendEmailRequest> captor = ArgumentCaptor.forClass(SendEmailRequest.class);
        verify(sesV2Client, times(1)).sendEmail(captor.capture());
        SendEmailRequest sent = captor.getValue();
        assertEquals(EmailUtils.CHANGE_SUBJECT, sent.content().simple().subject().data());
        String body = sent.content().simple().body().text().data();
        assertTrue(body.contains("変更差額　+2,000円"));
    }

    @Test
    @DisplayName("予約キャンセルメールに手数料と払戻金額を反映してSES経由送信する")
    void sendReservationCancel_sendsMailWithRefundDetail() {
        ReservationEmailRequestParams params = createParams();

        service.sendReservationCancel(params);

        ArgumentCaptor<SendEmailRequest> captor = ArgumentCaptor.forClass(SendEmailRequest.class);
        verify(sesV2Client, times(1)).sendEmail(captor.capture());
        SendEmailRequest sent = captor.getValue();
        assertEquals(EmailUtils.CANCEL_SUBJECT, sent.content().simple().subject().data());
        String body = sent.content().simple().body().text().data();
        assertTrue(body.contains("手数料：320 円"));
        assertTrue(body.contains("払戻金額：9,680 円"));
    }

    @Test
    @DisplayName("同行者割り当てメールにチケットURLを含めてSES経由送信する")
    void sendSetCompanion_sendsMailWithTicketUrl() {
        ReservationEmailRequestParams params = createParams();

        service.sendSetCompanion(params);

        ArgumentCaptor<SendEmailRequest> captor = ArgumentCaptor.forClass(SendEmailRequest.class);
        verify(sesV2Client, times(1)).sendEmail(captor.capture());
        SendEmailRequest sent = captor.getValue();
        assertEquals(EmailUtils.SET_SUBJECT, sent.content().simple().subject().data());
        String body = sent.content().simple().body().text().data();
        assertTrue(body.contains(BASE_URL + EmailUtils.TICKET_PATH + params.getReservationId()));
    }

    @Test
    @DisplayName("同行者割り当て解除メールを正しい件名でSES経由送信する")
    void sendReleaseCompanion_sendsMail() {
        ReservationEmailRequestParams params = createParams();

        service.sendReleaseCompanion(params);

        ArgumentCaptor<SendEmailRequest> captor = ArgumentCaptor.forClass(SendEmailRequest.class);
        verify(sesV2Client, times(1)).sendEmail(captor.capture());
        assertEquals(EmailUtils.RELEASE_SUBJECT, captor.getValue().content().simple().subject().data());
    }

    @Test
    @DisplayName("SES送信に失敗しても例外を外部に伝播させない")
    void sendReservationConfirmation_whenSendFails_doesNotPropagateException() {
        ReservationEmailRequestParams params = createParams();
        doThrow(software.amazon.awssdk.core.exception.SdkException.create("ses error", null))
            .when(sesV2Client).sendEmail(any(SendEmailRequest.class));

        assertDoesNotThrow(() -> service.sendReservationConfirmation(params));
        verify(sesV2Client, times(1)).sendEmail(any(SendEmailRequest.class));
    }
}
