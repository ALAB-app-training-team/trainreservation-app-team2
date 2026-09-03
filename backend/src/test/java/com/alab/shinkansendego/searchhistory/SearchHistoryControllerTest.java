package com.alab.shinkansendego.searchhistory;

import com.alab.shinkansendego.SecurityConfig;
import com.alab.shinkansendego.account.AccountSessionDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SearchHistoryController.class)
@Import(SecurityConfig.class)
public class SearchHistoryControllerTest {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String baseUrl = "/api/searchhistory";
    private AccountSessionDto session;
    private Authentication auth;
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private SearchHistoryService service;

    private SearchHistoryDto createSearchHistoryDto(
        UUID id, LocalDate date, LocalTime time, String departureStationCd, String arrivalStationCd, Boolean isArrivalTime
    ) {
        SearchHistoryDto dto = new SearchHistoryDto();
        dto.setId(id);
        dto.setDate(date);
        dto.setTime(time);
        dto.setDepartureStationCd(departureStationCd);
        dto.setArrivalStationCd(arrivalStationCd);
        dto.setIsArrivalTime(isArrivalTime);
        return dto;
    }

    @BeforeEach
    void setUp() {
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        session = new AccountSessionDto(
            UUID.fromString("f79d8bbc-fcba-b538-b132-2f726ce0120c"), "test-common@test.com", "一般太郎"
        );
        auth = new UsernamePasswordAuthenticationToken(session, null, Collections.emptyList());
    }

    @Test
    @DisplayName("認証済みの場合、検索履歴一覧を取得できる")
    void getSearchHistory_withSession_returnSearchHistoryList() throws Exception {
        SearchHistoryDto history1 = new SearchHistoryDto(
            UUID.fromString("4156b939-2e3e-46c1-92d3-7aa64b6ca575"),
            LocalDate.of(2026, 8, 3), LocalTime.of(8, 30, 0), "THK01", "THK09", false,
            Timestamp.from(Instant.parse("2026-08-03T00:00:00Z"))
        );
        SearchHistoryDto history2 = new SearchHistoryDto(
            UUID.fromString("3136b939-2e3e-46c1-92d3-7aa64b6ca666"),
            LocalDate.of(2026, 8, 8), LocalTime.of(12, 0, 0), "CMN01", "CMN03", true,
            Timestamp.from(Instant.parse("2026-08-08T00:00:00Z"))
        );
        Mockito.when(service.getSearchHistory(session.getId())).thenReturn(List.of(history1, history2));

        mockMvc.perform(
                get(baseUrl)
                    .with(SecurityMockMvcRequestPostProcessors.authentication(auth))
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(2))
            .andExpect(jsonPath("$[0].id").value("4156b939-2e3e-46c1-92d3-7aa64b6ca575"))
            .andExpect(jsonPath("$[0].date").value("2026-08-03"))
            .andExpect(jsonPath("$[0].time").value("08:30:00"))
            .andExpect(jsonPath("$[0].departureStationCd").value("THK01"))
            .andExpect(jsonPath("$[0].arrivalStationCd").value("THK09"))
            .andExpect(jsonPath("$[0].isArrivalTime").value(false))
            .andExpect(jsonPath("$[1].id").value("3136b939-2e3e-46c1-92d3-7aa64b6ca666"))
            .andExpect(jsonPath("$[1].date").value("2026-08-08"))
            .andExpect(jsonPath("$[1].time").value("12:00:00"))
            .andExpect(jsonPath("$[1].departureStationCd").value("CMN01"))
            .andExpect(jsonPath("$[1].arrivalStationCd").value("CMN03"))
            .andExpect(jsonPath("$[1].isArrivalTime").value(true));
    }

    @Test
    @DisplayName("検索履歴が無い場合、空のリストを返す")
    void getSearchHistory_withNoHistory_returnEmptyList() throws Exception {
        Mockito.when(service.getSearchHistory(session.getId())).thenReturn(List.of());

        mockMvc.perform(
                get(baseUrl)
                    .with(SecurityMockMvcRequestPostProcessors.authentication(auth))
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    @DisplayName("未ログインの場合、401エラーが発生する")
    void getSearchHistory_withNoSession_return401StatusCode() throws Exception {
        mockMvc.perform(
                get(baseUrl)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isUnauthorized())
            .andExpect(content().string("Unauthorized"));
    }

    @Test
    @DisplayName("認証済みの場合、検索履歴を保存してUUIDを返す")
    void recordSearchHistory_withSession_returnSavedId() throws Exception {
        SearchHistoryDto request = createSearchHistoryDto(
            null, LocalDate.of(2026, 9, 20), LocalTime.of(9, 0, 0), "THK01", "THK09", true
        );
        UUID savedId = UUID.randomUUID();

        Mockito.when(service.recordSearchHistory(request, session.getId())).thenReturn(savedId);

        mockMvc.perform(post(baseUrl)
                .with(SecurityMockMvcRequestPostProcessors.authentication(auth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(content().string("\"" + savedId + "\""));
    }

    @Test
    @DisplayName("リクエストボディが無い場合、バインドエラーが発生する")
    void recordSearchHistory_withNoRequestBody_returnBindError() throws Exception {
        mockMvc.perform(post(baseUrl)
                .with(SecurityMockMvcRequestPostProcessors.authentication(auth))
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("RequestBody is Required"));
    }

    @Test
    @DisplayName("未ログインの場合、401エラーが発生する")
    void recordSearchHistory_withNoSession_return401StatusCode() throws Exception {
        SearchHistoryDto request = createSearchHistoryDto(
            null, LocalDate.of(2026, 9, 20), LocalTime.of(9, 0, 0), "THK01", "THK09", true
        );

        mockMvc.perform(post(baseUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isUnauthorized())
            .andExpect(content().string("Unauthorized"));
    }
}
