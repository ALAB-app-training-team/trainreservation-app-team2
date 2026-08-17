package com.alab.shinkansendego.schedule;

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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ScheduleController.class)
public class ScheduleControllerTest {
    private final ScheduleRequestDto request = new ScheduleRequestDto();
    // TODO:リクエストのLocalDateとの相性が悪くエラーが出たため以下処理としたが、@Autowiredが推奨されるためいつか変更したい
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String baseUrl = "/api/schedules";
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private ScheduleService service;

    private static @NonNull List<ScheduleResponseDto> getExpectScheduleResponseDtosList() {
        ScheduleResponseDto expect01 = new ScheduleResponseDto("THK001", "やまびこ2号", LocalTime.of(11, 0, 0), LocalTime.of(16, 10, 0), 30, 20, 10);
        ScheduleResponseDto expect02 = new ScheduleResponseDto("THK002", "やまびこ3号", LocalTime.of(12, 0, 0), LocalTime.of(12, 30, 0), 30, 20, 10);
        ScheduleResponseDto expect03 = new ScheduleResponseDto("THK003", "やまびこ4号", LocalTime.of(13, 0, 0), LocalTime.of(13, 40, 0), 30, 20, 10);
        ScheduleResponseDto expect04 = new ScheduleResponseDto("THK004", "やまびこ6号", LocalTime.of(15, 0, 0), LocalTime.of(16, 0, 0), 30, 20, 10);
        return Arrays.asList(expect01, expect02, expect03, expect04);
    }

    private static @NonNull List<TrainCarFormationResponseDto> getTrainCarResponseDtosList() {
        TrainCarFormationResponseDto expect01 = new TrainCarFormationResponseDto("E5SER01", 1, "SEAT01", "指定席");
        TrainCarFormationResponseDto expect02 = new TrainCarFormationResponseDto("E5SER02", 2, "SEAT01", "指定席");

        return Arrays.asList(expect01, expect02);
    }

    @BeforeEach
    void setUp() {
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        request.setDate(LocalDate.of(2026, 6, 1));
        request.setDepartureStationCd("THK01");
        request.setArrivalStationCd("THK02");
    }

    @Test
    @DisplayName("リクエストDTOからダイヤリストが取得できる")
    void getSchedule_withValidScheduleRequestDto_returnGetScheduleListSuccess() throws Exception {

        List<ScheduleResponseDto> expectList = getExpectScheduleResponseDtosList();
        String url = baseUrl + "?date=2026-06-01&time=12:00:00&departureStationCd=THK01&arrivalStationCd=THK02";

        Mockito.when(service.getSearchedScheduleByStation(request)).thenReturn(expectList);

        String json = objectMapper.writeValueAsString(request);

        mockMvc.perform(
                get(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(4))
            .andExpect(jsonPath("$[0].scheduleCd").value("THK001"))
            .andExpect(jsonPath("$[1].scheduleCd").value("THK002"))
            .andExpect(jsonPath("$[2].scheduleCd").value("THK003"))
            .andExpect(jsonPath("$[3].scheduleCd").value("THK004"))
            .andExpect(jsonPath("$[0].trainTypeName").value("やまびこ2号"))
            .andExpect(jsonPath("$[1].trainTypeName").value("やまびこ3号"))
            .andExpect(jsonPath("$[2].trainTypeName").value("やまびこ4号"))
            .andExpect(jsonPath("$[3].trainTypeName").value("やまびこ6号"))
            .andExpect(jsonPath("$[0].departureTime").value("11:00:00"))
            .andExpect(jsonPath("$[1].departureTime").value("12:00:00"))
            .andExpect(jsonPath("$[2].departureTime").value("13:00:00"))
            .andExpect(jsonPath("$[3].departureTime").value("15:00:00"))
            .andExpect(jsonPath("$[0].arrivalTime").value("16:10:00"))
            .andExpect(jsonPath("$[1].arrivalTime").value("12:30:00"))
            .andExpect(jsonPath("$[2].arrivalTime").value("13:40:00"))
            .andExpect(jsonPath("$[3].arrivalTime").value("16:00:00"));
    }

    @Test
    @DisplayName("リクエストのカラムがNullの場合、バリデーションエラー発生")
    void getSchedule_withNotValidScheduleRequestDto_returnValidationError() throws Exception {

        request.setArrivalStationCd(null);
        String url = baseUrl + "?date=2026-06-01&time=12:00:00&departureStationCd=THK01";

        String json = objectMapper.writeValueAsString(request);

        mockMvc.perform(get(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("ArrivalStationCd is Null"));
    }

    @Test
    @DisplayName("リクエストDTO自体がNullの場合、バインドエラー発生")
    void getSchedule_withScheduleRequestDtoIsNull_returnBindError() throws Exception {

        String url = baseUrl + "?";

        //バインド順が毎回異なるためエラーメッセージの比較は行わない
        mockMvc.perform(get(url))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("ダイヤコードを指定して車両編成が取得できる")
    void getTrainCarList_returnTrainCarListSuccess() throws Exception {

        String scheduleCd = "TEST01";
        List<TrainCarFormationResponseDto> expectList = getTrainCarResponseDtosList();
        String url = baseUrl + "/" + scheduleCd + "/traincars";

        Mockito.when(service.getTrainCarList(scheduleCd)).thenReturn(expectList);

        mockMvc.perform(
                get(url)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(2))

            .andExpect(jsonPath("$[0].trainCarCd").value("E5SER01"))
            .andExpect(jsonPath("$[0].trainCarNumber").value(1))
            .andExpect(jsonPath("$[0].seatTypeCd").value("SEAT01"))
            .andExpect(jsonPath("$[0].trainCarTypeName").value("指定席"))

            .andExpect(jsonPath("$[1].trainCarCd").value("E5SER02"))
            .andExpect(jsonPath("$[1].trainCarNumber").value(2))
            .andExpect(jsonPath("$[1].seatTypeCd").value("SEAT01"))
            .andExpect(jsonPath("$[1].trainCarTypeName").value("指定席"));
    }
}
