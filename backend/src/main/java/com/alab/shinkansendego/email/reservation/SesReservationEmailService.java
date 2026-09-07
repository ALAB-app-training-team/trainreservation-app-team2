package com.alab.shinkansendego.email.reservation;

import com.alab.shinkansendego.utils.EmailUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sesv2.SesV2Client;
import software.amazon.awssdk.services.sesv2.model.Body;
import software.amazon.awssdk.services.sesv2.model.Content;
import software.amazon.awssdk.services.sesv2.model.Destination;
import software.amazon.awssdk.services.sesv2.model.EmailContent;
import software.amazon.awssdk.services.sesv2.model.SendEmailRequest;

import static com.alab.shinkansendego.utils.EmailUtils.REFUND_FEE;
import static com.alab.shinkansendego.utils.EmailUtils.differenceFormatter;

@Service
@Profile("prod")
public class SesReservationEmailService implements ReservationEmailService {
    private static final Logger log = LoggerFactory.getLogger(SesReservationEmailService.class);
    private final SesV2Client sesV2Client;
    @Value("${app.frontend.base-url}")
    private String baseUrl;
    @Value("${app.mail.from}")
    private String mailFrom;

    public SesReservationEmailService(@Value("${app.mail.region}") String region) {
        this.sesV2Client = SesV2Client.builder()
            .region(Region.of(region))
            .build();
    }

    @Async
    @Override
    public void sendReservationConfirmation(ReservationEmailRequestParams params) {
        try {
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

            SendEmailRequest request = SendEmailRequest.builder()
                .fromEmailAddress(String.format("%s <%s>", EmailUtils.SENDER_NAME, mailFrom))
                .destination(Destination.builder().toAddresses(params.getReserverMail()).build())
                .content(EmailContent.builder()
                    .simple(msg -> msg
                        .subject(Content.builder().data(EmailUtils.SUBJECT).charset("UTF-8").build())
                        .body(Body.builder().text(Content.builder().data(body).charset("UTF-8").build()).build())
                    )
                    .build()
                )
                .build();

            sesV2Client.sendEmail(request);
            log.info("予約完了メールを正常に送信しました。 To： {}", params.getReserverMail());
        } catch (Exception e) {
            log.error("予約完了メール送信中にエラーが発生しました。 To： {}", params.getReserverMail(), e);
        }
    }

    @Async
    @Override
    public void sendReservationChange(ReservationEmailRequestParams params) {
        try {
            String formatterRideDate = "";
            if (params.getRideDate() != null) {
                formatterRideDate = EmailUtils.rideDateFormatter(params.getRideDate());
            }

            String seatDetail = "";
            if (params.getSeats() != null && !params.getSeats().isEmpty()) {
                seatDetail = EmailUtils.seatFormatter(params.getSeats());
            }

            String loginUrl = baseUrl + EmailUtils.LOGIN_PATH;

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

            SendEmailRequest request = SendEmailRequest.builder()
                .fromEmailAddress(String.format("%s <%s>", EmailUtils.SENDER_NAME, mailFrom))
                .destination(Destination.builder().toAddresses(params.getReserverMail()).build())
                .content(EmailContent.builder()
                    .simple(msg -> msg
                        .subject(Content.builder().data(EmailUtils.CHANGE_SUBJECT).charset("UTF-8").build())
                        .body(Body.builder().text(Content.builder().data(body).charset("UTF-8").build()).build())
                    )
                    .build()
                )
                .build();

            sesV2Client.sendEmail(request);
            log.info("予約変更完了メールを正常に送信しました。 To： {}", params.getReserverMail());
        } catch (Exception e) {
            log.error("予約変更完了メール送信中にエラーが発生しました。 To： {}", params.getReserverMail(), e);
        }
    }

    @Async
    @Override
    public void sendReservationCancel(ReservationEmailRequestParams params) {
        try {
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

            String loginUrl = baseUrl + EmailUtils.LOGIN_PATH;

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

            SendEmailRequest request = SendEmailRequest.builder()
                .fromEmailAddress(String.format("%s <%s>", EmailUtils.SENDER_NAME, mailFrom))
                .destination(Destination.builder().toAddresses(params.getReserverMail()).build())
                .content(EmailContent.builder()
                    .simple(msg -> msg
                        .subject(Content.builder().data(EmailUtils.CANCEL_SUBJECT).charset("UTF-8").build())
                        .body(Body.builder().text(Content.builder().data(body).charset("UTF-8").build()).build())
                    )
                    .build()
                )
                .build();

            sesV2Client.sendEmail(request);
            log.info("予約キャンセルメールを正常に送信しました。 To： {}", params.getReserverMail());
        } catch (Exception e) {
            log.error("予約キャンセルメール送信中にエラーが発生しました。 To： {}", params.getReserverMail(), e);
        }
    }

    @Async
    @Override
    public void sendSetCompanion(ReservationEmailRequestParams params) {
        try {
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

            String ticketUrl = baseUrl + EmailUtils.TICKET_PATH + params.getReservationId();

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

            SendEmailRequest request = SendEmailRequest.builder()
                .fromEmailAddress(String.format("%s <%s>", EmailUtils.SENDER_NAME, mailFrom))
                .destination(Destination.builder().toAddresses(params.getReserverMail()).build())
                .content(EmailContent.builder()
                    .simple(msg -> msg
                        .subject(Content.builder().data(EmailUtils.SET_SUBJECT).charset("UTF-8").build())
                        .body(Body.builder().text(Content.builder().data(body).charset("UTF-8").build()).build())
                    )
                    .build()
                )
                .build();

            sesV2Client.sendEmail(request);
            log.info("割り当て完了メールを正常に送信しました。 To： {}", params.getReserverMail());
        } catch (Exception e) {
            log.error("割り当て完了メール送信中にエラーが発生しました。 To： {}", params.getReserverMail(), e);
        }
    }

    @Async
    @Override
    public void sendReleaseCompanion(ReservationEmailRequestParams params) {
        try {
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

            SendEmailRequest request = SendEmailRequest.builder()
                .fromEmailAddress(String.format("%s <%s>", EmailUtils.SENDER_NAME, mailFrom))
                .destination(Destination.builder().toAddresses(params.getReserverMail()).build())
                .content(EmailContent.builder()
                    .simple(msg -> msg
                        .subject(Content.builder().data(EmailUtils.RELEASE_SUBJECT).charset("UTF-8").build())
                        .body(Body.builder().text(Content.builder().data(body).charset("UTF-8").build()).build())
                    )
                    .build()
                )
                .build();

            sesV2Client.sendEmail(request);
            log.info("割り当て解除メールを正常に送信しました。 To： {}", params.getReserverMail());
        } catch (Exception e) {
            log.error("割り当て解除メール送信中にエラーが発生しました。 To： {}", params.getReserverMail(), e);
        }
    }
}
