package com.alab.shinkansendego.features.reservation.controllers;

import com.alab.shinkansendego.features.reservation.dtos.ReservationResponseDto;
import com.alab.shinkansendego.features.reservation.services.ReservationService;
import com.alab.shinkansendego.features.schedule.controllers.ScheduleController;
import com.alab.shinkansendego.features.schedule.dtos.ScheduleRequestDto;
import com.alab.shinkansendego.features.schedule.dtos.ReservationResponseDto;
import com.alab.shinkansendego.features.schedule.servicies.ScheduleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.jspecify.annotations.NonNull;
import org.junit.jupiter.api.BeforeEach;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReservationController.class)
public class ReservationControllerTest {

    private final String baseUrl = "/api/shinkansen-reservation";
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private ReservationService service;

    private static @NonNull List<ReservationResponseDto> getExpectReservationResponseDtosList() {
        ReservationResponseDto expect01 = new ReservationResponseDto("THK001", "やまびこ2号", LocalTime.of(11, 0, 0), LocalTime.of(16, 10, 0));
        ReservationResponseDto expect02 = new ReservationResponseDto("THK002", "やまびこ3号", LocalTime.of(12, 0, 0), LocalTime.of(12, 30, 0));
        ReservationResponseDto expect03 = new ReservationResponseDto("THK003", "やまびこ4号", LocalTime.of(13, 0, 0), LocalTime.of(13, 40, 0));
        ReservationResponseDto expect04 = new ReservationResponseDto("THK004", "やまびこ6号", LocalTime.of(15, 0, 0), LocalTime.of(16, 0, 0));
        return Arrays.asList(expect01, expect02, expect03, expect04);
    }

    @Test
    @DisplayName("購入情報IDから予約チケット情報が取得できる")
    void getReservation_withValidScheduleRequestDto_returnGetScheduleListSuccess() throws Exception {

        List<ReservationResponseDto> expectList = getExpectReservationResponseDtosList();
        String url = baseUrl + "?date=2026-06-01&time=12:00:00&departure_station_cd=THK01&arrival_station_cd=THK02";

        Mockito.when(service.getSearchedScheduleByStation(request)).thenReturn(expectList);

        String json = objectMapper.writeValueAsString(request);

        mockMvc.perform(
                        get(url)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[0].schedule_cd").value("THK001"))
                .andExpect(jsonPath("$[1].schedule_cd").value("THK002"))
                .andExpect(jsonPath("$[2].schedule_cd").value("THK003"))
                .andExpect(jsonPath("$[3].schedule_cd").value("THK004"))
                .andExpect(jsonPath("$[0].train_type_name").value("やまびこ2号"))
                .andExpect(jsonPath("$[1].train_type_name").value("やまびこ3号"))
                .andExpect(jsonPath("$[2].train_type_name").value("やまびこ4号"))
                .andExpect(jsonPath("$[3].train_type_name").value("やまびこ6号"))
                .andExpect(jsonPath("$[0].departure_time").value("11:00:00"))
                .andExpect(jsonPath("$[1].departure_time").value("12:00:00"))
                .andExpect(jsonPath("$[2].departure_time").value("13:00:00"))
                .andExpect(jsonPath("$[3].departure_time").value("15:00:00"))
                .andExpect(jsonPath("$[0].arrival_time").value("16:10:00"))
                .andExpect(jsonPath("$[1].arrival_time").value("12:30:00"))
                .andExpect(jsonPath("$[2].arrival_time").value("13:40:00"))
                .andExpect(jsonPath("$[3].arrival_time").value("16:00:00"));
    }

    @Test
    @DisplayName("リクエストのカラムがNullの場合、バリデーションエラー発生")
    void getSchedule_withNotValidScheduleRequestDto_returnValidationError() throws Exception {

        request.setArrival_station_cd(null);
        String url = baseUrl + "?date=2026-06-01&time=12:00:00&departure_station_cd=THK01";

        String json = objectMapper.writeValueAsString(request);

        mockMvc.perform(get(url)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("ArrivalStationCd is Null"));
    }

    @Test
    @DisplayName("リクエストDTO自体がNullの場合、バインドエラー発生")
    void getSchedule_withScheduleRequestDtoIsNull_returnBindError() throws Exception {

        String url = baseUrl + "?";

        //バインド順が毎回異なるためエラーメッセージの比較は行わない
        mockMvc.perform(get(url))
                .andExpect(status().isBadRequest());
    }
}
