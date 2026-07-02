package com.alab.shinkansendego.reservation;

import org.jspecify.annotations.NonNull;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReservationController.class)
public class ReservationControllerTest {

    private final String baseUrl = "/api/shinkansen-reservation";
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private ReservationService service;

    private static @NonNull ReservationResponseDto getExpectReservationResponseDto() {
        ReservedSeatDto seat1 = new ReservedSeatDto("指定席", 1, 1, "A", "60a1ab63-a41f-430d-a2d1-10a76368d0f5");
        ReservedSeatDto seat2 = new ReservedSeatDto("グリーン車", 9, 1, "A", "3de8909e-32de-478e-bd9b-739f3fe6d6c3");
        ReservedSeatDto seat3 = new ReservedSeatDto("グランクラス", 10, 1, "A", "e192e5f1-318e-4d10-b76d-2f2bf15e8b70");
        List<ReservedSeatDto> reservedSeatList = Arrays.asList(seat1, seat2, seat3);
        return new ReservationResponseDto(
                "やまびこ1号",
                "東京",
                LocalTime.of(12, 0, 0),
                "仙台",
                LocalTime.of(13, 0, 0),
                LocalDate.of(2026, 6, 1),
                reservedSeatList);
    }

    @Test
    @DisplayName("購入情報IDから予約チケット情報が取得できる")
    void getReservation_withPurchaseId_returnGetReservationSuccess() throws Exception {

        ReservationResponseDto expect = getExpectReservationResponseDto();
        UUID request = UUID.fromString("4156b939-2e3e-46c1-92d3-7aa64b6ca575");
        String url = baseUrl + "?purchaseId=4156b939-2e3e-46c1-92d3-7aa64b6ca575";

        Mockito.when(service.getReservation(request)).thenReturn(expect);

        mockMvc.perform(
                        get(url)
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.train_type_name").value("やまびこ1号"))
                .andExpect(jsonPath("$.departure_station_name").value("東京"))
                .andExpect(jsonPath("$.departure_time").value("12:00:00"))
                .andExpect(jsonPath("$.arrival_station_name").value("仙台"))
                .andExpect(jsonPath("$.arrival_time").value("13:00:00"))
                .andExpect(jsonPath("$.ride_date").value("2026-06-01"))
                .andExpect(jsonPath("$.reserved_seats.length()").value(3))
                .andExpect(jsonPath("$.reserved_seats[0].train_car_type_name").value("指定席"))
                .andExpect(jsonPath("$.reserved_seats[1].train_car_type_name").value("グリーン車"))
                .andExpect(jsonPath("$.reserved_seats[2].train_car_type_name").value("グランクラス"))
                .andExpect(jsonPath("$.reserved_seats[0].train_car_number").value(1))
                .andExpect(jsonPath("$.reserved_seats[1].train_car_number").value(9))
                .andExpect(jsonPath("$.reserved_seats[2].train_car_number").value(10))
                .andExpect(jsonPath("$.reserved_seats[0].seat_number").value(1))
                .andExpect(jsonPath("$.reserved_seats[1].seat_number").value(1))
                .andExpect(jsonPath("$.reserved_seats[2].seat_number").value(1))
                .andExpect(jsonPath("$.reserved_seats[0].seat_column").value("A"))
                .andExpect(jsonPath("$.reserved_seats[1].seat_column").value("A"))
                .andExpect(jsonPath("$.reserved_seats[2].seat_column").value("A"))
                .andExpect(jsonPath("$.reserved_seats[0].code_token").value("60a1ab63-a41f-430d-a2d1-10a76368d0f5"))
                .andExpect(jsonPath("$.reserved_seats[1].code_token").value("3de8909e-32de-478e-bd9b-739f3fe6d6c3"))
                .andExpect(jsonPath("$.reserved_seats[2].code_token").value("e192e5f1-318e-4d10-b76d-2f2bf15e8b70"));
    }

    @Test
    @DisplayName("リクエストがNullの場合、パラメーターエラー発生")
    void getReservation_withPurchaseIdIsNull_returnRequestParamError() throws Exception {
        String url = baseUrl + "?";

        mockMvc.perform(get(url))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("purchaseId is Null"));

    }
}
