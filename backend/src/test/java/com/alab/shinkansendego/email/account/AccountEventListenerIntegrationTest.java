package com.alab.shinkansendego.email.account;

import com.alab.shinkansendego.account.AccountCreatedEvent;
import com.alab.shinkansendego.account.AccountRequestDto;
import com.alab.shinkansendego.account.AccountUpdatedEvent;
import com.alab.shinkansendego.account.PasswordUpdatedEvent;
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

import static org.awaitility.Awaitility.await;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

/**
 * AccountEventListener の各ハンドラはイベント発行後、トランザクションコミットを待ってから
 * (@TransactionalEventListener(AFTER_COMMIT)) 別スレッドで (@Async) メール送信を行う。
 * この非同期・コミット後実行という組み合わせが実機のSpringコンテキスト上で
 * 本当にテスト可能かを、3つのイベント全パターンについて実証するための統合テスト。
 *
 * 個々の分岐条件(メールアドレス変更あり/なしなど)の網羅は
 * AccountEventListenerTest (Mockitoによる単体テスト) 側の責務とし、
 * ここでは各エントリーポイントにつき非同期実行される代表的なパターンのみを扱う。
 */
@ActiveProfiles("test")
@SpringBootTest
@Testcontainers
class AccountEventListenerIntegrationTest {

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
    private AccountEmailService accountEmailService;

    private void publishInCommittedTransaction(Object event) {
        new TransactionTemplate(transactionManager).executeWithoutResult(status -> eventPublisher.publishEvent(event));
    }

    private AccountRequestDto accountRequest(String name, String mail) {
        return new AccountRequestDto(name, mail, "password");
    }

    @Test
    @DisplayName("アカウント作成イベントのコミット後、非同期に作成完了メール送信が呼び出される")
    void handleAccountCreated_isInvokedAsynchronouslyAfterTransactionCommit() {
        publishInCommittedTransaction(new AccountCreatedEvent(accountRequest("山田太郎", "new@example.com")));

        await().atMost(Duration.ofSeconds(5))
            .untilAsserted(() -> verify(accountEmailService, times(1)).sendAccountCreate(any()));
    }

    @Test
    @DisplayName("メールアドレス変更なしのアカウント変更イベントのコミット後、非同期に変更完了メール送信が1回呼び出される")
    void handleAccountChanged_withoutMailChange_isInvokedAsynchronouslyAfterTransactionCommit() {
        publishInCommittedTransaction(new AccountUpdatedEvent(
            accountRequest("新氏名", "same@example.com"),
            accountRequest("旧氏名", "same@example.com")
        ));

        await().atMost(Duration.ofSeconds(5))
            .untilAsserted(() -> verify(accountEmailService, times(1)).sendAccountUpdate(any(), any()));
    }

    @Test
    @DisplayName("メールアドレス変更ありのアカウント変更イベントのコミット後、非同期に変更完了メール送信が2回呼び出される")
    void handleAccountChanged_withMailChange_isInvokedAsynchronouslyAfterTransactionCommit() {
        publishInCommittedTransaction(new AccountUpdatedEvent(
            accountRequest("新氏名", "new@example.com"),
            accountRequest("旧氏名", "old@example.com")
        ));

        await().atMost(Duration.ofSeconds(5))
            .untilAsserted(() -> verify(accountEmailService, times(2)).sendAccountUpdate(any(), any()));
    }

    @Test
    @DisplayName("パスワード変更イベントのコミット後、非同期にパスワード変更完了メール送信が呼び出される")
    void handlePasswordChanged_isInvokedAsynchronouslyAfterTransactionCommit() {
        publishInCommittedTransaction(new PasswordUpdatedEvent(accountRequest("山田太郎", "user@example.com")));

        await().atMost(Duration.ofSeconds(5))
            .untilAsserted(() -> verify(accountEmailService, times(1)).sendPasswordUpdate(any()));
    }
}
