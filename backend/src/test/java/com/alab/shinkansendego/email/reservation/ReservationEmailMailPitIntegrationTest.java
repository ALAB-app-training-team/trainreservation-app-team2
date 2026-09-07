package com.alab.shinkansendego.email.reservation;

import com.alab.shinkansendego.reservation.ReservationCreatedEvent;
import com.alab.shinkansendego.reservation.ReserveRequestDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.client.RestClient;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import static org.awaitility.Awaitility.await;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * ReservationEventListenerIntegrationTest はメール送信サービス自体をモックしているため、
 * 「実際にメールが送れたか」までは検証していない。
 * このテストではメール送信サービスをモックせず、本物のMailPit(SMTPサーバー)コンテナへ
 * 実際に送信し、MailPitのHTTP APIから受信メールの内容を確認することで、
 * 送信〜受信までを実際に検証する。
 *
 * 実行コストが最も高く外部プロセス(MailPit)に依存するため、まずは代表して
 * 予約作成メール1パターンのみを実装する。
 */
@ActiveProfiles("test")
@SpringBootTest
@Testcontainers
class ReservationEmailMailPitIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
        .withDatabaseName("test")
        .withUsername("user")
        .withPassword("pass");

    @Container
    static GenericContainer<?> mailpit = new GenericContainer<>("axllent/mailpit:latest")
        .withExposedPorts(1025, 8025);

    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        // このテストではFlywayによるスキーマ作成が必要なため、testプロファイルの無効化設定を上書きする
        registry.add("spring.flyway.enabled", () -> true);
        // JavaMailSenderの送信先を、実際に起動したMailPitコンテナへ向ける
        registry.add("spring.mail.host", mailpit::getHost);
        registry.add("spring.mail.port", () -> mailpit.getMappedPort(1025));
    }

    @Autowired
    private ApplicationEventPublisher eventPublisher;
    @Autowired
    private PlatformTransactionManager transactionManager;

    private RestClient mailpitApi;

    @BeforeEach
    void setUp() {
        mailpitApi = RestClient.create("http://" + mailpit.getHost() + ":" + mailpit.getMappedPort(8025));
        // 同一コンテナを使い回すため、前のテストの受信メールが残らないようにする
        mailpitApi.delete().uri("/api/v1/messages").retrieve().toBodilessEntity();
    }

    @Test
    @DisplayName("予約作成イベント発行後、実際にMailPitへ予約完了メールが届く")
    void handleReservationCreated_actuallyDeliversMailToMailPit() {
        String reserverMail = "integration-test@example.com";
        ReserveRequestDto request = new ReserveRequestDto(
            "SCHEDULE-NOT-EXIST", LocalDate.of(2026, 9, 10), "DEP-NOT-EXIST", "ARR-NOT-EXIST",
            "山田太郎", reserverMail, "payment-token",
            List.of(new ReserveRequestDto.SelectedSeatDto("0001", "普通車", "SEAT-NOT-EXIST", 5000))
        );
        UUID reservationId = UUID.randomUUID();

        new TransactionTemplate(transactionManager).executeWithoutResult(status ->
            eventPublisher.publishEvent(
                new ReservationCreatedEvent(reservationId, request, LocalTime.of(9, 0), LocalTime.of(10, 30))
            )
        );

        await().atMost(Duration.ofSeconds(10))
            .untilAsserted(() -> {
                String messages = mailpitApi.get().uri("/api/v1/messages").retrieve().body(String.class);
                assertTrue(messages.contains(reserverMail), "宛先が受信メール一覧に含まれること");
                assertTrue(messages.contains("予約完了"), "件名(予約完了)が受信メール一覧に含まれること");
            });
    }
}
