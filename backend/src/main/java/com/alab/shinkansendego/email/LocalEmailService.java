package com.alab.shinkansendego.email;

import com.alab.shinkansendego.utils.EmailUtils;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@Service
@Profile({"local", "test"})
public class LocalEmailService implements EmailService {
    private static final Logger log = LoggerFactory.getLogger(LocalEmailService.class);
    private final JavaMailSender mailSender;
    @Value("${app.frontend.base-url}")
    private String baseUrl;

    @Autowired
    public LocalEmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    @Override
    public void sendReservationConfirmation(EmailRequestDto dto) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setFrom("thashimoto@jeisryokai.onmicrosoft.com", EmailUtils.SENDER_NAME);
            helper.setTo(dto.getReserverMail());
            helper.setSubject(EmailUtils.SUBJECT);

            String formatterRideDate = "";
            if (dto.getRideDate() != null) {
                formatterRideDate = dto.getRideDate().format(DateTimeFormatter.ofPattern("yyyy年MM月dd日"));
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

            String loginurl = baseUrl + EmailUtils.LOGIN_PATH;

            String body = String.format(
                EmailUtils.RESERVATION_CONFIRMATION_BODY,
                dto.getReserverName() != null ? dto.getReserverName() : "ユーザー",
                dto.getReservationId(),
                formatterRideDate,
                dto.getDepartureStationName(),
                dto.getDepartureTime(),
                dto.getArrivalStationName(),
                dto.getArrivalTime(),
                dto.getTrainTypeName(),
                seatDetail,
                dto.getTotalAmount(),
                loginurl
            );

            helper.setText(body);
            mailSender.send(mimeMessage);
            log.info("予約完了メールを正常に送信しました。 To： {}", dto.getReserverMail());
        } catch (Exception e) {
            log.error("メール送信中にエラーが発生しました。 To： {}", dto.getReserverMail(), e);
        }
    }
}

