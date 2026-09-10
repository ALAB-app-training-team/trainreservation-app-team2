package com.alab.shinkansendego.searchhistory;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ActiveProfiles("test")
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@Sql(scripts = {
    "classpath:com/alab/shinkansendego/sql/AccountTestData.sql",
    "classpath:com/alab/shinkansendego/sql/StationTestData.sql",
    "classpath:com/alab/shinkansendego/sql/SearchHistoryTestData.sql"
})
public class SearchHistoryRepositoryTest {
    private static final UUID ACCOUNT_A = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final UUID ACCOUNT_B = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private static final UUID HISTORY_OF_ACCOUNT_A = UUID.fromString("33333333-3333-3333-3333-333333333333");

    // テスト用DB作成
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
        .withDatabaseName("test")
        .withUsername("user")
        .withPassword("pass");
    @Autowired
    private SearchHistoryRepository repo;

    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    @DisplayName("idとaccountIdが一致する場合、検索履歴を取得できる")
    void findByIdAndAccountId_withOwnedHistory_returnHistory() {
        Optional<SearchHistoryEntity> actual = repo.findByIdAndAccountId(HISTORY_OF_ACCOUNT_A, ACCOUNT_A);

        assertTrue(actual.isPresent());
        assertEquals(HISTORY_OF_ACCOUNT_A, actual.get().getId());
    }

    @Test
    @DisplayName("idは存在するがaccountIdが一致しない場合、取得できない")
    void findByIdAndAccountId_withOtherAccountsHistory_returnEmpty() {
        Optional<SearchHistoryEntity> actual = repo.findByIdAndAccountId(HISTORY_OF_ACCOUNT_A, ACCOUNT_B);

        assertTrue(actual.isEmpty());
    }

    @Test
    @DisplayName("削除するとレコードがテーブルから物理削除される")
    void delete_removesRecordFromTable() {
        SearchHistoryEntity target = repo.findByIdAndAccountId(HISTORY_OF_ACCOUNT_A, ACCOUNT_A).orElseThrow();

        repo.delete(target);

        assertTrue(repo.findByIdAndAccountId(HISTORY_OF_ACCOUNT_A, ACCOUNT_A).isEmpty());
        assertTrue(repo.findById(HISTORY_OF_ACCOUNT_A).isEmpty());
    }
}
