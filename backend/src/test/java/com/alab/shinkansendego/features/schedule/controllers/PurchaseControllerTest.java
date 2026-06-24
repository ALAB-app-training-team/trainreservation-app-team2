package com.alab.shinkansendego.features.schedule.controllers;

import com.alab.shinkansendego.features.schedule.dtos.ReserveRequestDto;
import com.alab.shinkansendego.features.schedule.servicies.PurchaseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
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
import java.util.List;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PurchaseController.class)
public class PurchaseControllerTest {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String baseUrl = "/api/shinkansen-reservation";
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private PurchaseService service;

    @BeforeEach
    void setUp() {
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Test
    @DisplayName("リクエストDTOからダイヤリストが取得できる")
    void purchaseSeats_withValidReserveRequestDto_return201AndPurchaseId() throws Exception {
        ReserveRequestDto request = new ReserveRequestDto(
                "Test01", LocalDate.now(), "Test0", "Test1", List.of(
                new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"),
                new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01002")
        ));
        UUID mockedPurchaseId = UUID.randomUUID();
        Mockito.when(service.purchaseSeats(request)).thenReturn(mockedPurchaseId);

        mockMvc.perform(post(baseUrl)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().string("\"" + mockedPurchaseId + "\""));
    }


    @Test
    @DisplayName("リクエストのカラムがNullの場合、バリデーションエラー発生")
    void purchaseSeats_withNotValidReserveRequestDto_returnValidationError() throws Exception {
        ReserveRequestDto request = new ReserveRequestDto(
                null, LocalDate.now(), "Test0", "Test1", List.of(
                new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"),
                new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01002")
        ));

        mockMvc.perform(post(baseUrl)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("ScheduleCd is Null"));
    }

    @Test
    @DisplayName("リクエストDTO自体がNullの場合、バインドエラー発生")
    void purchaseSeats_withReserveRequestDtoIsNull_returnBindError() throws Exception {
        //バインド順が毎回異なるためエラーメッセージの比較は行わない
        mockMvc.perform(post(baseUrl))
                .andExpect(status().isBadRequest());
    }
}
