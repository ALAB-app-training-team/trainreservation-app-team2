package com.alab.shinkansendego.email.account;

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

import java.util.Properties;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LocalAccountEmailServiceTest {

    private static final String BASE_URL = "http://localhost:3000";

    @Mock
    private JavaMailSender mailSender;

    private LocalAccountEmailService service;

    @BeforeEach
    void setUp() {
        service = new LocalAccountEmailService(mailSender);
        ReflectionTestUtils.setField(service, "baseUrl", BASE_URL);
        when(mailSender.createMimeMessage()).thenReturn(new MimeMessage(Session.getDefaultInstance(new Properties())));
    }

    @Test
    @DisplayName("アカウント作成完了メールを正しい宛先・件名・本文で送信する")
    void sendAccountCreate_sendsMailToNewAccount() throws Exception {
        AccountEmailRequestParams params = new AccountEmailRequestParams("new@example.com", "山田太郎");

        service.sendAccountCreate(params);

        ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender, times(1)).send(captor.capture());
        MimeMessage sent = captor.getValue();
        assertEquals(EmailUtils.ACCOUNT_CREATED_SUBJECT, sent.getSubject());
        assertEquals("new@example.com", sent.getAllRecipients()[0].toString());
        String content = (String) sent.getContent();
        assertTrue(content.contains("山田太郎"));
        assertTrue(content.contains(BASE_URL + EmailUtils.LOGIN_PATH));
    }

    @Test
    @DisplayName("メールアドレス変更なしの場合は新アドレス宛にアカウント変更完了メールを送信する")
    void sendAccountUpdate_withoutMailChange_sendsMailToNewAddress() throws Exception {
        AccountEmailRequestParams newParams = new AccountEmailRequestParams("same@example.com", "新氏名");
        AccountEmailRequestParams oldParams = new AccountEmailRequestParams(null, "旧氏名");

        service.sendAccountUpdate(newParams, oldParams);

        ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender, times(1)).send(captor.capture());
        MimeMessage sent = captor.getValue();
        assertEquals(EmailUtils.ACCOUNT_CHANGED_SUBJECT, sent.getSubject());
        assertEquals("same@example.com", sent.getAllRecipients()[0].toString());
        String content = (String) sent.getContent();
        assertTrue(content.contains("旧氏名"));
        assertTrue(content.contains("新氏名"));
    }

    @Test
    @DisplayName("メールアドレス変更ありの場合は旧アドレス宛にアカウント変更完了メールを送信する")
    void sendAccountUpdate_withMailChange_sendsMailToOldAddress() throws Exception {
        AccountEmailRequestParams newParams = new AccountEmailRequestParams("new@example.com", "新氏名");
        AccountEmailRequestParams oldParams = new AccountEmailRequestParams("old@example.com", "旧氏名");

        service.sendAccountUpdate(newParams, oldParams);

        ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender, times(1)).send(captor.capture());
        MimeMessage sent = captor.getValue();
        assertEquals("old@example.com", sent.getAllRecipients()[0].toString());
    }

    @Test
    @DisplayName("パスワード変更完了メールを正しい件名で送信する")
    void sendPasswordUpdate_sendsMailWithPasswordSubject() throws Exception {
        AccountEmailRequestParams params = new AccountEmailRequestParams("user@example.com", "山田太郎");

        service.sendPasswordUpdate(params);

        ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender, times(1)).send(captor.capture());
        MimeMessage sent = captor.getValue();
        assertEquals(EmailUtils.PASSWORD_CHANGED_SUBJECT, sent.getSubject());
        assertEquals("user@example.com", sent.getAllRecipients()[0].toString());
    }

    @Test
    @DisplayName("メール送信に失敗しても例外を外部に伝播させない")
    void sendAccountCreate_whenSendFails_doesNotPropagateException() {
        AccountEmailRequestParams params = new AccountEmailRequestParams("user@example.com", "山田太郎");
        doThrow(new MailSendException("smtp error")).when(mailSender).send(any(MimeMessage.class));

        assertDoesNotThrow(() -> service.sendAccountCreate(params));
        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }
}
