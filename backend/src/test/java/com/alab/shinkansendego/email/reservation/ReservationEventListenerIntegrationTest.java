package com.alab.shinkansendego.email.reservation;

import com.alab.shinkansendego.reservation.ReservationCanceledEvent;
import com.alab.shinkansendego.reservation.ReservationChangedEvent;
import com.alab.shinkansendego.reservation.ReservationCreatedEvent;
import com.alab.shinkansendego.reservation.ReservationEntity;
import com.alab.shinkansendego.reservation.ReserveRequestDto;
import com.alab.shinkansendego.reservedseat.ReservedSeatEntity;
import com.alab.shinkansendego.reservedseat.ReservedSeatReleaseEvent;
import com.alab.shinkansendego.reservedseat.ReservedSeatSetEvent;
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
 * ReservationEventListener の各ハンドラはイベント発行後、トランザクションコミットを待ってから
 * (@TransactionalEventListener(AFTER_COMMIT)) 別スレッドで (@Async) メール送信を行う。
 * この非同期・コミット後実行という組み合わせが実機のSpringコンテキスト上で
 * 本当にテスト可能かを、5つのイベント全パターンについて実証するための統合テスト。
 *
 * 個々の分岐条件(同行者の有無・メールアドレスの有無など)の網羅は
 * ReservationEventListenerTest (Mockitoによる単体テスト) 側の責務とし、
 * ここでは各エントリーポイントにつき非同期実行される代表的な1パターンのみを扱う。
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

    private void publishInCommittedTransaction(Object event) {
        new TransactionTemplate(transactionManager).executeWithoutResult(status -> eventPublisher.publishEvent(event));
    }

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

        publishInCommittedTransaction(
            new ReservationCreatedEvent(UUID.randomUUID(), request, LocalTime.of(9, 0), LocalTime.of(10, 30))
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

    @Test
    @DisplayName("予約変更イベントのコミット後、非同期に予約変更メール送信が呼び出される")
    void handleReservationChanged_isInvokedAsynchronouslyAfterTransactionCommit() {
        ReserveRequestDto request = createRequest("user@example.com");
        ReservationEntity oldReservation = new ReservationEntity();

        publishInCommittedTransaction(
            new ReservationChangedEvent(
                UUID.randomUUID(), request, LocalTime.of(9, 0), LocalTime.of(10, 30),
                8000, "山田太郎", oldReservation, List.of()
            )
        );

        await().atMost(Duration.ofSeconds(5))
            .untilAsserted(() -> verify(reservationEmailService, times(1)).sendReservationChange(any()));
    }

    @Test
    @DisplayName("予約キャンセルイベントのコミット後、非同期に予約キャンセルメール送信が呼び出される")
    void handleReservationCanceled_isInvokedAsynchronouslyAfterTransactionCommit() {
        ReserveRequestDto request = createRequest("user@example.com");
        ReservedSeatEntity reservedSeat = new ReservedSeatEntity();
        reservedSeat.setTrainCarCd("0001");
        reservedSeat.setSeatCd("SEAT-NOT-EXIST");
        reservedSeat.setSeatFare(5000);
        reservedSeat.setName("同行者");
        reservedSeat.setMail(null);

        publishInCommittedTransaction(
            new ReservationCanceledEvent(
                UUID.randomUUID(), request, LocalTime.of(9, 0), LocalTime.of(10, 30), "山田太郎", List.of(reservedSeat)
            )
        );

        await().atMost(Duration.ofSeconds(5))
            .untilAsserted(() -> verify(reservationEmailService, times(1)).sendReservationCancel(any()));
    }

    @Test
    @DisplayName("同行者座席割当イベントのコミット後、非同期に割当完了メール送信が呼び出される")
    void handleReservedSetReleased_isInvokedAsynchronouslyAfterTransactionCommit() {
        ReserveRequestDto request = createRequest("companion@example.com");

        publishInCommittedTransaction(
            new ReservedSeatSetEvent(UUID.randomUUID(), List.of(request), LocalTime.of(9, 0), LocalTime.of(10, 30), "山田太郎")
        );

        await().atMost(Duration.ofSeconds(5))
            .untilAsserted(() -> verify(reservationEmailService, times(1)).sendSetCompanion(any()));
    }

    @Test
    @DisplayName("同行者座席解除イベントのコミット後、非同期に割当解除メール送信が呼び出される")
    void handleReservedSeatReleased_isInvokedAsynchronouslyAfterTransactionCommit() {
        ReserveRequestDto request = createRequest("companion@example.com");

        publishInCommittedTransaction(
            new ReservedSeatReleaseEvent(UUID.randomUUID(), List.of(request), LocalTime.of(9, 0), LocalTime.of(10, 30), "山田太郎")
        );

        await().atMost(Duration.ofSeconds(5))
            .untilAsserted(() -> verify(reservationEmailService, times(1)).sendReleaseCompanion(any()));
    }
}
