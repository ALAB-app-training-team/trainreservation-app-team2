package com.alab.shinkansendego.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendReservationConfirmation(EmailRequestDto dto) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("noreply@shinkansendego.com");
        message.setTo(dto.getReserverMail());
        message.setSubject("[予約完了/支払完了] 予約が完了いたしました");

        String seatDetail = "";
        if (dto.getSeats() != null && !dto.getSeats().isEmpty()) {
            seatDetail = dto.getSeats().stream()
                .map(seat -> String.format("・%s号車 %s番 (%s)",
                    seat.getTrainCarCd(),
                    seat.getSeatCd(),
                    seat.getTrainCarTypeCd()))
                .collect(Collectors.joining("\n"));
        }

        String body = String.format("""
                %s さま

                「新幹線でGO!」アプリでチケットのご予約が完了いたしました。
                以下に予約詳細をお知らせいたします。

                ==基本情報==
                予約ID：%s
                乗車日：%s
                区間：%s （%s発）　→　%s　（%s着）

                ==列車情報==
                列車名：%s
                座席：%s

                ==金額情報==
                お支払い合計：%d 円

                【ログインURL】
                詳細はマイページよりご確認ください。

                """,
            dto.getReserverName(),
            dto.getReservationId(),
            dto.getTrainTypeName(),
            dto.getRideDate(),
            dto.getDepartureStationName(),
            dto.getDepartureTime(),
            dto.getArrivalStationName(),
            dto.getArrivalTime(),
            seatDetail,
            dto.getTotalAmount()
        );
        message.setText(body);
        mailSender.send(message);
    }
}
