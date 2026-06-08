package com.shinkansendego.demo.features.schedule.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.shinkansendego.demo.features.schedule.dtos.ScheduleRequestDto;
import com.shinkansendego.demo.features.schedule.dtos.ScheduleResponseDto;
import com.shinkansendego.demo.features.schedule.servicies.ScheduleService;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ScheduleController.class)
public class ScheduleControllerTest {
    private final ScheduleRequestDto request = new ScheduleRequestDto();
    // TODO:@Autowiredに変更する
    private final ObjectMapper objectMapper = new ObjectMapper();
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private ScheduleService service;

    private static @NonNull List<ScheduleResponseDto> getExpectScheduleResponseDtosList() {
        ScheduleResponseDto expect01 = new ScheduleResponseDto("やまびこ2号", LocalTime.of(11, 0, 0), LocalTime.of(16, 10, 0));
        ScheduleResponseDto expect02 = new ScheduleResponseDto("やまびこ3号", LocalTime.of(12, 0, 0), LocalTime.of(12, 30, 0));
        ScheduleResponseDto expect03 = new ScheduleResponseDto("やまびこ4号", LocalTime.of(13, 0, 0), LocalTime.of(13, 40, 0));
        ScheduleResponseDto expect04 = new ScheduleResponseDto("やまびこ6号", LocalTime.of(15, 0, 0), LocalTime.of(16, 0, 0));
        List<ScheduleResponseDto> expectList = Arrays.asList(expect01, expect02, expect03, expect04);
        return expectList;
    }

    @BeforeEach
    void setUp() {
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        request.setDate(LocalDate.of(2026, 6, 1));
        request.setTime(LocalTime.of(11, 0, 0));
        request.setDeparture_station_name("東京");
        request.setArrival_station_name("上野");
    }

    @Test
    @DisplayName("リクエストDTOからダイヤリストが取得できる")
    void getSchedule() throws Exception {

        List<ScheduleResponseDto> expectList = getExpectScheduleResponseDtosList();

        Mockito.when(service.getSearchedScheduleByStation(request)).thenReturn(expectList);

        String json = objectMapper.writeValueAsString(request);

        mockMvc.perform(
                        get("/api/shikansen-schedule")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[1].train_type_name").value("やまびこ3号"))
                .andExpect(jsonPath("$[1].departure_time").value("12:00:00"))
                .andExpect(jsonPath("$[1].arrival_time").value("12:30:00"));
    }

    @Test
    @DisplayName("リクエストのカラムがNullの場合、バリデーションエラー発生")
    void ReturnBadRequestWhenValidationError() throws Exception {

        request.setArrival_station_name(null);

        String json = objectMapper.writeValueAsString(request);

        mockMvc.perform(get("/api/shikansen-schedule")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }
}
