package com.alab.shinkansendego.email.reservation;

import com.alab.shinkansendego.reservation.ReservationCreatedEvent;
import com.alab.shinkansendego.reservation.ReserveRequestDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import static org.awaitility.Awaitility.await;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

/**
 * ReservationEventListener はイベント発行後、トランザクションコミットを待ってから
 * (@TransactionalEventListener(AFTER_COMMIT)) 別スレッドで (@Async) メール送信を行う。
 * この非同期・コミット後実行という組み合わせが実機のSpringコンテキスト上で
 * 本当にテスト可能かを実証するための統合テスト。
 *
 * どのイベントがどのメール送信メソッドを呼ぶか、という分岐条件の網羅は
 * ReservationEventListenerTest (Mockitoによる単体テスト) 側の責務。
 * この仕組み自体はアノテーション駆動で全ハンドラに一律にかかるため、
 * ここでは代表して1つのハンドラについてのみ、コミット時に呼ばれること・
 * ロールバック時に呼ばれないことの2点を確認する。
 */
@ActiveProfiles("test")
@SpringBootTest
@Testcontainers
class ReservationEventListenerIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
        .withDatabaseName("test")
        .withUsername("user")
        .withPassword("pass");

    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        // このテストではFlywayによるスキーマ作成が必要なため、testプロファイルの無効化設定を上書きする
        registry.add("spring.flyway.enabled", () -> true);
    }

    @Autowired
    private ApplicationEventPublisher eventPublisher;
    @Autowired
    private PlatformTransactionManager transactionManager;
    @MockitoBean
    private ReservationEmailService reservationEmailService;

    private ReserveRequestDto createRequest(String reserverMail) {
        return new ReserveRequestDto(
            "SCHEDULE-NOT-EXIST", LocalDate.of(2026, 9, 10), "DEP-NOT-EXIST", "ARR-NOT-EXIST",
            "山田太郎", reserverMail, "payment-token",
            List.of(new ReserveRequestDto.SelectedSeatDto("0001", "普通車", "SEAT-NOT-EXIST", 5000))
        );
    }

    @Test
    @DisplayName("予約作成イベントのコミット後、非同期に予約完了メール送信が呼び出される")
    void handleReservationCreated_isInvokedAsynchronouslyAfterTransactionCommit() {
        ReserveRequestDto request = createRequest("user@example.com");

        new TransactionTemplate(transactionManager).executeWithoutResult(status ->
            eventPublisher.publishEvent(
                new ReservationCreatedEvent(UUID.randomUUID(), request, LocalTime.of(9, 0), LocalTime.of(10, 30))
            )
        );

        await().atMost(Duration.ofSeconds(5))
            .untilAsserted(() -> verify(reservationEmailService, times(1)).sendReservationConfirmation(any()));
    }

    @Test
    @DisplayName("トランザクションがロールバックされた場合は予約完了メール送信が呼び出されない")
    void handleReservationCreated_isNotInvoked_whenTransactionRolledBack() {
        ReserveRequestDto request = createRequest("user@example.com");

        new TransactionTemplate(transactionManager).executeWithoutResult(status -> {
            eventPublisher.publishEvent(
                new ReservationCreatedEvent(UUID.randomUUID(), request, LocalTime.of(9, 0), LocalTime.of(10, 30))
            );
            status.setRollbackOnly();
        });

        await().during(Duration.ofMillis(500)).atMost(Duration.ofSeconds(2))
            .untilAsserted(() -> verify(reservationEmailService, never()).sendReservationConfirmation(any()));
    }
}
