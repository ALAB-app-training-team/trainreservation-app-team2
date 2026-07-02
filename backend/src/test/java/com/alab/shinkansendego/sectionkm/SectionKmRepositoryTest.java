package com.alab.shinkansendego.sectionkm;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.*;
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

import static org.junit.jupiter.api.Assertions.assertEquals;

@ActiveProfiles("test")
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@Sql(scripts = "classpath:com/alab/shinkansendego/sql/SectionKmTestData.sql")
public class SectionKmRepositoryTest {
    // テスト用DB作成
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
            .withDatabaseName("test")
            .withUsername("user")
            .withPassword("pass");
    @Autowired
    private SectionKmRepository repo;

    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    @DisplayName("始点駅コードから区間コードを取得できる")
    void findSectionCdByStartStationCd_withStartStationCd_returnGetSectionCdSuccess() {
        List<String> expected = Arrays.asList("TEST1", "TEST2");
        List<String> actual = repo.findSectionCdByStartStationCd("EKI01");
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("テーブルに存在しない始点駅コードを検索した場合、空のリストが返却されるか")
    void findSectionCdByStartStationCd_withNotExistStartStationCd_returnEmptyList() {
        List<String> actual = repo.findSectionCdByStartStationCd("99999");
        assertEquals(0, actual.size());
    }

    @Test
    @DisplayName("終点駅コードから区間コードを取得できる")
    void findSectionCdByStartStationCd_withGoalStationCd_returnGetSectionCdSuccess() {
        List<String> expected = Arrays.asList("TEST2", "TEST3");
        List<String> actual = repo.findSectionCdByGoalStationCd("EKI03");
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("テーブルに存在しない終点駅コードを検索した場合、空のリストが返却されるか")
    void findSectionCdByStartStationCd_withNotExistGoalStationCd_returnEmptyList() {
        List<String> actual = repo.findSectionCdByGoalStationCd("99999");
        assertEquals(0, actual.size());
    }
}
