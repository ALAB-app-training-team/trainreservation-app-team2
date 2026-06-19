package com.alab.shinkansendego.features.schedule.controllers;

import com.alab.shinkansendego.features.schedule.dtos.SeatRequestDto;
import com.alab.shinkansendego.features.schedule.dtos.SeatResponseDto;
import com.alab.shinkansendego.features.schedule.servicies.SeatService;
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

@WebMvcTest(SeatController.class)
public class SeatControllerTest {

    private final String baseUrl = "/api/shinkansen-";
    private final SeatRequestDto request = new SeatRequestDto();
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private SeatService service;

    private static @NonNull List<SeatResponseDto> getSeatResponseDtosList() {
        SeatResponseDto expect01 = new SeatResponseDto("Test001", 1, "TestSeat1", 1, "T", false);
        SeatResponseDto expect02 = new SeatResponseDto("Test001", 1, "TestSeat2", 2, "E", false);
        SeatResponseDto expect03 = new SeatResponseDto("Test001", 1, "TestSeat3", 3, "S", true);
        SeatResponseDto expect04 = new SeatResponseDto("Test001", 1, "TestSeat4", 4, "T", false);
        return Arrays.asList(expect01, expect02, expect03, expect04);
    }

    @BeforeEach
    void setUp() {
        request.setSchedule_cd("Test01");
        request.setDate(LocalDate.of(2026, 6, 1));
        request.setDeparture_station_cd("Test1");
        request.setDeparture_time(LocalTime.of(12, 0, 0));
        request.setArrival_station_cd("Test2");
        request.setArrival_time(LocalTime.of(13, 0, 0));
        request.setTrain_car_cd("Test001");
    }

    @Test
    @DisplayName("号車コードから号車内の座席リストが取得できる")
    void getSeatList_returnGetSeatListSuccess() throws Exception {

        List<SeatResponseDto> expectList = getSeatResponseDtosList();
        String url = baseUrl + "seat?trainCarCd=Test001";

        Mockito.when(service.getSeatListByTrainCar(request)).thenReturn(expectList);

        mockMvc.perform(
                        get(url).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[0].train_car_cd").value("Test001"))
                .andExpect(jsonPath("$[1].train_car_cd").value("Test001"))
                .andExpect(jsonPath("$[2].train_car_cd").value("Test001"))
                .andExpect(jsonPath("$[3].train_car_cd").value("Test001"))
                .andExpect(jsonPath("$[0].train_car_number").value(1))
                .andExpect(jsonPath("$[1].train_car_number").value(1))
                .andExpect(jsonPath("$[2].train_car_number").value(1))
                .andExpect(jsonPath("$[3].train_car_number").value(1))
                .andExpect(jsonPath("$[0].seat_cd").value("TestSeat1"))
                .andExpect(jsonPath("$[1].seat_cd").value("TestSeat2"))
                .andExpect(jsonPath("$[2].seat_cd").value("TestSeat3"))
                .andExpect(jsonPath("$[3].seat_cd").value("TestSeat4"))
                .andExpect(jsonPath("$[0].seat_number").value(1))
                .andExpect(jsonPath("$[1].seat_number").value(2))
                .andExpect(jsonPath("$[2].seat_number").value(3))
                .andExpect(jsonPath("$[3].seat_number").value(4))
                .andExpect(jsonPath("$[0].seat_column").value("T"))
                .andExpect(jsonPath("$[1].seat_column").value("E"))
                .andExpect(jsonPath("$[2].seat_column").value("S"))
                .andExpect(jsonPath("$[3].seat_column").value("T"));
    }

    @Test
    @DisplayName("リクエストがNullの場合、パラメーターエラー発生")
    void getSeatList_withTrainCarCdIsNull_returnRequestParamError() throws Exception {

        String url = baseUrl + "seat?";

        mockMvc.perform(get(url))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("trainCarCd is Null"));
    }
}
