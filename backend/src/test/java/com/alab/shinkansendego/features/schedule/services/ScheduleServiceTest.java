package com.alab.shinkansendego.features.schedule.services;

import com.alab.shinkansendego.features.schedule.dtos.DepartureArrivalTimeDto;
import com.alab.shinkansendego.features.schedule.dtos.ScheduleRequestDto;
import com.alab.shinkansendego.features.schedule.dtos.ScheduleResponseDto;
import com.alab.shinkansendego.features.schedule.repositories.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.features.schedule.repositories.ScheduleRepository;
import com.alab.shinkansendego.features.schedule.repositories.SectionKmRepository;
import com.alab.shinkansendego.features.schedule.repositories.StationRepository;
import com.alab.shinkansendego.features.schedule.servicies.ScheduleService;
import org.jspecify.annotations.NonNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

public class ScheduleServiceTest {

    private final List<String> depatureSectionList = new ArrayList<>();
    private final List<String> arrivalSectionList = new ArrayList<>();
    private final List<DepartureArrivalTimeDto> sec01ScheduleList = new ArrayList<>();
    private final List<DepartureArrivalTimeDto> sec02ScheduleList = new ArrayList<>();
    private final List<DepartureArrivalTimeDto> sec03ScheduleList = new ArrayList<>();
    private final ScheduleRequestDto request = new ScheduleRequestDto(LocalDate.of(2026, 6, 1), LocalTime.of(9, 0, 0), "東京", "上野");
    private final List<String> emptySectionCdList = new ArrayList<>();
    @Mock
    private StationRepository stationRepo;
    @Mock
    private SectionKmRepository sectionRepo;
    @Mock
    private DepartureArrivalTimeRepository timeRepo;
    @Mock
    private ScheduleRepository scheduleRepo;
    @InjectMocks
    private ScheduleService service;

    private static @NonNull List<ScheduleResponseDto> getExpectScheduleResponseDtosList() {
        ScheduleResponseDto expect01 = new ScheduleResponseDto("やまびこ2号", LocalTime.of(11, 0, 0), LocalTime.of(16, 10, 0));
        ScheduleResponseDto expect02 = new ScheduleResponseDto("やまびこ3号", LocalTime.of(12, 0, 0), LocalTime.of(12, 30, 0));
        ScheduleResponseDto expect03 = new ScheduleResponseDto("やまびこ4号", LocalTime.of(13, 0, 0), LocalTime.of(13, 40, 0));
        ScheduleResponseDto expect04 = new ScheduleResponseDto("やまびこ6号", LocalTime.of(15, 0, 0), LocalTime.of(16, 0, 0));
        return Arrays.asList(expect01, expect02, expect03, expect04);
    }

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        depatureSectionList.clear();
        arrivalSectionList.clear();
        sec01ScheduleList.clear();
        sec02ScheduleList.clear();
        sec03ScheduleList.clear();
        depatureSectionList.addAll(Arrays.asList("SEC01", "SEC02"));
        arrivalSectionList.addAll(Arrays.asList("SEC02", "SEC03"));
        DepartureArrivalTimeDto data01 = new DepartureArrivalTimeDto("TIME01", LocalTime.of(10, 0, 0), LocalTime.of(10, 10, 0));
        DepartureArrivalTimeDto data02 = new DepartureArrivalTimeDto("TIME02", LocalTime.of(11, 0, 0), LocalTime.of(11, 20, 0));
        DepartureArrivalTimeDto data03 = new DepartureArrivalTimeDto("TIME03", LocalTime.of(12, 0, 0), LocalTime.of(12, 30, 0));
        DepartureArrivalTimeDto data04 = new DepartureArrivalTimeDto("TIME04", LocalTime.of(13, 0, 0), LocalTime.of(13, 40, 0));
        DepartureArrivalTimeDto data05 = new DepartureArrivalTimeDto("TIME05", LocalTime.of(14, 0, 0), LocalTime.of(14, 50, 0));
        DepartureArrivalTimeDto data06 = new DepartureArrivalTimeDto("TIME06", LocalTime.of(15, 0, 0), LocalTime.of(16, 0, 0));
        DepartureArrivalTimeDto data07 = new DepartureArrivalTimeDto("TIME02", LocalTime.of(16, 0, 0), LocalTime.of(16, 10, 0));
        sec01ScheduleList.addAll(Arrays.asList(data01, data02, data03));
        sec02ScheduleList.addAll(Arrays.asList(data04, data06));
        sec03ScheduleList.addAll(Arrays.asList(data03, data05, data07));

        request.setDate(LocalDate.of(2026, 6, 1));
        request.setTime(LocalTime.of(9, 0, 0));
        request.setDeparture_station_cd("STATION01");
        request.setArrival_station_cd("STATION02");
    }

    @Test
    @DisplayName("出発・到着駅名と出発時刻のリクエストDTOからダイヤリストが取得できる")
    void getSearchedScheduleByStation_withValidScheduleRequestDto_returnGetScheduleListSuccess() {
        when(sectionRepo.findSectionCdByStartStationCd("STATION01")).thenReturn(depatureSectionList);
        when(sectionRepo.findSectionCdByGoalStationCd("STATION02")).thenReturn(arrivalSectionList);
        when(timeRepo.findScheduleBySectionKmCd("SEC01")).thenReturn(sec01ScheduleList);
        when(timeRepo.findScheduleBySectionKmCd("SEC02")).thenReturn(sec02ScheduleList);
        when(timeRepo.findScheduleBySectionKmCd("SEC03")).thenReturn(sec03ScheduleList);
        when(scheduleRepo.findTrainTypeNameByScheduleCd("TIME01")).thenReturn("やまびこ1号");
        when(scheduleRepo.findTrainTypeNameByScheduleCd("TIME02")).thenReturn("やまびこ2号");
        when(scheduleRepo.findTrainTypeNameByScheduleCd("TIME03")).thenReturn("やまびこ3号");
        when(scheduleRepo.findTrainTypeNameByScheduleCd("TIME04")).thenReturn("やまびこ4号");
        when(scheduleRepo.findTrainTypeNameByScheduleCd("TIME05")).thenReturn("やまびこ5号");
        when(scheduleRepo.findTrainTypeNameByScheduleCd("TIME06")).thenReturn("やまびこ6号");

        List<ScheduleResponseDto> expectList = getExpectScheduleResponseDtosList();

        List<ScheduleResponseDto> actualList = service.getSearchedScheduleByStation(request);

        assertEquals(expectList, actualList);
    }

    @Test
    @DisplayName("区間キロデータに存在しない出発駅がリクエストされた場合にエラーを発生させる")
    void getSearchedScheduleByStation_withNotExistStartSectionRequest_returnIllegalArgumentException() {
        when(sectionRepo.findSectionCdByStartStationCd("STATION01")).thenReturn(emptySectionCdList);
        Exception ex = assertThrows(
                IllegalArgumentException.class,
                () -> service.getSearchedScheduleByStation(request)
        );
        assertEquals("SectionCD is Not found", ex.getMessage());
    }

    @Test
    @DisplayName("区間キロデータに存在しない到着駅がリクエストされた場合にエラーを発生させる")
    void getSearchedScheduleByStation_withNotExistGoalSectionRequest_returnIllegalArgumentException() {
        when(sectionRepo.findSectionCdByStartStationCd("STATION01")).thenReturn(depatureSectionList);
        when(sectionRepo.findSectionCdByGoalStationCd("STATION02")).thenReturn(emptySectionCdList);
        Exception ex = assertThrows(
                IllegalArgumentException.class,
                () -> service.getSearchedScheduleByStation(request)
        );
        assertEquals("SectionCD is Not found", ex.getMessage());
    }

    @Test
    @DisplayName("車種データに存在しないダイヤコードがリクエストされた場合にエラーを発生させる")
    void getSearchedScheduleByStation_withNotExistTrainTypeRequest_returnIllegalArgumentException() {
        when(sectionRepo.findSectionCdByStartStationCd("STATION01")).thenReturn(depatureSectionList);
        when(sectionRepo.findSectionCdByGoalStationCd("STATION02")).thenReturn(arrivalSectionList);
        when(timeRepo.findScheduleBySectionKmCd("SEC01")).thenReturn(sec01ScheduleList);
        when(timeRepo.findScheduleBySectionKmCd("SEC02")).thenReturn(sec02ScheduleList);
        when(timeRepo.findScheduleBySectionKmCd("SEC03")).thenReturn(sec03ScheduleList);
        when(scheduleRepo.findTrainTypeNameByScheduleCd("TIME02")).thenReturn(null);
        Exception ex = assertThrows(
                IllegalArgumentException.class,
                () -> service.getSearchedScheduleByStation(request)
        );
        assertEquals("TrainTypeName is Not found", ex.getMessage());
    }

}
