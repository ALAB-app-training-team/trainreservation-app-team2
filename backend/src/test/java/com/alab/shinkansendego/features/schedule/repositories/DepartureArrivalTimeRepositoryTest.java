package com.alab.shinkansendego.features.schedule.repositories;

import com.alab.shinkansendego.features.schedule.dtos.DepartureArrivalTimeDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@Sql(scripts = "classpath:com/alab/shinkansendego/features/schedule/sql/DepartureArrivalTimeTestData.sql")
public class DepartureArrivalTimeRepositoryTest {
    // テスト用DB作成
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
            .withDatabaseName("test")
            .withUsername("user")
            .withPassword("pass");
    @Autowired
    private DepartureArrivalTimeRepository repo;

    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    @DisplayName("区間コードからダイヤコードと出発到着時刻を取得できる")
    void findScheduleBySectionKmCd() {
        List<DepartureArrivalTimeDto> expected = Arrays.asList(
                new DepartureArrivalTimeDto(
                        "TEST04", LocalTime.of(6, 40, 0), LocalTime.of(6, 45, 0)),
                new DepartureArrivalTimeDto(
                        "TEST10", LocalTime.of(7, 44, 0), LocalTime.of(7, 49, 0)),
                new DepartureArrivalTimeDto(
                        "TEST17", LocalTime.of(9, 8, 0), LocalTime.of(9, 13, 0)));
        List<DepartureArrivalTimeDto> actual = repo.findScheduleBySectionKmCd("TEST2");
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("テーブルに存在しない区間コードを検索した場合、空のリストが返却されるか")
    void returnEmptyListWhenNotExistSectionCd() {
        List<DepartureArrivalTimeDto> actual = repo.findScheduleBySectionKmCd("99999");
        assertEquals(0, actual.size());
    }
}
