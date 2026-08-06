package com.alab.shinkansendego.reservedseat;

import com.alab.shinkansendego.account.AccountSessionDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReservedSeatController.class)
@ExtendWith(SpringExtension.class)
@ContextConfiguration
public class ReservedSeatControllerTest {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String baseUrl = "/api/reservedseats";
    private AccountSessionDto session;
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private ReservedSeatService service;
    UUID reservationId = UUID.randomUUID();
    List<ReservedSeatUpdateDto> updateRequest = List.of(new ReservedSeatUpdateDto(UUID.randomUUID(), "一般次郎", "test2-common@test.com"));

    @BeforeEach
    void setUp() {
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        session = new AccountSessionDto(
            UUID.fromString("f79d8bbc-fcba-b538-b132-2f726ce0120c"), "test-common@test.com", "一般太郎"
        );
    }

    @Test
    @DisplayName("ログインユーザーが同行者を割り当てできる")
    void updateReservedSeats_withAuthorized_return204() throws Exception {
        Authentication auth = new UsernamePasswordAuthenticationToken(session, null, Collections.emptyList());
        String url = baseUrl + "/" + reservationId;

        mockMvc.perform(patch(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest))
                .with(SecurityMockMvcRequestPostProcessors.authentication(auth)))
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("ゲストユーザーが同行者を割り当てできる")
    void updateReservedSeats_withNotAuthorized_return204() throws Exception {
        String url = baseUrl + "/" + reservationId;

        mockMvc.perform(patch(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("予約IDがNullの場合、NotFoundを返す")
    void updateReservedSeats_withNoReservationId_return404() throws Exception {
        Authentication auth = new UsernamePasswordAuthenticationToken(session, null, Collections.emptyList());
        String url = baseUrl + "/";

        mockMvc.perform(patch(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest))
                .with(SecurityMockMvcRequestPostProcessors.authentication(auth)))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("ReservedSeatUpdateDtoがNullの場合、BadRequestを返す")
    void updateReservedSeats_withNoReservedSeatUpdateDto_return400() throws Exception {
        Authentication auth = new UsernamePasswordAuthenticationToken(session, null, Collections.emptyList());
        String url = baseUrl + "/" + reservationId;

        mockMvc.perform(patch(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(null))
                .with(SecurityMockMvcRequestPostProcessors.authentication(auth)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("ReservedSeatUpdateDtoが空のリストの場合、400を返す")
    void updateReservedSeats_withEmptyDto_return400() throws Exception {
        Authentication auth = new UsernamePasswordAuthenticationToken(session, null, Collections.emptyList());
        String url = baseUrl + "/" + reservationId;

        mockMvc.perform(patch(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new ArrayList<>()))
                .with(SecurityMockMvcRequestPostProcessors.authentication(auth)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("ReservedSeatUpdateDtoの一部がNullの場合、BadRequestを返す")
    void updateReservedSeats_withNoReservedSeatId_return400() throws Exception {
        Authentication auth = new UsernamePasswordAuthenticationToken(session, null, Collections.emptyList());
        String url = baseUrl + "/" + reservationId;
        updateRequest.getFirst().setId(null);

        mockMvc.perform(patch(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest))
                .with(SecurityMockMvcRequestPostProcessors.authentication(auth)))
            .andExpect(status().isBadRequest());
    }
}
