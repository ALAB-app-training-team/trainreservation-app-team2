package com.alab.shinkansendego.features.schedule.repositories;

import com.alab.shinkansendego.features.schedule.dtos.StationResponseDto;
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
@Sql(scripts = "classpath:com/alab/shinkansendego/features/schedule/sql/StationTestData.sql")
public class StationRepositoryTest {
    // テスト用DB作成
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
            .withDatabaseName("test")
            .withUsername("user")
            .withPassword("pass");
    @Autowired
    private StationRepository repo;

    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    @DisplayName("駅コードと駅名を全件取得できる")
    void findAllStation_returnGetStationListSuccess() {
        List<StationResponseDto> actual = repo.findAllStation();
        assertEquals(10, actual.size());
        assertEquals("Test0", actual.get(0).getStation_cd());
        assertEquals("Test1", actual.get(1).getStation_cd());
        assertEquals("Test2", actual.get(2).getStation_cd());
        assertEquals("Test3", actual.get(3).getStation_cd());
        assertEquals("Test4", actual.get(4).getStation_cd());
        assertEquals("Test5", actual.get(5).getStation_cd());
        assertEquals("Test6", actual.get(6).getStation_cd());
        assertEquals("Test7", actual.get(7).getStation_cd());
        assertEquals("Test8", actual.get(8).getStation_cd());
        assertEquals("Test9", actual.get(9).getStation_cd());

        assertEquals("TestStation00", actual.get(0).getName());
        assertEquals("TestStation01", actual.get(1).getName());
        assertEquals("TestStation02", actual.get(2).getName());
        assertEquals("TestStation03", actual.get(3).getName());
        assertEquals("TestStation04", actual.get(4).getName());
        assertEquals("TestStation05", actual.get(5).getName());
        assertEquals("TestStation06", actual.get(6).getName());
        assertEquals("TestStation07", actual.get(7).getName());
        assertEquals("TestStation08", actual.get(8).getName());
        assertEquals("TestStation09", actual.get(9).getName());
    }

    @Test
    @DisplayName("駅名から駅コードを取得できる")
    void findStationCdByName_withStationName_returnGetStationCdSuccess() {
        String actual = repo.findStationCdByName("TestStation02");
        assertEquals("Test2", actual);
    }

    @Test
    @DisplayName("テーブルに存在しない駅コードを検索した場合、Nullが返却されるか")
    void findStationCdByName_withNotExistStationCd_returnNull() {
        String actual = repo.findStationCdByName("99999");
        assertNull(actual);
    }
}
