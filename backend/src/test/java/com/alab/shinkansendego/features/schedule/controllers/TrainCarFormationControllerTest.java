package com.alab.shinkansendego.features.schedule.controllers;

import com.alab.shinkansendego.features.schedule.dtos.TrainCarFormationResponseDto;
import com.alab.shinkansendego.features.schedule.servicies.TrainCarFormationService;
import org.jspecify.annotations.NonNull;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TrainCarFormationController.class)
public class TrainCarFormationControllerTest {

    private final String baseUrl = "/api/shinkansen-";
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private TrainCarFormationService service;

    private static @NonNull List<TrainCarFormationResponseDto> getTrainCarResponseDtosList() {
        TrainCarFormationResponseDto expect01 = new TrainCarFormationResponseDto("E5SER01", 1, "SEAT01", "指定席");
        TrainCarFormationResponseDto expect02 = new TrainCarFormationResponseDto("E5SER02", 2, "SEAT01", "指定席");

        return Arrays.asList(expect01, expect02);
    }

    @Test
    @DisplayName("ダイヤコードを指定して車両編成が取得できる")
    void getTrainCarList_returnTrainCarListSuccess() throws Exception {

        String scheduleCd = "TEST01";
        List<TrainCarFormationResponseDto> expectList = getTrainCarResponseDtosList();
        String url = baseUrl + "traincar";

        Mockito.when(service.getTrainCarList(scheduleCd)).thenReturn(expectList);

        mockMvc.perform(
                        get(url).param("schedule_cd", scheduleCd)
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))

                .andExpect(jsonPath("$[0].train_car_cd").value("E5SER01"))
                .andExpect(jsonPath("$[0].train_car_number").value(1))
                .andExpect(jsonPath("$[0].seat_type_cd").value("SEAT01"))
                .andExpect(jsonPath("$[0].train_car_type_name").value("指定席"))

                .andExpect(jsonPath("$[1].train_car_cd").value("E5SER02"))
                .andExpect(jsonPath("$[1].train_car_number").value(2))
                .andExpect(jsonPath("$[1].seat_type_cd").value("SEAT01"))
                .andExpect(jsonPath("$[1].train_car_type_name").value("指定席"));
    }
}
