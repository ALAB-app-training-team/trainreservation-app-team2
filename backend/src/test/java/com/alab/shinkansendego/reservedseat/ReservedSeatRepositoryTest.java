package com.alab.shinkansendego.reservedseat;

import com.alab.shinkansendego.reservation.ReservedSeatDto;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
public class ReservedSeatRepositoryTest {
    // テスト用DB作成
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
            .withDatabaseName("test")
            .withUsername("user")
            .withPassword("pass");
    private final UUID reservationId = UUID.fromString("4156b939-2e3e-46c1-92d3-7aa64b6ca575");
    @Autowired
    private ReservedSeatRepository repo;

    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    @Sql(scripts = "classpath:com/alab/shinkansendego/sql/ReservedSeatTestData_Reservation.sql")
    @DisplayName("購入情報IDから購入した座席リストを取得できる")
    void findReservedSeatDtoByReservationId_withReservationId_returnGetScheduleSuccess() {
        List<ReservedSeatDto> expected = Arrays.asList(
                new ReservedSeatDto("指定席", 1, 1, "A", UUID.fromString("fe529692-fbac-4332-b70f-263ab1c1e216")),
                new ReservedSeatDto("グリーン車", 2, 2, "B", UUID.fromString("510b8d7b-b954-4220-be15-5b1648e36db5")),
                new ReservedSeatDto("グランクラス", 3, 3, "C", UUID.fromString("a1d64fbb-6f6e-4533-8e99-898ce9dea677")));
        List<ReservedSeatDto> actual = repo.findReservedSeatDtoByReservationId(reservationId);
        assertEquals(expected, actual);
    }

    @Test
    @Sql(scripts = "classpath:com/alab/shinkansendego/sql/ReservedSeatTestData_Reservation.sql")
    @DisplayName("テーブルに存在しない購入情報IDを検索した場合、空の座席リストが返却されるか")
    void findReservedSeatDtoByReservationId_withNotExistReservationId_returnEmptyList() {
        List<ReservedSeatDto> actual = repo.findReservedSeatDtoByReservationId(UUID.fromString("9996b939-2e3e-46c1-92d3-7aa64b6ca575"));
        assertTrue(actual.isEmpty());
    }

    @Test
    @Sql(scripts = {"classpath:com/alab/shinkansendego/sql/ReservedSeatRepositoryTestData_Schedule.sql"})
    @DisplayName("新規購入座席情報が挿入できる")
    void saveAll_withPurchasedSeatList_returnRecordCount() {
        List<ReservedSeatEntity> purchasedSeats = new ArrayList<>();
        for (int i = 1; i < 3; i++) {
            ReservedSeatEntity purchasedSeat = new ReservedSeatEntity();
            purchasedSeat.setId(UUID.randomUUID());
            purchasedSeat.setReservationId(UUID.fromString("123e4567-e89b-12d3-a456-426614174000"));
            purchasedSeat.setTrainCarCd("E5SER01");
            purchasedSeat.setSeatCd("SEAT0100" + i);
            purchasedSeat.setCodeToken(UUID.randomUUID());
            purchasedSeats.add(purchasedSeat);
        }
        int result = repo.saveAll(purchasedSeats).size();
        assertEquals(result, 2);
    }

    @Test
    @Sql(scripts = {"classpath:com/alab/shinkansendego/sql/ReservedSeatRepositoryTestData_Schedule.sql"})
    @DisplayName("同一購入情報IDで重複した座席を予約しようとした場合、DataAccessExceptionが発生する")
    void saveAll_withSamePurchasedSeatList_throwsDataAccessException() {
        List<ReservedSeatEntity> sameSeats = new ArrayList<>();
        for (int i = 1; i < 3; i++) {
            ReservedSeatEntity purchasedSeat = new ReservedSeatEntity();
            purchasedSeat.setId(UUID.randomUUID());
            purchasedSeat.setReservationId(UUID.fromString("123e4567-e89b-12d3-a456-426614174000"));
            purchasedSeat.setTrainCarCd("E5SER01");
            purchasedSeat.setSeatCd("SEAT01001");
            purchasedSeat.setCodeToken(UUID.randomUUID());
            sameSeats.add(purchasedSeat);
        }
        assertThrows(org.springframework.dao.DataAccessException.class, () -> {
            repo.saveAllAndFlush(sameSeats);
        });
    }
}
