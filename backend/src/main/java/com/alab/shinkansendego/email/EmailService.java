package com.alab.shinkansendego.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    @Value("${app.frontend.base-url}")
    private String baseurl;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendReservationConfirmation(EmailRequestDto dto) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("noreply@shinkansendego.com");
        message.setTo(dto.getReserverMail());
        message.setSubject("[予約完了] 予約内容のご案内");

        String formatterRidedate = "";
        if (dto.getRideDate() != null) {
            formatterRidedate = dto.getRideDate().format(DateTimeFormatter.ofPattern("yyyy年MM月dd日"));
        }

        String seatDetail = "";
        if (dto.getSeats() != null && !dto.getSeats().isEmpty()) {
            seatDetail = dto.getSeats().stream()
                .map(seat -> {
                    String rawCarCd = seat.getTrainCarCd();
                    String carNum = "";
                    if (rawCarCd != null && rawCarCd.length() >= 2) {
                        carNum = rawCarCd.substring(rawCarCd.length() - 2).replaceFirst("^0+", "");
                    }

                    return String.format("%s号車 %s",
                        carNum,
                        seat.getSeatCd());
                })
                .collect(Collectors.joining("\n"));
        }

        String loginurl = baseurl + "/login";

        String body = String.format("""
                %s さま

                「新幹線でGO!」アプリでチケットのご予約が完了いたしました。
                以下に予約詳細をお知らせいたします。

                ■予約詳細
                予約ID：%s
                乗車日：%s
                区間：%s（%s発）　→　%s（%s着）
                列車名：%s
                座席：%s
                お支払い合計：%,d 円

                ■アプリログインURL
                %s

                またのご利用をお待ちしております。
                """,
            dto.getReserverName() != null ? dto.getReserverName() : "ユーザー",
            dto.getReservationId(),
            formatterRidedate,
            dto.getDepartureStationName(),
            dto.getDepartureTime(),
            dto.getArrivalStationName(),
            dto.getArrivalTime(),
            dto.getTrainTypeName(),
            seatDetail,
            dto.getTotalAmount(),
            loginurl
        );
        message.setText(body);
        mailSender.send(message);
    }
}
