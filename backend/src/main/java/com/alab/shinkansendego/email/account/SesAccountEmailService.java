package com.alab.shinkansendego.email.account;

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

@Service
@Profile("prod")
public class SesAccountEmailService implements AccountEmailService {
    private static final Logger log = LoggerFactory.getLogger(SesAccountEmailService.class);
    private final SesV2Client sesV2Client;
    @Value("${app.frontend.base-url}")
    private String baseUrl;
    @Value("${app.mail.from}")
    private String mailFrom;

    public SesAccountEmailService(@Value("${app.mail.region}") String region) {
        this.sesV2Client = SesV2Client.builder()
            .region(Region.of(region))
            .build();
    }

    @Async
    @Override
    public void sendAccountCreate(AccountEmailRequestParams params) {
        try {
            String loginUrl = baseUrl + EmailUtils.LOGIN_PATH;

            String body = String.format(
                EmailUtils.ACCOUNT_CREATED_BODY,
                params.getAccountName(),
                params.getAccountMail(),
                loginUrl
            );

            SendEmailRequest request = SendEmailRequest.builder()
                .fromEmailAddress(String.format("%s <%s>", EmailUtils.SENDER_NAME, mailFrom))
                .destination(Destination.builder().toAddresses(params.getAccountMail()).build())
                .content(EmailContent.builder()
                    .simple(msg -> msg
                        .subject(Content.builder().data(EmailUtils.ACCOUNT_CREATED_SUBJECT).charset("UTF-8").build())
                        .body(Body.builder().text(Content.builder().data(body).charset("UTF-8").build()).build())
                    )
                    .build()
                )
                .build();

            sesV2Client.sendEmail(request);
            log.info("アカウント作成完了メールを正常に送信しました。 To： {}", params.getAccountMail());
        } catch (Exception e) {
            log.error("アカウント作成完了メール送信中にエラーが発生しました。 To： {}", params.getAccountMail(), e);
        }
    }

    @Async
    @Override
    public void sendAccountUpdate(AccountEmailRequestParams newParams, AccountEmailRequestParams oldParams) {
        try {
            String loginUrl = baseUrl + EmailUtils.LOGIN_PATH;

            String body = String.format(
                EmailUtils.ACCOUNT_CHANGED_BODY,
                oldParams.getAccountName(),
                newParams.getAccountName(),
                newParams.getAccountMail(),
                loginUrl
            );

            SendEmailRequest request = SendEmailRequest.builder()
                .fromEmailAddress(String.format("%s <%s>", EmailUtils.SENDER_NAME, mailFrom))
                .destination(Destination.builder().toAddresses(oldParams.getAccountMail() == null ? newParams.getAccountMail() : oldParams.getAccountMail()).build())
                .content(EmailContent.builder()
                    .simple(msg -> msg
                        .subject(Content.builder().data(EmailUtils.ACCOUNT_CHANGED_SUBJECT).charset("UTF-8").build())
                        .body(Body.builder().text(Content.builder().data(body).charset("UTF-8").build()).build())
                    )
                    .build()
                )
                .build();

            sesV2Client.sendEmail(request);
            log.info("アカウント情報変更完了メールを正常に送信しました。 To： {}", newParams.getAccountMail());
        } catch (Exception e) {
            log.error("アカウント情報変更完了メール送信中にエラーが発生しました。 To： {}", newParams.getAccountMail(), e);
        }
    }

    @Async
    @Override
    public void sendPasswordUpdate(AccountEmailRequestParams params) {
        try {
            String loginUrl = baseUrl + EmailUtils.LOGIN_PATH;

            String body = String.format(
                EmailUtils.PASSWORD_CHANGED_BODY,
                params.getAccountName(),
                loginUrl
            );

            SendEmailRequest request = SendEmailRequest.builder()
                .fromEmailAddress(String.format("%s <%s>", EmailUtils.SENDER_NAME, mailFrom))
                .destination(Destination.builder().toAddresses(params.getAccountMail()).build())
                .content(EmailContent.builder()
                    .simple(msg -> msg
                        .subject(Content.builder().data(EmailUtils.PASSWORD_CHANGED_SUBJECT).charset("UTF-8").build())
                        .body(Body.builder().text(Content.builder().data(body).charset("UTF-8").build()).build())
                    )
                    .build()
                )
                .build();

            sesV2Client.sendEmail(request);
            log.info("パスワード変更完了メールを正常に送信しました。 To： {}", params.getAccountMail());
        } catch (Exception e) {
            log.error("パスワード変更完了メール送信中にエラーが発生しました。 To： {}", params.getAccountMail(), e);
        }
    }
}
