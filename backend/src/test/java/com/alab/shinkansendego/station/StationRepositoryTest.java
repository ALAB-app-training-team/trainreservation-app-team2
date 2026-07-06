package com.alab.shinkansendego.station;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.boot.data.jpa.test.autoconfigure.*;
import org.springframework.boot.jdbc.test.autoconfigure.*;
import org.springframework.test.context.*;
import org.springframework.test.context.jdbc.*;
import org.testcontainers.containers.*;
import org.testcontainers.junit.jupiter.*;
import org.testcontainers.junit.jupiter.Container;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@Sql(scripts = "classpath:com/alab/shinkansendego/sql/StationTestData.sql")
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
    void findAll_returnGetListSuccess() {
        List<StationEntity> actual = repo.findAll();
        assertEquals(10, actual.size());
        assertEquals("Test0", actual.get(0).getStationCd());
        assertEquals("Test1", actual.get(1).getStationCd());
        assertEquals("Test2", actual.get(2).getStationCd());
        assertEquals("Test3", actual.get(3).getStationCd());
        assertEquals("Test4", actual.get(4).getStationCd());
        assertEquals("Test5", actual.get(5).getStationCd());
        assertEquals("Test6", actual.get(6).getStationCd());
        assertEquals("Test7", actual.get(7).getStationCd());
        assertEquals("Test8", actual.get(8).getStationCd());
        assertEquals("Test9", actual.get(9).getStationCd());

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
}
