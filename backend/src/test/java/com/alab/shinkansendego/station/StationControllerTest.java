package com.alab.shinkansendego.station;

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

    private static @NonNull List<StationEntity> getStationEntityList() {
        StationEntity expect01 = new StationEntity("Test1", "TestStation01");
        StationEntity expect02 = new StationEntity("Test2", "TestStation02");
        StationEntity expect03 = new StationEntity("Test3", "TestStation03");
        StationEntity expect04 = new StationEntity("Test4", "TestStation04");
        return Arrays.asList(expect01, expect02, expect03, expect04);
    }

    @Test
    @DisplayName("駅コードと駅名が全件取得できる")
    void getAllStationList_returnGetStationListSuccess() throws Exception {

        List<StationEntity> expectList = getStationEntityList();
        String url = baseUrl + "station";

        Mockito.when(service.getAllStationList()).thenReturn(expectList);

        mockMvc.perform(
                        get(url).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[0].stationCd").value("Test1"))
                .andExpect(jsonPath("$[1].stationCd").value("Test2"))
                .andExpect(jsonPath("$[2].stationCd").value("Test3"))
                .andExpect(jsonPath("$[3].stationCd").value("Test4"))
                .andExpect(jsonPath("$[0].name").value("TestStation01"))
                .andExpect(jsonPath("$[1].name").value("TestStation02"))
                .andExpect(jsonPath("$[2].name").value("TestStation03"))
                .andExpect(jsonPath("$[3].name").value("TestStation04"));
    }
}
