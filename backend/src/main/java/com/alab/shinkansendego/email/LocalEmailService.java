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

import static com.alab.shinkansendego.utils.EmailUtils.REFUND_FEE;

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

            helper.setFrom(EmailUtils.FROM_ADDRESS, EmailUtils.SENDER_NAME);
            helper.setTo(dto.getReserverMail());
            helper.setSubject(EmailUtils.SUBJECT);

            String formatterRideDate = "";
            if (dto.getRideDate() != null) {
                formatterRideDate = EmailUtils.rideDateFormatter(dto.getRideDate());
            }

            String seatDetail = "";
            if (dto.getSeats() != null && !dto.getSeats().isEmpty()) {
                seatDetail = EmailUtils.seatFormatter(dto.getSeats());
            }

            String loginurl = baseUrl + EmailUtils.LOGIN_PATH;

            String body = String.format(
                EmailUtils.CONFIRMATION_BODY,
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

    @Async
    @Override
    public void sendReservationCancel(EmailRequestDto dto) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setFrom(EmailUtils.FROM_ADDRESS, EmailUtils.SENDER_NAME);
            helper.setTo(dto.getReserverMail());
            helper.setSubject(EmailUtils.CANCEL_SUBJECT);

            String formatterRideDate = "";
            if (dto.getRideDate() != null) {
                formatterRideDate = EmailUtils.rideDateFormatter(dto.getRideDate());
            }

            String seatDetail = "";
            Integer refund = 0;
            if (dto.getSeats() != null && !dto.getSeats().isEmpty()) {
                seatDetail = EmailUtils.seatFormatter(dto.getSeats());
                refund = dto.getSeats().size() * REFUND_FEE;
            }

            Integer total = dto.getTotalAmount() - refund;

            String loginurl = baseUrl + EmailUtils.LOGIN_PATH;

            String body = String.format(EmailUtils.CANCEL_BODY,
                dto.getReserverName() != null ? dto.getReserverName() : "ユーザー",
                dto.getReservationId(),
                formatterRideDate,
                dto.getDepartureStationName(),
                dto.getDepartureTime(),
                dto.getArrivalStationName(),
                dto.getArrivalTime(),
                dto.getTrainTypeName(),
                seatDetail,
                refund,
                total,
                loginurl
            );

            helper.setText(body);
            mailSender.send(mimeMessage);
            log.info("予約キャンセルメールを正常に送信しました。 To： {}", dto.getReserverMail());
        } catch (Exception e) {
            log.error("予約キャンセルメール送信中にエラーが発生しました。 To： {}", dto.getReserverMail(), e);
        }
    }

    @Async
    @Override
    public void sendReleaseCompanion(EmailRequestDto dto) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setFrom(EmailUtils.FROM_ADDRESS, EmailUtils.SENDER_NAME);
            helper.setTo(dto.getReserverMail());
            helper.setSubject(EmailUtils.RELEASE_SUBJECT);

            String formatterRideDate = "";
            if (dto.getRideDate() != null) {
                formatterRideDate = EmailUtils.rideDateFormatter(dto.getRideDate());
            }

            String seatDetail = "";
            Integer seatFare = 0;
            if (dto.getSeats() != null && dto.getSeats().size() == 1) {
                seatDetail = EmailUtils.seatFormatter(dto.getSeats());
                seatFare = dto.getSeats().getFirst().getSeatFare();
            }

            String body = String.format(EmailUtils.RELEASE_BODY,
                dto.getReserverName() != null ? dto.getReserverName() : "ユーザー",
                formatterRideDate,
                dto.getDepartureStationName(),
                dto.getDepartureTime(),
                dto.getArrivalStationName(),
                dto.getArrivalTime(),
                dto.getTrainTypeName(),
                seatDetail,
                seatFare
            );

            helper.setText(body);
            mailSender.send(mimeMessage);
            log.info("割り当て解除メールを正常に送信しました。 To： {}", dto.getReserverMail());
        } catch (Exception e) {
            log.error("割り当て解除メール送信中にエラーが発生しました。 To： {}", dto.getReserverMail(), e);
        }
    }

    @Async
    @Override
    public void sendReservationChange(EmailRequestDto dto) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setFrom(EmailUtils.FROM_ADDRESS, EmailUtils.SENDER_NAME);
            helper.setTo(dto.getReserverMail());
            helper.setSubject(EmailUtils.RESERVATION_CHANGE_SUBJECT);

            String formatterRideDate = "";
            if (dto.getRideDate() != null) {
                formatterRideDate = EmailUtils.rideDateFormatter(dto.getRideDate());
            }

            String seatDetail = "";
            if (dto.getSeats() != null && !dto.getSeats().isEmpty()) {
                seatDetail = EmailUtils.seatFormatter(dto.getSeats());
            }

            String loginurl = baseUrl + EmailUtils.LOGIN_PATH;

            String body = String.format(
                EmailUtils.CHANGE_BODY,
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
            log.info("予約変更完了メールを正常に送信しました。 To： {}", dto.getReserverMail());
        } catch (Exception e) {
            log.error("予約変更完了メール送信中にエラーが発生しました。 To： {}", dto.getReserverMail(), e);
        }
    }
}

