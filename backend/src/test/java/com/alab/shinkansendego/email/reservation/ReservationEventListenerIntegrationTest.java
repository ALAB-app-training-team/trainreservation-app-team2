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
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

/**
 * ReservationEventListener はイベント発行後、トランザクションコミットを待ってから
 * (@TransactionalEventListener(AFTER_COMMIT)) 別スレッドで (@Async) メール送信を行う。
 * この非同期・コミット後実行という組み合わせが実機のSpringコンテキスト上で
 * 本当にテスト可能かを実証するための統合テスト。
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

    @Test
    @DisplayName("イベント発行トランザクションのコミット後、非同期に予約完了メール送信が呼び出される")
    void handleReservationCreated_isInvokedAsynchronouslyAfterTransactionCommit() {
        ReserveRequestDto request = new ReserveRequestDto(
            "SCHEDULE-NOT-EXIST", LocalDate.of(2026, 9, 10), "DEP-NOT-EXIST", "ARR-NOT-EXIST",
            "山田太郎", "user@example.com", "payment-token",
            List.of(new ReserveRequestDto.SelectedSeatDto("0001", "普通車", "SEAT-NOT-EXIST", 5000))
        );
        UUID reservationId = UUID.randomUUID();

        new TransactionTemplate(transactionManager).executeWithoutResult(status ->
            eventPublisher.publishEvent(
                new ReservationCreatedEvent(reservationId, request, LocalTime.of(9, 0), LocalTime.of(10, 30))
            )
        );

        await().atMost(Duration.ofSeconds(5))
            .untilAsserted(() -> verify(reservationEmailService, times(1)).sendReservationConfirmation(any()));
    }
}
