package com.alab.shinkansendego.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendReservationConfirmation(String toEmail, String reservationId) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("noreply@shinkansendego.com");
        message.setTo(toEmail);
        message.setSubject("[予約成立/支払完了] 予約が完了いたしました");

        String body = String.format("""
            ユーザーさま

            「新幹線でGO!」アプリでチケットのご予約が完了いたしました。
            以下に

            ==基本情報==
            乗車日：
            区間：東京　→　大宮

            ==列車情報==
            列車名：
            座席：

            ==金額情報==
            お支払い合計：

            【ログインURL】
            詳細はマイページよりご確認ください。

            """, reservationId);
        message.setText(body);

        mailSender.send(message);
    }
}
