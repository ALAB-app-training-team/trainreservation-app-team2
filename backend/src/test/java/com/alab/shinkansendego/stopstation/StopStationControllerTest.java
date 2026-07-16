package com.alab.shinkansendego.stopstation;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(StopStationController.class)
public class StopStationControllerTest {
    private final String baseUrl = "/api/stopstations";
    @MockitoBean
    private StopStationService stopStationService;
    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("すべての駅の情報を取得することができる")
    void getStopStations_returnAllStopStations() throws Exception {
        List<StationResponseDto> dtos = List.of(
            new StationResponseDto("THK01", "東京", List.of("HB", "MY", "NS")),
            new StationResponseDto("THK02", "上野", List.of("HB", "MY", "NS"))
        );
        when(stopStationService.getStopStationsWithoutTransfer()).thenReturn(dtos);

        mockMvc.perform(get(baseUrl)
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].stationCd").value("THK01"))
            .andExpect(jsonPath("$[1].stationCd").value("THK02")
            );
    }
}
