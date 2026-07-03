package com.alab.shinkansendego.departurearrivaltime;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.boot.data.jpa.test.autoconfigure.*;
import org.springframework.boot.jdbc.test.autoconfigure.*;
import org.springframework.boot.testcontainers.service.connection.*;
import org.springframework.test.context.*;
import org.springframework.test.context.jdbc.*;
import org.testcontainers.containers.*;
import org.testcontainers.junit.jupiter.*;
import org.testcontainers.junit.jupiter.Container;

import java.time.*;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

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
        DepartureArrivalTimeEntity test4 = new DepartureArrivalTimeEntity();
        test4.setTimeCd("TEST0401");
        test4.setScheduleCd("TEST04");
        test4.setDepartureTime(LocalTime.of(6, 40, 0));
        test4.setArrivalTime(LocalTime.of(6, 45, 0));
        test4.setSectionCd("TEST02");
        DepartureArrivalTimeEntity test10 = new DepartureArrivalTimeEntity();
        test10.setTimeCd("TEST1001");
        test10.setSectionCd("TEST10");
        test10.setDepartureTime(LocalTime.of(7, 44, 0));
        test10.setArrivalTime(LocalTime.of(7, 49, 0));
        test10.setSectionCd("TEST02");
        DepartureArrivalTimeEntity test17 = new DepartureArrivalTimeEntity();
        test17.setTimeCd("TEST1701");
        test17.setSectionCd("TEST17");
        test17.setDepartureTime(LocalTime.of(9, 8, 0));
        test17.setArrivalTime(LocalTime.of(9, 13, 0));
        test17.setSectionCd("TEST02");

        List<DepartureArrivalTimeEntity> expected = Arrays.asList(test4, test10, test17);
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
