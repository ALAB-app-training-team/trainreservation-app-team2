package com.alab.shinkansendego.email.account;

import com.alab.shinkansendego.account.AccountCreatedEvent;
import com.alab.shinkansendego.account.AccountRequestDto;
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
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

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

    private AccountRequestDto accountRequest(String name, String mail) {
        return new AccountRequestDto(name, mail, "password");
    }

    @Test
    @DisplayName("アカウント作成イベントのコミット後、非同期に作成完了メール送信が呼び出される")
    void handleAccountCreated_isInvokedAsynchronouslyAfterTransactionCommit() {
        AccountCreatedEvent event = new AccountCreatedEvent(accountRequest("山田太郎", "new@example.com"));

        new TransactionTemplate(transactionManager).executeWithoutResult(status -> eventPublisher.publishEvent(event));

        await().atMost(Duration.ofSeconds(5))
            .untilAsserted(() -> verify(accountEmailService, times(1)).sendAccountCreate(any()));
    }

    @Test
    @DisplayName("トランザクションがロールバックされた場合は作成完了メール送信が呼び出されない")
    void handleAccountCreated_isNotInvoked_whenTransactionRolledBack() {
        AccountCreatedEvent event = new AccountCreatedEvent(accountRequest("山田太郎", "new@example.com"));

        new TransactionTemplate(transactionManager).executeWithoutResult(status -> {
            eventPublisher.publishEvent(event);
            status.setRollbackOnly();
        });

        await().during(Duration.ofMillis(500)).atMost(Duration.ofSeconds(2))
            .untilAsserted(() -> verify(accountEmailService, never()).sendAccountCreate(any()));
    }
}
