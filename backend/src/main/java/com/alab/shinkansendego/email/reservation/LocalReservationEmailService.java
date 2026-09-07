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
    public void sendReservationConfirmation(ReservationEmailRequestParams params) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setFrom(EmailUtils.FROM_ADDRESS, EmailUtils.SENDER_NAME);
            helper.setTo(params.getReserverMail());
            helper.setSubject(EmailUtils.SUBJECT);

            String formatterRideDate = "";
            if (params.getRideDate() != null) {
                formatterRideDate = EmailUtils.rideDateFormatter(params.getRideDate());
            }

            String seatDetail = "";
            if (params.getSeats() != null && !params.getSeats().isEmpty()) {
                seatDetail = EmailUtils.seatFormatter(params.getSeats());
            }

            String guestLoginUrl = baseUrl + EmailUtils.GUESTLOGIN_PATH + params.getReservationId();
            String loginUrl = Boolean.TRUE.equals(params.getIsGuest())
                ? guestLoginUrl
                : baseUrl + EmailUtils.LOGIN_PATH;

            String body = String.format(
                EmailUtils.CONFIRMATION_BODY,
                params.getReserverName() != null ? params.getReserverName() : "ユーザー",
                params.getReservationId(),
                formatterRideDate,
                params.getDepartureStationName(),
                params.getDepartureTime(),
                params.getArrivalStationName(),
                params.getArrivalTime(),
                params.getTrainTypeName(),
                seatDetail,
                params.getTotalAmount(),
                loginUrl
            );

            helper.setText(body);
            mailSender.send(mimeMessage);
            log.info("予約完了メールを正常に送信しました。 To： {}", params.getReserverMail());
        } catch (Exception e) {
            log.error("予約完了メール送信中にエラーが発生しました。 To： {}", params.getReserverMail(), e);
        }
    }

    @Async
    @Override
    public void sendReservationChange(ReservationEmailRequestParams params) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setFrom(EmailUtils.FROM_ADDRESS, EmailUtils.SENDER_NAME);
            helper.setTo(params.getReserverMail());
            helper.setSubject(EmailUtils.CHANGE_SUBJECT);

            String formatterRideDate = "";
            if (params.getRideDate() != null) {
                formatterRideDate = EmailUtils.rideDateFormatter(params.getRideDate());
            }

            String seatDetail = "";
            if (params.getSeats() != null && !params.getSeats().isEmpty()) {
                seatDetail = EmailUtils.seatFormatter(params.getSeats());
            }

            String guestLoginUrl = baseUrl + EmailUtils.GUESTLOGIN_PATH + params.getReservationId();
            String loginUrl = Boolean.TRUE.equals(params.getIsGuest())
                ? guestLoginUrl
                : baseUrl + EmailUtils.LOGIN_PATH;

            String body = String.format(
                EmailUtils.CHANGE_BODY,
                params.getReserverName() != null ? params.getReserverName() : "ユーザー",
                params.getReservationId(),
                formatterRideDate,
                params.getDepartureStationName(),
                params.getDepartureTime(),
                params.getArrivalStationName(),
                params.getArrivalTime(),
                params.getTrainTypeName(),
                seatDetail,
                differenceFormatter(params.getTotalAmount(), params.getOldAmount()),
                loginUrl
            );

            helper.setText(body);
            mailSender.send(mimeMessage);
            log.info("予約変更完了メールを正常に送信しました。 To： {}", params.getReserverMail());
        } catch (Exception e) {
            log.error("予約変更完了メール送信中にエラーが発生しました。 To： {}", params.getReserverMail(), e);
        }
    }

    @Async
    @Override
    public void sendReservationCancel(ReservationEmailRequestParams params) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setFrom(EmailUtils.FROM_ADDRESS, EmailUtils.SENDER_NAME);
            helper.setTo(params.getReserverMail());
            helper.setSubject(EmailUtils.CANCEL_SUBJECT);

            String formatterRideDate = "";
            if (params.getRideDate() != null) {
                formatterRideDate = EmailUtils.rideDateFormatter(params.getRideDate());
            }

            String seatDetail = "";
            Integer refund = 0;
            if (params.getSeats() != null && !params.getSeats().isEmpty()) {
                seatDetail = EmailUtils.seatFormatter(params.getSeats());
                refund = params.getSeats().size() * REFUND_FEE;
            }

            Integer total = params.getTotalAmount() - refund;

            String guestLoginUrl = baseUrl + EmailUtils.GUESTLOGIN_PATH + params.getReservationId();
            String loginUrl = Boolean.TRUE.equals(params.getIsGuest())
                ? guestLoginUrl
                : baseUrl + EmailUtils.LOGIN_PATH;

            String body = String.format(EmailUtils.CANCEL_BODY,
                params.getReserverName() != null ? params.getReserverName() : "ユーザー",
                params.getReservationId(),
                formatterRideDate,
                params.getDepartureStationName(),
                params.getDepartureTime(),
                params.getArrivalStationName(),
                params.getArrivalTime(),
                params.getTrainTypeName(),
                seatDetail,
                refund,
                total,
                loginUrl
            );

            helper.setText(body);
            mailSender.send(mimeMessage);
            log.info("予約キャンセルメールを正常に送信しました。 To： {}", params.getReserverMail());
        } catch (Exception e) {
            log.error("予約キャンセルメール送信中にエラーが発生しました。 To： {}", params.getReserverMail(), e);
        }
    }

    @Async
    @Override
    public void sendSetCompanion(ReservationEmailRequestParams params) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setFrom(EmailUtils.FROM_ADDRESS, EmailUtils.SENDER_NAME);
            helper.setTo(params.getReserverMail());
            helper.setSubject(EmailUtils.SET_SUBJECT);

            String formatterRideDate = "";
            if (params.getRideDate() != null) {
                formatterRideDate = EmailUtils.rideDateFormatter(params.getRideDate());
            }

            String seatDetail = "";
            Integer seatFare = 0;
            if (params.getSeats() != null && params.getSeats().size() == 1) {
                seatDetail = EmailUtils.seatFormatter(params.getSeats());
                seatFare = params.getSeats().getFirst().getSeatFare();
            }

            String ticketUrl = baseUrl + EmailUtils.GUESTLOGIN_PATH + params.getReservationId();

            String body = String.format(EmailUtils.SET_COMPANION_BODY,
                params.getReserverName() != null ? params.getReserverName() : "ユーザー",
                params.getRepresentativeName(),
                formatterRideDate,
                params.getDepartureStationName(),
                params.getDepartureTime(),
                params.getArrivalStationName(),
                params.getArrivalTime(),
                params.getTrainTypeName(),
                seatDetail,
                seatFare,
                ticketUrl
            );

            helper.setText(body);
            mailSender.send(mimeMessage);
            log.info("割り当て完了メールを正常に送信しました。 To： {}", params.getReserverMail());
        } catch (Exception e) {
            log.error("割り当て完了メール送信中にエラーが発生しました。 To： {}", params.getReserverMail(), e);
        }
    }

    @Async
    @Override
    public void sendReleaseCompanion(ReservationEmailRequestParams params) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setFrom(EmailUtils.FROM_ADDRESS, EmailUtils.SENDER_NAME);
            helper.setTo(params.getReserverMail());
            helper.setSubject(EmailUtils.RELEASE_SUBJECT);

            String formatterRideDate = "";
            if (params.getRideDate() != null) {
                formatterRideDate = EmailUtils.rideDateFormatter(params.getRideDate());
            }

            String seatDetail = "";
            Integer seatFare = 0;
            if (params.getSeats() != null && params.getSeats().size() == 1) {
                seatDetail = EmailUtils.seatFormatter(params.getSeats());
                seatFare = params.getSeats().getFirst().getSeatFare();
            }

            String body = String.format(EmailUtils.RELEASE_COMPANION_BODY,
                params.getReserverName() != null ? params.getReserverName() : "ユーザー",
                params.getRepresentativeName(),
                formatterRideDate,
                params.getDepartureStationName(),
                params.getDepartureTime(),
                params.getArrivalStationName(),
                params.getArrivalTime(),
                params.getTrainTypeName(),
                seatDetail,
                seatFare
            );

            helper.setText(body);
            mailSender.send(mimeMessage);
            log.info("割り当て解除メールを正常に送信しました。 To： {}", params.getReserverMail());
        } catch (Exception e) {
            log.error("割り当て解除メール送信中にエラーが発生しました。 To： {}", params.getReserverMail(), e);
        }
    }
}

