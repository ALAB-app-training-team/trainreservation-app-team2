package com.alab.shinkansendego.features.reservation.repositories;

import com.alab.shinkansendego.features.reservation.dtos.ReservedSeatDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ActiveProfiles("test")
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@Sql(scripts = "classpath:com/alab/shinkansendego/features/reservation/sql/PurchasedSeatTestData.sql")
public class PurchasedSeatRepositoryTest {
    // テスト用DB作成
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
            .withDatabaseName("test")
            .withUsername("user")
            .withPassword("pass");
    private final UUID purchaseId = UUID.fromString("4156b939-2e3e-46c1-92d3-7aa64b6ca575");
    @Autowired
    private PurchasedSeatRepository repo;

    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    @DisplayName("購入情報IDから購入した座席リストを取得できる")
    void findReservedSeatByPurchaseId_withPurchaseId_returnGetScheduleSuccess() {
        List<ReservedSeatDto> expected = Arrays.asList(
                new ReservedSeatDto("指定席", 1, 1, "A", "fe529692-fbac-4332-b70f-263ab1c1e216"),
                new ReservedSeatDto("グリーン車", 2, 2, "B", "510b8d7b-b954-4220-be15-5b1648e36db5"),
                new ReservedSeatDto("グランクラス", 3, 3, "C", "a1d64fbb-6f6e-4533-8e99-898ce9dea677"));
        List<ReservedSeatDto> actual = repo.findReservedSeatByPurchaseId(purchaseId);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("テーブルに存在しない購入情報IDを検索した場合、空の座席リストが返却されるか")
    void findReservedSeatByPurchaseId_withNotExistPurchaseId_returnEmptyList() {
        List<ReservedSeatDto> actual = repo.findReservedSeatByPurchaseId(UUID.fromString("9996b939-2e3e-46c1-92d3-7aa64b6ca575"));
        assertEquals(0, actual.size());
    }
}
