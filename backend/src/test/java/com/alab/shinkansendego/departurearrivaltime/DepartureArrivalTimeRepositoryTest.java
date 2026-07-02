package com.alab.shinkansendego.departurearrivaltime;

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

import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@ActiveProfiles("test")
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@Sql(scripts = "classpath:com/alab/shinkansendego/sql/DepartureArrivalTimeRepositoryTestData.sql")
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
    void findScheduleBySectionKmCd_withSectionCd_returnGetScheduleAndDepartureArrivalTimeSuccess() {
        List<DepartureArrivalTimeDto> expected = Arrays.asList(
                new DepartureArrivalTimeDto(
                        "TEST04", LocalTime.of(6, 40, 0), LocalTime.of(6, 45, 0)),
                new DepartureArrivalTimeDto(
                        "TEST10", LocalTime.of(7, 44, 0), LocalTime.of(7, 49, 0)),
                new DepartureArrivalTimeDto(
                        "TEST17", LocalTime.of(9, 8, 0), LocalTime.of(9, 13, 0)));
        List<DepartureArrivalTimeEntity> actual = repo.findBySectionCd("TEST2");
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("テーブルに存在しない区間コードを検索した場合、空のリストが返却されるか")
    void findScheduleBySectionKmCd_withNotExistSectionCd_returnEmptyList() {
        List<DepartureArrivalTimeEntity> actual = repo.findBySectionCd("99999");
        assertEquals(0, actual.size());
    }

    @Test
    @DisplayName("ダイヤコードと区間コードから出発到着時刻を取得できる")
    void findScheduleBySectionKmCdAndScheduleCd_withSectionCdAndScheduleCd_returnGetDepartureArrivalTime() {
        List<String> sectionCds = List.of("TEST1", "TEST2", "TEST3");
        String scheduleCd = "TEST01";
        DepartureArrivalTimeEntity expected = new DepartureArrivalTimeEntity();
        expected.setTimeCd("TEST0101");
        expected.setScheduleCd("TEST01");
        expected.setDepartureTime(LocalTime.of(6, 4));
        expected.setArrivalTime(LocalTime.of(6, 9));
        expected.setSectionCd("TEST3");
        DepartureArrivalTimeEntity actual = repo.findByScheduleCdAndSectionCdIn(scheduleCd, sectionCds);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("ダイヤコードと区間コードが一致する出発到着時刻が存在しない場合、Nullが返却される")
    void findScheduleBySectionKmCdAndScheduleCd_withNotMatchSectionCdAndScheduleCd_returnNull() {
        List<String> sectionCds = List.of("TEST1", "TEST2");
        String scheduleCd = "TEST01";
        DepartureArrivalTimeEntity actual = repo.findByScheduleCdAndSectionCdIn(scheduleCd, sectionCds);
        assertNull(actual);
    }
}
