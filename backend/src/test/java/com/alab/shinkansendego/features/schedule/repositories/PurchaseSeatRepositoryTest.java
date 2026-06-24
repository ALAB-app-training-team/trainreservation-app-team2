package com.alab.shinkansendego.features.schedule.repositories;

import com.alab.shinkansendego.features.schedule.entities.PurchaseSeatEntity;
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

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ActiveProfiles("test")
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@Sql(scripts = {"classpath:com/alab/shinkansendego/features/schedule/sql/PurchaseSeatRepositoryTestData.sql"})
public class PurchaseSeatRepositoryTest {
    // テスト用DB作成
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
            .withDatabaseName("test")
            .withUsername("user")
            .withPassword("pass");
    @Autowired
    private PurchaseSeatRepository repo;

    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    @DisplayName("新規購入座席情報が挿入できる")
    void insertPurchaseSeat_withPurchaseSeatEntity_returnRecordCount() {
        List<PurchaseSeatEntity> purchaseSeats = new ArrayList<>();
        for (int i = 1; i < 3; i++) {
            PurchaseSeatEntity purchaseSeat = new PurchaseSeatEntity();
            purchaseSeat.setId(UUID.randomUUID());
            purchaseSeat.setPurchase_id(UUID.fromString("123e4567-e89b-12d3-a456-426614174000"));
            purchaseSeat.setTrain_car_cd("E5SER01");
            purchaseSeat.setSeat_cd("SEAT0100" + i);
            purchaseSeat.setCode_token(UUID.randomUUID());
        }
        int result = repo.insertPurchaseSeats(purchaseSeats);
        assertEquals(result, 2);
    }
}
