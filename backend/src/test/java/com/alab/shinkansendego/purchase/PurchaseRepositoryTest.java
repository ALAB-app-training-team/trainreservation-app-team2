package com.alab.shinkansendego.purchase;

import com.alab.shinkansendego.reservation.ReservationDto;
import com.alab.shinkansendego.reservation.ReservedScheduleDto;
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
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@ActiveProfiles("test")
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
public class PurchaseRepositoryTest {
    // テスト用DB作成
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
            .withDatabaseName("test")
            .withUsername("user")
            .withPassword("pass");
    private final UUID purchaseId = UUID.fromString("4156b939-2e3e-46c1-92d3-7aa64b6ca575");
    @Autowired
    private PurchaseRepository repo;

    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    @Sql(scripts = "classpath:com/alab/shinkansendego/sql/PurchaseTestData_Reservation.sql")
    @DisplayName("購入情報IDから購入した座席の運行情報を取得できる")
    void findScheduleByPurchaseId_withPurchaseId_returnGetScheduleSuccess() {
        List<ReservedScheduleDto> expected = Arrays.asList(
                new ReservedScheduleDto(
                        LocalTime.of(6, 0, 0), "EKI01", "TestStation01", LocalTime.of(6, 55, 0), "EKI02", "TestStation02"),
                new ReservedScheduleDto(
                        LocalTime.of(7, 0, 0), "EKI02", "TestStation02", LocalTime.of(7, 55, 0), "EKI03", "TestStation03"),
                new ReservedScheduleDto(
                        LocalTime.of(8, 0, 0), "EKI03", "TestStation03", LocalTime.of(8, 55, 0), "EKI04", "TestStation04"));
        List<ReservedScheduleDto> actual = repo.findScheduleByPurchaseId(purchaseId);
        assertEquals(expected, actual);
    }

    @Test
    @Sql(scripts = "classpath:com/alab/shinkansendego/sql/PurchaseTestData_Reservation.sql")
    @DisplayName("テーブルに存在しない購入情報IDを検索した場合、空の運行情報リストが返却されるか")
    void findScheduleByPurchaseId_withNotExistPurchaseId_returnEmptyList() {
        List<ReservedScheduleDto> actual = repo.findScheduleByPurchaseId(UUID.fromString("9996b939-2e3e-46c1-92d3-7aa64b6ca575"));
        assertEquals(0, actual.size());
    }

    @Test
    @Sql(scripts = "classpath:com/alab/shinkansendego/sql/PurchaseTestData_Reservation.sql")
    @DisplayName("購入情報IDから購入情報を取得できる")
    void findPurchaseByPurchaseId_withPurchaseId_returnGetPurchaseSuccess() {
        ReservationDto expected = new ReservationDto("やまびこ1号", "EKI01", "EKI03", LocalDate.of(2026, 6, 1));
        ReservationDto actual = repo.findPurchaseByPurchaseId(purchaseId);
        assertEquals(expected, actual);
    }

    @Test
    @Sql(scripts = "classpath:com/alab/shinkansendego/sql/PurchaseTestData_Reservation.sql")
    @DisplayName("テーブルに存在しない購入情報IDを検索した場合、Nullが返却されるか")
    void findPurchaseByPurchaseId_withNotExistPurchaseId_returnNull() {
        ReservationDto actual = repo.findPurchaseByPurchaseId(UUID.fromString("9996b939-2e3e-46c1-92d3-7aa64b6ca575"));
        assertNull(actual);
    }

    @Test
    @Sql(scripts = {"classpath:com/alab/shinkansendego/sql/PurchaseRepositoryTestData_Schedule.sql"})
    @DisplayName("新規購入情報が挿入できる")
    void insertPurchase_withPurchaseEntity_returnRecordCount() {
        PurchaseEntity purchase = new PurchaseEntity();
        purchase.setId(UUID.fromString("123e4567-e89b-12d3-a456-426614174000"));
        purchase.setRide_date(LocalDate.now());
        purchase.setSchedule_cd("TEST01");
        purchase.setDeparture_station_cd("Test0");
        purchase.setArrival_station_cd("Test1");
        int result = repo.insertPurchase(purchase);
        assertEquals(result, 1);
    }
}
