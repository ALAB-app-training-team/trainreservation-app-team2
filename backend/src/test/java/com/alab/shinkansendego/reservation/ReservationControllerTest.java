package com.alab.shinkansendego.reservation;

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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReservationController.class)
public class ReservationControllerTest {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String baseUrl = "/api/reservations";
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private ReservationService service;

    private static @NonNull ReservationResponseDto getExpectReservationResponseDto(UUID reservationId) {
        ReservedSeatDto seat1 = new ReservedSeatDto("指定席", 1, 1, "A", UUID.fromString("60a1ab63-a41f-430d-a2d1-10a76368d0f5"), 5000);
        ReservedSeatDto seat2 = new ReservedSeatDto("グリーン車", 9, 1, "A", UUID.fromString("3de8909e-32de-478e-bd9b-739f3fe6d6c3"), 10000);
        ReservedSeatDto seat3 = new ReservedSeatDto("グランクラス", 10, 1, "A", UUID.fromString("e192e5f1-318e-4d10-b76d-2f2bf15e8b70"), 15000);
        List<ReservedSeatDto> reservedSeatList = Arrays.asList(seat1, seat2, seat3);
        return new ReservationResponseDto(
            reservationId,
            "やまびこ1号",
            "東京",
            LocalTime.of(12, 0, 0),
            "仙台",
            LocalTime.of(13, 0, 0),
            LocalDate.of(2026, 6, 1),
            false,
            reservedSeatList);
    }

    @BeforeEach
    void setUp() {
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Test
    @DisplayName("予約者氏名と予約者メールアドレスから予約情報の取得ができる")
    void getReservationList_withReserverNameAndEmail_returnGetReservationListSuccess() throws Exception {
        String email = "email@some.example.jp";
        String name = "山田太郎";
        List<ReservationResponseDto> expectList = Arrays.asList(
            getExpectReservationResponseDto(UUID.fromString("4156b939-2e3e-46c1-92d3-7aa64b6ca575")),
            getExpectReservationResponseDto(UUID.fromString("3136b939-2e3e-46c1-92d3-7aa64b6ca666")));

        Mockito.when(service.getReservationList(name, email)).thenReturn(expectList);

        mockMvc.perform(
                get(baseUrl + "?reserverName=" + name + "&reserverMail=" + email)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].reservationId").value("4156b939-2e3e-46c1-92d3-7aa64b6ca575"))
            .andExpect(jsonPath("$[0].trainTypeName").value("やまびこ1号"))
            .andExpect(jsonPath("$[0].departureStationName").value("東京"))
            .andExpect(jsonPath("$[0].departureTime").value("12:00:00"))
            .andExpect(jsonPath("$[0].arrivalStationName").value("仙台"))
            .andExpect(jsonPath("$[0].arrivalTime").value("13:00:00"))
            .andExpect(jsonPath("$[0].rideDate").value("2026-06-01"))
            .andExpect(jsonPath("$[0].reservedSeats.length()").value(3))
            .andExpect(jsonPath("$[0].reservedSeats[0].trainCarTypeName").value("指定席"))
            .andExpect(jsonPath("$[0].reservedSeats[1].trainCarTypeName").value("グリーン車"))
            .andExpect(jsonPath("$[0].reservedSeats[2].trainCarTypeName").value("グランクラス"))
            .andExpect(jsonPath("$[0].reservedSeats[0].trainCarNumber").value(1))
            .andExpect(jsonPath("$[0].reservedSeats[1].trainCarNumber").value(9))
            .andExpect(jsonPath("$[0].reservedSeats[2].trainCarNumber").value(10))
            .andExpect(jsonPath("$[0].reservedSeats[0].seatNumber").value(1))
            .andExpect(jsonPath("$[0].reservedSeats[1].seatNumber").value(1))
            .andExpect(jsonPath("$[0].reservedSeats[2].seatNumber").value(1))
            .andExpect(jsonPath("$[0].reservedSeats[0].seatColumn").value("A"))
            .andExpect(jsonPath("$[0].reservedSeats[1].seatColumn").value("A"))
            .andExpect(jsonPath("$[0].reservedSeats[2].seatColumn").value("A"))
            .andExpect(jsonPath("$[0].reservedSeats[0].codeToken").value("60a1ab63-a41f-430d-a2d1-10a76368d0f5"))
            .andExpect(jsonPath("$[0].reservedSeats[1].codeToken").value("3de8909e-32de-478e-bd9b-739f3fe6d6c3"))
            .andExpect(jsonPath("$[0].reservedSeats[2].codeToken").value("e192e5f1-318e-4d10-b76d-2f2bf15e8b70"))
            .andExpect(jsonPath("$[0].reservedSeats[0].seatFare").value(5000))
            .andExpect(jsonPath("$[0].reservedSeats[1].seatFare").value(10000))
            .andExpect(jsonPath("$[0].reservedSeats[2].seatFare").value(15000))
            .andExpect(jsonPath("$[1].reservationId").value("3136b939-2e3e-46c1-92d3-7aa64b6ca666"))
            .andExpect(jsonPath("$[1].trainTypeName").value("やまびこ1号"))
            .andExpect(jsonPath("$[1].departureStationName").value("東京"))
            .andExpect(jsonPath("$[1].departureTime").value("12:00:00"))
            .andExpect(jsonPath("$[1].arrivalStationName").value("仙台"))
            .andExpect(jsonPath("$[1].arrivalTime").value("13:00:00"))
            .andExpect(jsonPath("$[1].rideDate").value("2026-06-01"))
            .andExpect(jsonPath("$[1].reservedSeats.length()").value(3))
            .andExpect(jsonPath("$[1].reservedSeats[0].trainCarTypeName").value("指定席"))
            .andExpect(jsonPath("$[1].reservedSeats[1].trainCarTypeName").value("グリーン車"))
            .andExpect(jsonPath("$[1].reservedSeats[2].trainCarTypeName").value("グランクラス"))
            .andExpect(jsonPath("$[1].reservedSeats[0].trainCarNumber").value(1))
            .andExpect(jsonPath("$[1].reservedSeats[1].trainCarNumber").value(9))
            .andExpect(jsonPath("$[1].reservedSeats[2].trainCarNumber").value(10))
            .andExpect(jsonPath("$[1].reservedSeats[0].seatNumber").value(1))
            .andExpect(jsonPath("$[1].reservedSeats[1].seatNumber").value(1))
            .andExpect(jsonPath("$[1].reservedSeats[2].seatNumber").value(1))
            .andExpect(jsonPath("$[1].reservedSeats[0].seatColumn").value("A"))
            .andExpect(jsonPath("$[1].reservedSeats[1].seatColumn").value("A"))
            .andExpect(jsonPath("$[1].reservedSeats[2].seatColumn").value("A"))
            .andExpect(jsonPath("$[1].reservedSeats[0].codeToken").value("60a1ab63-a41f-430d-a2d1-10a76368d0f5"))
            .andExpect(jsonPath("$[1].reservedSeats[1].codeToken").value("3de8909e-32de-478e-bd9b-739f3fe6d6c3"))
            .andExpect(jsonPath("$[1].reservedSeats[2].codeToken").value("e192e5f1-318e-4d10-b76d-2f2bf15e8b70"))
            .andExpect(jsonPath("$[1].reservedSeats[0].seatFare").value(5000))
            .andExpect(jsonPath("$[1].reservedSeats[1].seatFare").value(10000))
            .andExpect(jsonPath("$[1].reservedSeats[2].seatFare").value(15000));
    }

    @Test
    @DisplayName("予約者氏名と予約者メールアドレスに該当する予約がない場合、空のリストを返す")
    void getReservationList_withNoMatchNameAndEmail_returnEmptyList() throws Exception {
        String email = "email@some.example.jp";
        String name = "山田太郎";
        List<ReservationResponseDto> expectList = new ArrayList<>();

        Mockito.when(service.getReservationList(name, email)).thenReturn(expectList);

        mockMvc.perform(
                get(baseUrl + "?reserverName=" + name + "&reserverMail=" + email)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    @DisplayName("予約情報IDと予約者氏名とメールアドレスから予約チケット情報が取得できる")
    void getReservation_withReservationIdAndReserverNameAndReserverMail_returnGetReservationSuccess() throws Exception {

        UUID request = UUID.fromString("4156b939-2e3e-46c1-92d3-7aa64b6ca575");
        ReservationResponseDto expect = getExpectReservationResponseDto(request);
        String url = baseUrl + "/4156b939-2e3e-46c1-92d3-7aa64b6ca575";

        Mockito.when(service.getReservation(request, "山田太郎", "email@sample.com")).thenReturn(expect);

        mockMvc.perform(
                get(url + "?reserverName=山田太郎&reserverMail=email@sample.com")
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.reservationId").value("4156b939-2e3e-46c1-92d3-7aa64b6ca575"))
            .andExpect(jsonPath("$.trainTypeName").value("やまびこ1号"))
            .andExpect(jsonPath("$.departureStationName").value("東京"))
            .andExpect(jsonPath("$.departureTime").value("12:00:00"))
            .andExpect(jsonPath("$.arrivalStationName").value("仙台"))
            .andExpect(jsonPath("$.arrivalTime").value("13:00:00"))
            .andExpect(jsonPath("$.rideDate").value("2026-06-01"))
            .andExpect(jsonPath("$.reservedSeats.length()").value(3))
            .andExpect(jsonPath("$.reservedSeats[0].trainCarTypeName").value("指定席"))
            .andExpect(jsonPath("$.reservedSeats[1].trainCarTypeName").value("グリーン車"))
            .andExpect(jsonPath("$.reservedSeats[2].trainCarTypeName").value("グランクラス"))
            .andExpect(jsonPath("$.reservedSeats[0].trainCarNumber").value(1))
            .andExpect(jsonPath("$.reservedSeats[1].trainCarNumber").value(9))
            .andExpect(jsonPath("$.reservedSeats[2].trainCarNumber").value(10))
            .andExpect(jsonPath("$.reservedSeats[0].seatNumber").value(1))
            .andExpect(jsonPath("$.reservedSeats[1].seatNumber").value(1))
            .andExpect(jsonPath("$.reservedSeats[2].seatNumber").value(1))
            .andExpect(jsonPath("$.reservedSeats[0].seatColumn").value("A"))
            .andExpect(jsonPath("$.reservedSeats[1].seatColumn").value("A"))
            .andExpect(jsonPath("$.reservedSeats[2].seatColumn").value("A"))
            .andExpect(jsonPath("$.reservedSeats[0].codeToken").value("60a1ab63-a41f-430d-a2d1-10a76368d0f5"))
            .andExpect(jsonPath("$.reservedSeats[1].codeToken").value("3de8909e-32de-478e-bd9b-739f3fe6d6c3"))
            .andExpect(jsonPath("$.reservedSeats[2].codeToken").value("e192e5f1-318e-4d10-b76d-2f2bf15e8b70"))
            .andExpect(jsonPath("$.reservedSeats[0].seatFare").value(5000))
            .andExpect(jsonPath("$.reservedSeats[1].seatFare").value(10000))
            .andExpect(jsonPath("$.reservedSeats[2].seatFare").value(15000));
    }

    @Test
    @DisplayName("idがNullの場合、NOTFOUNDを返す")
    void getReservation_withReservationIdIsNull_returnRequestParamError() throws Exception {
        String url = baseUrl + "/";

        mockMvc.perform(get(url))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("予約情報・予約座席情報を挿入できる")
    void insertReservation_withValidReserveRequestDto_return201AndInsertReservationId() throws Exception {
        ReserveRequestDto request = new ReserveRequestDto(
            "Test01",
            LocalDate.now(),
            "Test0",
            "Test1",
            "TestTaro",
            "test@main",
            "Test2",
            List.of(
                new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001", 2800),
                new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01002", 2800)
            ));
        UUID mockedReservationId = UUID.randomUUID();
        Mockito.when(service.insertReservation(request)).thenReturn(mockedReservationId);

        mockMvc.perform(post(baseUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(content().string("\"" + mockedReservationId + "\""));
    }

    @Test
    @DisplayName("リクエストのカラムがNullの場合、バリデーションエラー発生")
    void insertReservation_withNotValidReserveRequestDto_returnValidationError() throws Exception {
        ReserveRequestDto request = new ReserveRequestDto(
            null, LocalDate.now(), "Test0", "Test1", "TestTaro", "test@main", "Test2", List.of(
            new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001", 2800),
            new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01002", 2800)
        ));

        mockMvc.perform(post(baseUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("ScheduleCd is Null"));
    }

    @Test
    @DisplayName("リクエストDTO自体がNullの場合、バインドエラー発生")
    void insertReservation_withReserveRequestDtoIsNull_returnBindError() throws Exception {
        //バインド順が毎回異なるためエラーメッセージの比較は行わない
        mockMvc.perform(post(baseUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new ReserveRequestDto())))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("特定の予約情報IDに紐づく予約情報を削除できる")
    void deleteReservation_withReservationId_return204() throws Exception {
        UUID requestReservationId = UUID.randomUUID();
        String url = baseUrl + "/" + requestReservationId;

        mockMvc.perform(delete(url))
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("idがNullの場合、NOTFOUNDを返す")
    void deleteReservation_withReservationIdIsNull_returnRequestParamError() throws Exception {
        String url = baseUrl + "/";

        mockMvc.perform(delete(url))
            .andExpect(status().isNotFound());
    }
}
