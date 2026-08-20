package com.alab.shinkansendego.email;

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

@Service
@Profile("prod")
public class SesEmailService implements EmailService {
    private static final Logger log = LoggerFactory.getLogger(SesEmailService.class);
    private final SesV2Client sesV2Client;
    @Value("${app.frontend.base-url}")
    private String baseUrl;
    @Value("${app.mail.from}")
    private String mailFrom;

    public SesEmailService(@Value("${app.mail.region}") String region) {
        this.sesV2Client = SesV2Client.builder()
            .region(Region.of(region))
            .build();
    }

    @Async
    @Override
    public void sendReservationConfirmation(EmailRequestDto dto) {
        try {
            String formatterRideDate = "";
            if (dto.getRideDate() != null) {
                formatterRideDate = EmailUtils.rideDateFormatter(dto.getRideDate());
            }

            String seatDetail = "";
            if (dto.getSeats() != null && !dto.getSeats().isEmpty()) {
                seatDetail = EmailUtils.seatFormatter(dto.getSeats());
            }

            String loginurl = baseUrl + EmailUtils.LOGIN_PATH;

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

            SendEmailRequest request = SendEmailRequest.builder()
                .fromEmailAddress(String.format("%s <%s>", EmailUtils.SENDER_NAME, mailFrom))
                .destination(Destination.builder().toAddresses(dto.getReserverMail()).build())
                .content(EmailContent.builder()
                    .simple(msg -> msg
                        .subject(Content.builder().data(EmailUtils.SUBJECT).charset("UTF-8").build())
                        .body(Body.builder().text(Content.builder().data(body).charset("UTF-8").build()).build())
                    )
                    .build()
                )
                .build();

            sesV2Client.sendEmail(request);
            log.info("予約完了メールを正常に送信しました。 To： {}", dto.getReserverMail());
        } catch (Exception e) {
            log.error("メール送信中にエラーが発生しました。 To： {}", dto.getReserverMail(), e);
        }
    }

    @Async
    @Override
    public void sendReservationCancel(EmailRequestDto dto) {
        try {
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

            SendEmailRequest request = SendEmailRequest.builder()
                .fromEmailAddress(String.format("%s <%s>", EmailUtils.SENDER_NAME, mailFrom))
                .destination(Destination.builder().toAddresses(dto.getReserverMail()).build())
                .content(EmailContent.builder()
                    .simple(msg -> msg
                        .subject(Content.builder().data(EmailUtils.CANCEL_SUBJECT).charset("UTF-8").build())
                        .body(Body.builder().text(Content.builder().data(body).charset("UTF-8").build()).build())
                    )
                    .build()
                )
                .build();

            sesV2Client.sendEmail(request);
            log.info("予約キャンセルメールを正常に送信しました。 To： {}", dto.getReserverMail());
        } catch (Exception e) {
            log.error("予約キャンセルメール送信中にエラーが発生しました。 To： {}", dto.getReserverMail(), e);
        }
    }

    @Async
    @Override
    public void sendReleaseCompanion(EmailRequestDto dto) {
        try {
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

            SendEmailRequest request = SendEmailRequest.builder()
                .fromEmailAddress(String.format("%s <%s>", EmailUtils.SENDER_NAME, mailFrom))
                .destination(Destination.builder().toAddresses(dto.getReserverMail()).build())
                .content(EmailContent.builder()
                    .simple(msg -> msg
                        .subject(Content.builder().data(EmailUtils.RELEASE_SUBJECT).charset("UTF-8").build())
                        .body(Body.builder().text(Content.builder().data(body).charset("UTF-8").build()).build())
                    )
                    .build()
                )
                .build();

            sesV2Client.sendEmail(request);
            log.info("割り当て解除メールを正常に送信しました。 To： {}", dto.getReserverMail());
        } catch (Exception e) {
            log.error("割り当て解除メール送信中にエラーが発生しました。 To： {}", dto.getReserverMail(), e);
        }
    }
}

