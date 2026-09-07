package com.alab.shinkansendego.email.account;

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

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class SesAccountEmailServiceTest {

    private static final String BASE_URL = "http://localhost:3000";
    private static final String MAIL_FROM = "noreply@example.com";

    @Mock
    private SesV2Client sesV2Client;

    private SesAccountEmailService service;

    @BeforeEach
    void setUp() {
        service = new SesAccountEmailService("ap-northeast-1");
        ReflectionTestUtils.setField(service, "sesV2Client", sesV2Client);
        ReflectionTestUtils.setField(service, "baseUrl", BASE_URL);
        ReflectionTestUtils.setField(service, "mailFrom", MAIL_FROM);
    }

    @Test
    @DisplayName("アカウント作成完了メールを正しい宛先・件名・本文でSES経由送信する")
    void sendAccountCreate_sendsMailToNewAccount() {
        AccountEmailRequestParams params = new AccountEmailRequestParams("new@example.com", "山田太郎");

        service.sendAccountCreate(params);

        ArgumentCaptor<SendEmailRequest> captor = ArgumentCaptor.forClass(SendEmailRequest.class);
        verify(sesV2Client, times(1)).sendEmail(captor.capture());
        SendEmailRequest sent = captor.getValue();
        assertEquals(List.of("new@example.com"), sent.destination().toAddresses());
        assertEquals(EmailUtils.ACCOUNT_CREATED_SUBJECT, sent.content().simple().subject().data());
        String body = sent.content().simple().body().text().data();
        assertTrue(body.contains("山田太郎"));
        assertTrue(body.contains(BASE_URL + EmailUtils.LOGIN_PATH));
    }

    @Test
    @DisplayName("メールアドレス変更なしの場合は新アドレス宛にアカウント変更完了メールをSES経由送信する")
    void sendAccountUpdate_withoutMailChange_sendsMailToNewAddress() {
        AccountEmailRequestParams newParams = new AccountEmailRequestParams("same@example.com", "新氏名");
        AccountEmailRequestParams oldParams = new AccountEmailRequestParams(null, "旧氏名");

        service.sendAccountUpdate(newParams, oldParams);

        ArgumentCaptor<SendEmailRequest> captor = ArgumentCaptor.forClass(SendEmailRequest.class);
        verify(sesV2Client, times(1)).sendEmail(captor.capture());
        assertEquals(List.of("same@example.com"), captor.getValue().destination().toAddresses());
    }

    @Test
    @DisplayName("メールアドレス変更ありの場合は旧アドレス宛にアカウント変更完了メールをSES経由送信する")
    void sendAccountUpdate_withMailChange_sendsMailToOldAddress() {
        AccountEmailRequestParams newParams = new AccountEmailRequestParams("new@example.com", "新氏名");
        AccountEmailRequestParams oldParams = new AccountEmailRequestParams("old@example.com", "旧氏名");

        service.sendAccountUpdate(newParams, oldParams);

        ArgumentCaptor<SendEmailRequest> captor = ArgumentCaptor.forClass(SendEmailRequest.class);
        verify(sesV2Client, times(1)).sendEmail(captor.capture());
        assertEquals(List.of("old@example.com"), captor.getValue().destination().toAddresses());
    }

    @Test
    @DisplayName("パスワード変更完了メールを正しい件名でSES経由送信する")
    void sendPasswordUpdate_sendsMailWithPasswordSubject() {
        AccountEmailRequestParams params = new AccountEmailRequestParams("user@example.com", "山田太郎");

        service.sendPasswordUpdate(params);

        ArgumentCaptor<SendEmailRequest> captor = ArgumentCaptor.forClass(SendEmailRequest.class);
        verify(sesV2Client, times(1)).sendEmail(captor.capture());
        SendEmailRequest sent = captor.getValue();
        assertEquals(List.of("user@example.com"), sent.destination().toAddresses());
        assertEquals(EmailUtils.PASSWORD_CHANGED_SUBJECT, sent.content().simple().subject().data());
    }

    @Test
    @DisplayName("SES送信に失敗しても例外を外部に伝播させない")
    void sendAccountCreate_whenSendFails_doesNotPropagateException() {
        AccountEmailRequestParams params = new AccountEmailRequestParams("user@example.com", "山田太郎");
        doThrow(software.amazon.awssdk.core.exception.SdkException.create("ses error", null))
            .when(sesV2Client).sendEmail(any(SendEmailRequest.class));

        assertDoesNotThrow(() -> service.sendAccountCreate(params));
        verify(sesV2Client, times(1)).sendEmail(any(SendEmailRequest.class));
    }
}
