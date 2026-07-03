package com.alab.shinkansendego.schedule;

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

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@Sql(scripts = {"classpath:com/alab/shinkansendego/sql/TrainTypeTestData.sql", "classpath:com/alab/shinkansendego/sql/ScheduleTestData.sql"})
public class ScheduleRepositoryTest {
    // テスト用DB作成
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
            .withDatabaseName("test")
            .withUsername("user")
            .withPassword("pass");
    @Autowired
    private ScheduleRepository repo;

    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    @DisplayName("ダイヤコードから車種名を取得できる")
    void findTrainTypeNameByScheduleCd_withScheduleCd_returnGetTrainTypeSuccess() {
        String expected = "やまびこ11号";
        String actual = repo.findTrainTypeNameByScheduleCd("TEST06");
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("テーブルに存在しないダイヤコードを検索した場合、Nullが返却されるか")
    void findTrainTypeNameByScheduleCd_withNotExistScheduleCd_returnNull() {
        String actual = repo.findTrainTypeNameByScheduleCd("99999");
        assertNull(actual);
    }

    @Test
    @Sql(scripts = {"classpath:com/alab/shinkansendego/sql/TrainCarFormationTestData.sql"})
    @DisplayName("ダイヤコードを指定して車両編成が取得できる")
    void findTrainCarByScheduleCd_withScheduleCd_returnGetTrainCarListSuccess() {
        String scheduleCd = "TEST01";
        List<TrainCarFormationResponseDto> actualList = repo.findTrainCarFormationByScheduleCd(scheduleCd);
        assertEquals(2, actualList.size());

        TrainCarFormationResponseDto actual01 = actualList.getFirst();
        assertEquals("E5SER01", actual01.getTrainCarCd());
        assertEquals(1, actual01.getTrainCarNumber());
        assertEquals("SEAT01", actual01.getSeatTypeCd());
        assertEquals("指定席", actual01.getTrainCarTypeName());

        TrainCarFormationResponseDto actual02 = actualList.getLast();
        assertEquals("E5SER02", actual02.getTrainCarCd());
        assertEquals(2, actual02.getTrainCarNumber());
        assertEquals("SEAT01", actual02.getSeatTypeCd());
        assertEquals("指定席", actual02.getTrainCarTypeName());
    }

    @Test
    @Sql(scripts = {"classpath:com/alab/shinkansendego/sql/TrainCarFormationTestData.sql"})
    @DisplayName("テーブルに存在しないダイヤコードを検索した場合、空のリストが返却されるか")
    void findTrainCarByScheduleCd_withNotExistScheduleCd_returnEmptyList() {
        List<TrainCarFormationResponseDto> actualList = repo.findTrainCarFormationByScheduleCd("99999");
        assertTrue(actualList.isEmpty());
    }
}
