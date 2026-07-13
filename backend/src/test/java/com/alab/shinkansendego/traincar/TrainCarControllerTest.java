package com.alab.shinkansendego.traincar;

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

@WebMvcTest(TrainCarController.class)
public class TrainCarControllerTest {

    private final String baseUrl = "/api/traincars/";
    private final SeatRequestDto request = new SeatRequestDto();

    // TODO:リクエストのLocalDateとの相性が悪くエラーが出たため以下処理としたが、@Autowiredが推奨されるためいつか変更したい
    private final ObjectMapper objectMapper = new ObjectMapper();
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private TrainCarService service;

    private static @NonNull List<SeatResponseDto> getSeatResponseDtosList() {
        SeatResponseDto expect01 = new SeatResponseDto("Test001", 1, "TestSeat1", 1, "T", false);
        SeatResponseDto expect02 = new SeatResponseDto("Test001", 1, "TestSeat2", 2, "E", true);
        SeatResponseDto expect03 = new SeatResponseDto("Test001", 1, "TestSeat3", 3, "S", false);
        SeatResponseDto expect04 = new SeatResponseDto("Test001", 1, "TestSeat4", 4, "T", true);
        return Arrays.asList(expect01, expect02, expect03, expect04);
    }

    @BeforeEach
    void setUp() {
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        request.setScheduleCd("Test01");
        request.setDate(LocalDate.of(2026, 6, 1));
        request.setDepartureTime(LocalTime.of(12, 0, 0));
        request.setArrivalTime(LocalTime.of(13, 0, 0));
        request.setTrainCarCd("Test001");
    }

    @Test
    @DisplayName("号車コードから号車内の座席リストが取得できる")
    void getSeatList_returnGetSeatListSuccess() throws Exception {

        List<SeatResponseDto> expectList = getSeatResponseDtosList();
        String url = baseUrl + "Test001/seats"
                + "?scheduleCd=Test01&date=2026-06-01&departureTime=12:00:00&arrivalTime=13:00:00";

        Mockito.when(service.getSeatListWithReserved("Test001", request)).thenReturn(expectList);

        mockMvc.perform(
                        get(url).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[0].trainCarCd").value("Test001"))
                .andExpect(jsonPath("$[1].trainCarCd").value("Test001"))
                .andExpect(jsonPath("$[2].trainCarCd").value("Test001"))
                .andExpect(jsonPath("$[3].trainCarCd").value("Test001"))
                .andExpect(jsonPath("$[0].trainCarNumber").value(1))
                .andExpect(jsonPath("$[1].trainCarNumber").value(1))
                .andExpect(jsonPath("$[2].trainCarNumber").value(1))
                .andExpect(jsonPath("$[3].trainCarNumber").value(1))
                .andExpect(jsonPath("$[0].seatCd").value("TestSeat1"))
                .andExpect(jsonPath("$[1].seatCd").value("TestSeat2"))
                .andExpect(jsonPath("$[2].seatCd").value("TestSeat3"))
                .andExpect(jsonPath("$[3].seatCd").value("TestSeat4"))
                .andExpect(jsonPath("$[0].seatNumber").value(1))
                .andExpect(jsonPath("$[1].seatNumber").value(2))
                .andExpect(jsonPath("$[2].seatNumber").value(3))
                .andExpect(jsonPath("$[3].seatNumber").value(4))
                .andExpect(jsonPath("$[0].seatColumn").value("T"))
                .andExpect(jsonPath("$[1].seatColumn").value("E"))
                .andExpect(jsonPath("$[2].seatColumn").value("S"))
                .andExpect(jsonPath("$[3].seatColumn").value("T"))
                .andExpect(jsonPath("$[0].isReserved").value(false))
                .andExpect(jsonPath("$[1].isReserved").value(true))
                .andExpect(jsonPath("$[2].isReserved").value(false))
                .andExpect(jsonPath("$[3].isReserved").value(true));
    }

    @Test
    @DisplayName("リクエストのカラムがNullの場合、バリデーションエラー発生")
    void getSeatList_withNotValidSeatRequestDto_returnValidationError() throws Exception {

        request.setScheduleCd(null);
        String url = baseUrl + "Test001/seats"
                + "?date=2026-06-23&departureTime=17:20:00&arrivalTime=20:40:00";

        String json = objectMapper.writeValueAsString(request);

        mockMvc.perform(get(url)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("ScheduleCd is Null"));
    }

    @Test
    @DisplayName("リクエストDTO自体がNullの場合、パラメーターエラー発生")
    void getSeatList_withSeatRequestDtoIsNull_returnRequestParamError() throws Exception {

        String url = baseUrl+ "Test001/seats";

        mockMvc.perform(get(url))
                .andExpect(status().isBadRequest());
    }
}
