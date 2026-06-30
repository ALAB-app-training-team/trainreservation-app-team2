package com.alab.shinkansendego.features.schedule.controllers;

import com.alab.shinkansendego.features.schedule.dtos.StationResponseDto;
import com.alab.shinkansendego.features.schedule.servicies.StationService;
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

@WebMvcTest(StationController.class)
public class StationControllerTest {

    private final String baseUrl = "/api/shinkansen-";
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private StationService service;

    private static @NonNull List<StationResponseDto> getStationResponseDtosList() {
        StationResponseDto expect01 = new StationResponseDto("Test1", "TestStation01");
        StationResponseDto expect02 = new StationResponseDto("Test2", "TestStation02");
        StationResponseDto expect03 = new StationResponseDto("Test3", "TestStation03");
        StationResponseDto expect04 = new StationResponseDto("Test4", "TestStation04");
        return Arrays.asList(expect01, expect02, expect03, expect04);
    }

    @Test
    @DisplayName("駅コードと駅名が全件取得できる")
    void getAllStationList_returnGetStationListSuccess() throws Exception {

        List<StationResponseDto> expectList = getStationResponseDtosList();
        String url = baseUrl + "station";

        Mockito.when(service.getAllStationList()).thenReturn(expectList);

        mockMvc.perform(
                        get(url).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[0].station_cd").value("Test1"))
                .andExpect(jsonPath("$[1].station_cd").value("Test2"))
                .andExpect(jsonPath("$[2].station_cd").value("Test3"))
                .andExpect(jsonPath("$[3].station_cd").value("Test4"))
                .andExpect(jsonPath("$[0].name").value("TestStation01"))
                .andExpect(jsonPath("$[1].name").value("TestStation02"))
                .andExpect(jsonPath("$[2].name").value("TestStation03"))
                .andExpect(jsonPath("$[3].name").value("TestStation04"));
    }
}
