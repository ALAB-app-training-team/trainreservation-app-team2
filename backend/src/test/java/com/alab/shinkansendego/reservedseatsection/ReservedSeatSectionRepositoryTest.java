package com.alab.shinkansendego.reservedseatsection;

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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ActiveProfiles("test")
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@Sql(scripts = "classpath:com/alab/shinkansendego/sql/ReservedSeatSectionRepositoryTestData.sql")
public class ReservedSeatSectionRepositoryTest {
    // テスト用DB作成
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16").withDatabaseName("test").withUsername("user").withPassword("pass");
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
    void findReservedSeatCdOfTrainCarBySectionCd_returnGetReservedSeatListSuccessRideDateAndScheduleCdAndTrainCarCdAndReservedSeat() {
        List<String> actual = repo.findReservedSeatCdByRideDateAndScheduleCdAndTrainCarCdAndReservedSeatSectionCd(LocalDate.of(2026, 6, 1), "Test01", "E5SER01", "Test1");
        assertEquals(2, actual.size());
        assertEquals("SEAT00101", actual.get(0));
        assertEquals("SEAT00104", actual.get(1));
    }

    @Test
    @DisplayName("テーブルに存在しない日付を検索した場合、空のリストが返却されるか")
    void findReservedSeatCdByRideDateAndScheduleCdAndTrainCarCdAndReservedSeatSectionCd_withNotExistRideDate_returnEmptyList() {
        List<String> actual = repo.findReservedSeatCdByRideDateAndScheduleCdAndTrainCarCdAndReservedSeatSectionCd(LocalDate.of(2000, 6, 1), "Test01", "E5SER01", "Test1");
        assertEquals(0, actual.size());
    }

    @Test
    @DisplayName("テーブルに存在しないダイヤCDを検索した場合、空のリストが返却されるか")
    void findReservedSeatCdOfTrainCarBySectionCd_withNotExistScheduleCd_returnEmptyListRideDateAndScheduleCdAndTrainCarCdAndReservedSeat() {
        List<String> actual = repo.findReservedSeatCdByRideDateAndScheduleCdAndTrainCarCdAndReservedSeatSectionCd(LocalDate.of(2026, 6, 1), "Test99", "E5SER01", "Test1");
        assertEquals(0, actual.size());
    }

    @Test
    @DisplayName("テーブルに存在しない号車CDを検索した場合、空のリストが返却されるか")
    void findReservedSeatCdOfTrainCarBySectionCd_withNotExistTrainCarCd_returnEmptyListRideDateAndScheduleCdAndTrainCarCdAndReservedSeat() {
        List<String> actual = repo.findReservedSeatCdByRideDateAndScheduleCdAndTrainCarCdAndReservedSeatSectionCd(LocalDate.of(2026, 6, 1), "Test01", "E0SER01", "Test1");
        assertEquals(0, actual.size());
    }

    @Test
    @DisplayName("テーブルに存在しない区間CDを検索した場合、空のリストが返却されるか")
    void findReservedSeatCdOfTrainCarBySectionCd_withNotExistRideDateAndScheduleCdAndTrainCarCdAndReservedSeatSectionCd_returnEmptyList() {
        List<String> actual = repo.findReservedSeatCdByRideDateAndScheduleCdAndTrainCarCdAndReservedSeatSectionCd(LocalDate.of(2026, 6, 1), "Test01", "E5SER01", "Test0");
        assertEquals(0, actual.size());
    }

    @Test
    @DisplayName("新規予約済座席区間情報が挿入できる")
    void saveAllReservedSeatSections_withPurchasedSeatList_returnRecordCount() {
        List<ReservedSeatSectionEntity> reservedSeatSections = new ArrayList<>();
        for (int i = 1; i < 3; i++) {
            ReservedSeatSectionEntity reservedSeatSection = new ReservedSeatSectionEntity();
            reservedSeatSection.setId(UUID.randomUUID());
            reservedSeatSection.setPurchaseId(UUID.fromString("123e4567-e89b-12d3-a456-426614174000"));
            reservedSeatSection.setRideDate(LocalDate.now());
            reservedSeatSection.setScheduleCd("Test01");
            reservedSeatSection.setTrainCarCd("E5SER01");
            reservedSeatSection.setSeatCd("SEAT0100" + (i + 5));
            reservedSeatSection.setReservedSectionCd("Test" + (i + 1));
            reservedSeatSections.add(reservedSeatSection);
        }
        int result = repo.saveAll(reservedSeatSections).size();
        assertEquals(2, result);
    }

    @Test
    @DisplayName("同一購入情報IDで重複した座席を予約しようとした場合、DataAccessExceptionが発生する")
    void saveAllReservedSeatSections_withSameReservedSeatSectionList_throwsDataAccessException() {
        List<ReservedSeatSectionEntity> reservedSeatSections = new ArrayList<>();
        for (int i = 1; i < 3; i++) {
            ReservedSeatSectionEntity reservedSeatSection = new ReservedSeatSectionEntity();
            reservedSeatSection.setId(UUID.randomUUID());
            reservedSeatSection.setPurchaseId(UUID.fromString("123e4567-e89b-12d3-a456-426614174000"));
            reservedSeatSection.setRideDate(LocalDate.parse("2026-06-01"));
            reservedSeatSection.setScheduleCd("Test01");
            reservedSeatSection.setTrainCarCd("E5SER01");
            reservedSeatSection.setSeatCd("SEAT0010" + i);
            reservedSeatSection.setReservedSectionCd("Test1");
            reservedSeatSections.add(reservedSeatSection);
        }
        assertThrows(org.springframework.dao.DataAccessException.class, () -> {
            repo.saveAll(reservedSeatSections);
        });
    }

    @Test
    @DisplayName("空の予約済座席区間情報を渡した場合、BadSqlGrammarExceptionが発生する")
    void saveAllReservedSeatSections_withEmptyReservedSeatSectionList_throwsException() {
        List<ReservedSeatSectionEntity> emptyReservedSeatSections = new ArrayList<>();
        assertThrows(org.springframework.jdbc.BadSqlGrammarException.class, () -> {
            repo.saveAll(emptyReservedSeatSections);
        });
    }
}
