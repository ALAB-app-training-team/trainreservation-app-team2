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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

    private static @NonNull SeatResponseDto getSeatResponse() {
        SeatDto expect01 = new SeatDto("Test001", 1, "CAR01", "TestSeat1", 1, "T", 0, false);
        SeatDto expect02 = new SeatDto("Test001", 1, "CAR01", "TestSeat2", 2, "E", 0, true);
        SeatDto expect03 = new SeatDto("Test001", 1, "CAR01", "TestSeat3", 3, "S", 0, false);
        SeatDto expect04 = new SeatDto("Test001", 1, "CAR01", "TestSeat4", 4, "T", 0, true);
        return new SeatResponseDto(null, null, Arrays.asList(expect01, expect02, expect03, expect04));
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

        SeatResponseDto expect = getSeatResponse();
        String url = baseUrl
            + "seats?trainCarCd=Test001&scheduleCd=Test01&date=2026-06-01&departureTime=12:00:00&arrivalTime=13:00:00";

        Mockito.when(service.getSeatListWithReserved(request)).thenReturn(expect);

        mockMvc.perform(
                get(url).contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.seats.length()").value(4))
            .andExpect(jsonPath("$.seats[0].trainCarCd").value("Test001"))
            .andExpect(jsonPath("$.seats[1].trainCarCd").value("Test001"))
            .andExpect(jsonPath("$.seats[2].trainCarCd").value("Test001"))
            .andExpect(jsonPath("$.seats[3].trainCarCd").value("Test001"))
            .andExpect(jsonPath("$.seats[0].trainCarNumber").value(1))
            .andExpect(jsonPath("$.seats[1].trainCarNumber").value(1))
            .andExpect(jsonPath("$.seats[2].trainCarNumber").value(1))
            .andExpect(jsonPath("$.seats[3].trainCarNumber").value(1))
            .andExpect(jsonPath("$.seats[0].seatCd").value("TestSeat1"))
            .andExpect(jsonPath("$.seats[1].seatCd").value("TestSeat2"))
            .andExpect(jsonPath("$.seats[2].seatCd").value("TestSeat3"))
            .andExpect(jsonPath("$.seats[3].seatCd").value("TestSeat4"))
            .andExpect(jsonPath("$.seats[0].seatNumber").value(1))
            .andExpect(jsonPath("$.seats[1].seatNumber").value(2))
            .andExpect(jsonPath("$.seats[2].seatNumber").value(3))
            .andExpect(jsonPath("$.seats[3].seatNumber").value(4))
            .andExpect(jsonPath("$.seats[0].seatColumn").value("T"))
            .andExpect(jsonPath("$.seats[1].seatColumn").value("E"))
            .andExpect(jsonPath("$.seats[2].seatColumn").value("S"))
            .andExpect(jsonPath("$.seats[3].seatColumn").value("T"))
            .andExpect(jsonPath("$.seats[0].isReserved").value(false))
            .andExpect(jsonPath("$.seats[1].isReserved").value(true))
            .andExpect(jsonPath("$.seats[2].isReserved").value(false))
            .andExpect(jsonPath("$.seats[3].isReserved").value(true));
    }

    @Test
    @DisplayName("リクエストのカラムがNullの場合、バリデーションエラー発生")
    void getSeatList_withNotValidSeatRequestDto_returnValidationError() throws Exception {

        request.setTrainCarCd(null);
        String url = baseUrl
            + "seats?scheduleCd=Test01&date=2026-06-23&departureTime=17:20:00&arrivalTime=20:40:00";

        String json = objectMapper.writeValueAsString(request);

        mockMvc.perform(get(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("TrainCarCd is Null"));
    }

    @Test
    @DisplayName("リクエストDTO自体がNullの場合、パラメーターエラー発生")
    void getSeatList_withSeatRequestDtoIsNull_returnRequestParamError() throws Exception {

        String url = baseUrl + "seats";

        mockMvc.perform(get(url))
            .andExpect(status().isBadRequest());
    }
}
