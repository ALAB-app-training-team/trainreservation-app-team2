package com.alab.shinkansendego.email.account;

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

@Service
@Profile({"local", "test"})
public class LocalAccountEmailService implements AccountEmailService {
    private static final Logger log = LoggerFactory.getLogger(LocalAccountEmailService.class);
    private final JavaMailSender mailSender;
    @Value("${app.frontend.base-url}")
    private String baseUrl;

    @Autowired
    public LocalAccountEmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    @Override
    public void sendAccountCreate(AccountEmailRequestParams params) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setFrom(EmailUtils.FROM_ADDRESS, EmailUtils.SENDER_NAME);
            helper.setTo(params.getAccountMail());
            helper.setSubject(EmailUtils.ACCOUNT_CREATED_SUBJECT);

            String loginUrl = baseUrl + EmailUtils.LOGIN_PATH;

            String body = String.format(
                EmailUtils.ACCOUNT_CREATED_BODY,
                params.getAccountName(),
                params.getAccountMail(),
                loginUrl
            );

            helper.setText(body);
            mailSender.send(mimeMessage);
            log.info("アカウント作成完了メールを正常に送信しました。 To： {}", params.getAccountMail());
        } catch (Exception e) {
            log.error("アカウント作成完了メール送信中にエラーが発生しました。 To： {}", params.getAccountMail(), e);
        }
    }

    @Async
    @Override
    public void sendAccountChange(AccountEmailRequestParams params) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setFrom(EmailUtils.FROM_ADDRESS, EmailUtils.SENDER_NAME);
            helper.setTo(params.getAccountMail());
            helper.setSubject(EmailUtils.ACCOUNT_CHANGED_SUBJECT);

            String loginUrl = baseUrl + EmailUtils.LOGIN_PATH;

            String body = String.format(
                EmailUtils.ACCOUNT_CHANGED_BODY,
                params.getAccountName(),
                params.getAccountName(),
                params.getAccountMail(),
                loginUrl
            );

            helper.setText(body);
            mailSender.send(mimeMessage);
            log.info("アカウント情報変更完了メールを正常に送信しました。 To： {}", params.getAccountMail());
        } catch (Exception e) {
            log.error("アカウント情報変更完了メール送信中にエラーが発生しました。 To： {}", params.getAccountMail(), e);
        }
    }

    @Async
    @Override
    public void sendPasswordChange(AccountEmailRequestParams params) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setFrom(EmailUtils.FROM_ADDRESS, EmailUtils.SENDER_NAME);
            helper.setTo(params.getAccountMail());
            helper.setSubject(EmailUtils.PASSWORD_CHANGED_SUBJECT);

            String loginUrl = baseUrl + EmailUtils.LOGIN_PATH;

            String body = String.format(
                EmailUtils.PASSWORD_CHANGED_BODY,
                params.getAccountName(),
                loginUrl
            );

            helper.setText(body);
            mailSender.send(mimeMessage);
            log.info("パスワード変更完了メールを正常に送信しました。 To： {}", params.getAccountMail());
        } catch (Exception e) {
            log.error("パスワード変更完了メール送信中にエラーが発生しました。 To： {}", params.getAccountMail(), e);
        }
    }
}

