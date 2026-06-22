package com.alab.shinkansendego.features.schedule.repositories;

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

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ActiveProfiles("test")
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@Sql(scripts = "classpath:com/alab/shinkansendego/features/schedule/sql/ReservedSeatSectionTestData.sql")
public class ReservedSeatSectionRepositoryTest {
    // テスト用DB作成
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
            .withDatabaseName("test")
            .withUsername("user")
            .withPassword("pass");
    @Autowired
    private ReservedSeatSectionRepository repo;

    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    @DisplayName("乗車日付と区間CDから号車内の予約済座席リストが取得できる")
    void findReservedSeatCdOfTrainCarBySectionCd_returnGetReservedSeatListSuccess() {
        List<String> actual = repo
                .findReservedSeatCdOfTrainCarBySectionCd(
                        LocalDate.of(2026, 6, 1),
                        "Test01",
                        "E5SER01",
                        "Test1");
        assertEquals(2, actual.size());
        assertEquals("SEAT00101", actual.get(0));
        assertEquals("SEAT00104", actual.get(1));
    }

    @Test
    @DisplayName("テーブルに存在しない日付を検索した場合、空のリストが返却されるか")
    void findReservedSeatCdOfTrainCarBySectionCd_withNotExistRideDate_returnEmptyList() {
        List<String> actual = repo
                .findReservedSeatCdOfTrainCarBySectionCd(
                        LocalDate.of(2000, 6, 1),
                        "Test01",
                        "E5SER01",
                        "Test1");
        assertEquals(0, actual.size());
    }

    @Test
    @DisplayName("テーブルに存在しないダイヤCDを検索した場合、空のリストが返却されるか")
    void findReservedSeatCdOfTrainCarBySectionCd_withNotExistScheduleCd_returnEmptyList() {
        List<String> actual = repo
                .findReservedSeatCdOfTrainCarBySectionCd(
                        LocalDate.of(2026, 6, 1),
                        "Test99",
                        "E5SER01",
                        "Test1");
        assertEquals(0, actual.size());
    }

    @Test
    @DisplayName("テーブルに存在しない号車CDを検索した場合、空のリストが返却されるか")
    void findReservedSeatCdOfTrainCarBySectionCd_withNotExistTrainCarCd_returnEmptyList() {
        List<String> actual = repo
                .findReservedSeatCdOfTrainCarBySectionCd(
                        LocalDate.of(2026, 6, 1),
                        "Test01",
                        "E0SER01",
                        "Test1");
        assertEquals(0, actual.size());
    }

    @Test
    @DisplayName("テーブルに存在しない区間CDを検索した場合、空のリストが返却されるか")
    void findReservedSeatCdOfTrainCarBySectionCd_withNotExistSectionCd_returnEmptyList() {
        List<String> actual = repo
                .findReservedSeatCdOfTrainCarBySectionCd(
                        LocalDate.of(2026, 6, 1),
                        "Test01",
                        "E5SER01",
                        "Test0");
        assertEquals(0, actual.size());
    }
}
