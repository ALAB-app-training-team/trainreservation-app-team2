package com.alab.shinkansendego.traincar;

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

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@ActiveProfiles("test")
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@Sql(scripts = {"classpath:com/alab/shinkansendego/sql/SeatTypeTestData.sql", "classpath:com/alab/shinkansendego/sql/TrainCarTestData.sql", "classpath:com/alab/shinkansendego/sql/SeatTestData.sql"})
public class TrainCarRepositoryTest {
    // テスト用DB作成
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
            .withDatabaseName("test")
            .withUsername("user")
            .withPassword("pass");
    @Autowired
    private TrainCarRepository repo;

    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    @DisplayName("号車コードから号車内の座席リストが取得できる")
    void findSeatByTrainCarCd_returnGetSeatListSuccess() {
        List<SeatResponseDto> actual = repo.findSeatByTrainCarCd("E5SER01");
        assertEquals(3, actual.size());
        assertEquals("E5SER01", actual.get(0).getTrain_car_cd());
        assertEquals("E5SER01", actual.get(1).getTrain_car_cd());
        assertEquals("E5SER01", actual.get(2).getTrain_car_cd());
        assertEquals(1, actual.get(0).getTrain_car_number());
        assertEquals(1, actual.get(1).getTrain_car_number());
        assertEquals(1, actual.get(2).getTrain_car_number());
        assertEquals("SEAT01001", actual.get(0).getSeat_cd());
        assertEquals("SEAT01002", actual.get(1).getSeat_cd());
        assertEquals("SEAT01003", actual.get(2).getSeat_cd());
        assertEquals(1, actual.get(0).getSeat_number());
        assertEquals(1, actual.get(1).getSeat_number());
        assertEquals(1, actual.get(2).getSeat_number());
        assertEquals("A", actual.get(0).getSeat_column());
        assertEquals("B", actual.get(1).getSeat_column());
        assertEquals("C", actual.get(2).getSeat_column());
        assertNull(actual.get(0).getIs_reserved());
        assertNull(actual.get(1).getIs_reserved());
        assertNull(actual.get(2).getIs_reserved());
    }
}
