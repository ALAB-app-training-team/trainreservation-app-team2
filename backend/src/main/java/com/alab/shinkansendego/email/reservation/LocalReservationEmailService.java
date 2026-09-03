package com.alab.shinkansendego.email.reservation;

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
import static com.alab.shinkansendego.utils.EmailUtils.differenceFormatter;

@Service
@Profile({"local", "test"})
public class LocalReservationEmailService implements ReservationEmailService {
    private static final Logger log = LoggerFactory.getLogger(LocalReservationEmailService.class);
    private final JavaMailSender mailSender;
    @Value("${app.frontend.base-url}")
    private String baseUrl;

    @Autowired
    public LocalReservationEmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    @Override
    public void sendReservationConfirmation(ReservationEmailRequestParams dto) {
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

            String guestLoginUrl = baseUrl + EmailUtils.GUESTLOGIN_PATH + dto.getReservationId();
            String loginUrl = Boolean.TRUE.equals(dto.getIsGuest())
                ? guestLoginUrl
                : baseUrl + EmailUtils.LOGIN_PATH;

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
                loginUrl
            );

            helper.setText(body);
            mailSender.send(mimeMessage);
            log.info("予約完了メールを正常に送信しました。 To： {}", dto.getReserverMail());
        } catch (Exception e) {
            log.error("予約完了メール送信中にエラーが発生しました。 To： {}", dto.getReserverMail(), e);
        }
    }

    @Async
    @Override
    public void sendReservationChange(ReservationEmailRequestParams dto) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setFrom(EmailUtils.FROM_ADDRESS, EmailUtils.SENDER_NAME);
            helper.setTo(dto.getReserverMail());
            helper.setSubject(EmailUtils.CHANGE_SUBJECT);

            String formatterRideDate = "";
            if (dto.getRideDate() != null) {
                formatterRideDate = EmailUtils.rideDateFormatter(dto.getRideDate());
            }

            String seatDetail = "";
            if (dto.getSeats() != null && !dto.getSeats().isEmpty()) {
                seatDetail = EmailUtils.seatFormatter(dto.getSeats());
            }

            String loginUrl = baseUrl + EmailUtils.LOGIN_PATH;

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
                differenceFormatter(dto.getTotalAmount(), dto.getOldAmount()),
                loginUrl
            );

            helper.setText(body);
            mailSender.send(mimeMessage);
            log.info("予約変更完了メールを正常に送信しました。 To： {}", dto.getReserverMail());
        } catch (Exception e) {
            log.error("予約変更完了メール送信中にエラーが発生しました。 To： {}", dto.getReserverMail(), e);
        }
    }

    @Async
    @Override
    public void sendReservationCancel(ReservationEmailRequestParams dto) {
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

            String loginUrl = baseUrl + EmailUtils.LOGIN_PATH;

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
                loginUrl
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
    public void sendSetCompanion(ReservationEmailRequestParams dto) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setFrom(EmailUtils.FROM_ADDRESS, EmailUtils.SENDER_NAME);
            helper.setTo(dto.getReserverMail());
            helper.setSubject(EmailUtils.SET_SUBJECT);

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

            String ticketUrl = baseUrl + EmailUtils.TICKET_PATH + dto.getReservationId();

            String body = String.format(EmailUtils.SET_COMPANION_BODY,
                dto.getReserverName() != null ? dto.getReserverName() : "ユーザー",
                dto.getRepresentativeName(),
                formatterRideDate,
                dto.getDepartureStationName(),
                dto.getDepartureTime(),
                dto.getArrivalStationName(),
                dto.getArrivalTime(),
                dto.getTrainTypeName(),
                seatDetail,
                seatFare,
                ticketUrl
            );

            helper.setText(body);
            mailSender.send(mimeMessage);
            log.info("割り当て完了メールを正常に送信しました。 To： {}", dto.getReserverMail());
        } catch (Exception e) {
            log.error("割り当て完了メール送信中にエラーが発生しました。 To： {}", dto.getReserverMail(), e);
        }
    }

    @Async
    @Override
    public void sendReleaseCompanion(ReservationEmailRequestParams dto) {
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

            String body = String.format(EmailUtils.RELEASE_COMPANION_BODY,
                dto.getReserverName() != null ? dto.getReserverName() : "ユーザー",
                dto.getRepresentativeName(),
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
}

