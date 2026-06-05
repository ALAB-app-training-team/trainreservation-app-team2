package com.shinkansendego.demo.feature.schedule.repositories;

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

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@Sql(scripts = "classpath:com/shinkansendego/demo/feature/schedule/sql/SectionKmTestData.sql")
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
    void findSectionCdByStartStation() {
        List<String> expected = Arrays.asList("TEST1", "TEST2");
        List<String> actual = repo.findSectionCdByStartStation("EKI01");
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("終点駅コードから区間コードを取得できる")
    void findSectionCdByGoalStation() {
        List<String> expected = Arrays.asList("TEST2", "TEST3");
        List<String> actual = repo.findSectionCdByGoalStation("EKI03");
        assertEquals(expected, actual);
    }
}
