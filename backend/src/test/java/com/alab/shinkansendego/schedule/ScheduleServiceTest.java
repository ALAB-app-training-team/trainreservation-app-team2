package com.alab.shinkansendego.schedule;

import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeEntity;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.sectionkm.SectionKmEntity;
import com.alab.shinkansendego.sectionkm.SectionKmRepository;
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
    private final List<SectionKmEntity> depatureSectionList = new ArrayList<>();
    private final List<SectionKmEntity> arrivalSectionList = new ArrayList<>();
    private final List<DepartureArrivalTimeEntity> sec01ScheduleList = new ArrayList<>();
    private final List<DepartureArrivalTimeEntity> sec02ScheduleList = new ArrayList<>();
    private final List<DepartureArrivalTimeEntity> sec03ScheduleList = new ArrayList<>();
    private final ScheduleRequestDto request = new ScheduleRequestDto(LocalDate.of(2026, 6, 1), LocalTime.of(9, 0, 0), "東京", "上野");
    private final List<SectionKmEntity> emptySectionCdList = new ArrayList<>();
    @Mock
    private SectionKmRepository sectionRepo;
    @Mock
    private DepartureArrivalTimeRepository timeRepo;
    @Mock
    private ScheduleRepository scheduleRepo;
    @InjectMocks
    private ScheduleService service;

    private static @NonNull List<ScheduleResponseDto> getExpectScheduleResponseDtosList() {
        ScheduleResponseDto expect01 = new ScheduleResponseDto("TIME02", "やまびこ2号", LocalTime.of(11, 0, 0), LocalTime.of(16, 10, 0));
        ScheduleResponseDto expect02 = new ScheduleResponseDto("TIME03", "やまびこ3号", LocalTime.of(12, 0, 0), LocalTime.of(12, 30, 0));
        ScheduleResponseDto expect03 = new ScheduleResponseDto("TIME04", "やまびこ4号", LocalTime.of(13, 0, 0), LocalTime.of(13, 40, 0));
        ScheduleResponseDto expect04 = new ScheduleResponseDto("TIME06", "やまびこ6号", LocalTime.of(15, 0, 0), LocalTime.of(16, 0, 0));
        return Arrays.asList(expect01, expect02, expect03, expect04);
    }

    private static @NonNull List<TrainCarFormationResponseDto> getTrainCarResponseDtosList() {
        TrainCarFormationResponseDto expect01 = new TrainCarFormationResponseDto("E5SER01", 1, "SEAT01", "指定席");
        TrainCarFormationResponseDto expect02 = new TrainCarFormationResponseDto("E5SER02", 2, "SEAT01", "指定席");

        return Arrays.asList(expect01, expect02);
    }

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        depatureSectionList.clear();
        arrivalSectionList.clear();
        sec01ScheduleList.clear();
        sec02ScheduleList.clear();
        sec03ScheduleList.clear();
        SectionKmEntity sec01 = new SectionKmEntity();
        sec01.setSectionCd("SEC01");
        SectionKmEntity sec02 = new SectionKmEntity();
        sec02.setSectionCd("SEC02");
        SectionKmEntity sec03 = new SectionKmEntity();
        sec03.setSectionCd("SEC03");
        depatureSectionList.addAll(Arrays.asList(sec01, sec02));
        arrivalSectionList.addAll(Arrays.asList(sec02, sec03));
        DepartureArrivalTimeEntity data01 = new DepartureArrivalTimeEntity();
        data01.setTimeCd("TIME01");
        data01.setScheduleCd("TIME01");
        data01.setDepartureTime(LocalTime.of(10, 0, 0));
        data01.setArrivalTime(LocalTime.of(10, 10, 0));
        data01.setSectionCd("SEC01");
        DepartureArrivalTimeEntity data02 = new DepartureArrivalTimeEntity();
        data02.setTimeCd("TIME02");
        data02.setScheduleCd("TIME02");
        data02.setDepartureTime(LocalTime.of(11, 0, 0));
        data02.setArrivalTime(LocalTime.of(11, 20, 0));
        data02.setSectionCd("SEC01");
        DepartureArrivalTimeEntity data03 = new DepartureArrivalTimeEntity();
        data03.setTimeCd("TIME03");
        data03.setScheduleCd("TIME03");
        data03.setDepartureTime(LocalTime.of(12, 0, 0));
        data03.setArrivalTime(LocalTime.of(12, 30, 0));
        data03.setSectionCd("SEC02");
        DepartureArrivalTimeEntity data04 = new DepartureArrivalTimeEntity();
        data04.setTimeCd("TIME04");
        data04.setScheduleCd("TIME04");
        data04.setDepartureTime(LocalTime.of(13, 0, 0));
        data04.setArrivalTime(LocalTime.of(13, 40, 0));
        data04.setSectionCd("SEC02");
        DepartureArrivalTimeEntity data05 = new DepartureArrivalTimeEntity();
        data05.setTimeCd("TIME05");
        data05.setScheduleCd("TIME05");
        data05.setDepartureTime(LocalTime.of(14, 0, 0));
        data05.setArrivalTime(LocalTime.of(14, 50, 0));
        data05.setSectionCd("SEC03");
        DepartureArrivalTimeEntity data06 = new DepartureArrivalTimeEntity();
        data06.setTimeCd("TIME06");
        data06.setScheduleCd("TIME06");
        data06.setDepartureTime(LocalTime.of(15, 0, 0));
        data06.setArrivalTime(LocalTime.of(16, 0, 0));
        data06.setSectionCd("SEC02");
        DepartureArrivalTimeEntity data07 = new DepartureArrivalTimeEntity();
        data07.setTimeCd("TIME07");
        data07.setScheduleCd("TIME02");
        data07.setDepartureTime(LocalTime.of(16, 0, 0));
        data07.setArrivalTime(LocalTime.of(16, 10, 0));
        data07.setSectionCd("SEC03");
        sec01ScheduleList.addAll(Arrays.asList(data01, data02));
        sec02ScheduleList.addAll(Arrays.asList(data03, data04, data06));
        sec03ScheduleList.addAll(Arrays.asList(data05, data07));

        request.setDate(LocalDate.of(2026, 6, 1));
        request.setTime(LocalTime.of(9, 0, 0));
        request.setDepartureStationCd("STATION01");
        request.setArrivalStationCd("STATION02");
    }

    @Test
    @DisplayName("出発・到着駅名と出発時刻のリクエストDTOからダイヤリストが取得できる")
    void getSearchedScheduleByStation_withValidScheduleRequestDto_returnGetScheduleListSuccess() {
        when(sectionRepo.findByStartStationCd("STATION01")).thenReturn(depatureSectionList);
        when(sectionRepo.findByGoalStationCd("STATION02")).thenReturn(arrivalSectionList);
        when(timeRepo.findBySectionCd("SEC01")).thenReturn(sec01ScheduleList);
        when(timeRepo.findBySectionCd("SEC02")).thenReturn(sec02ScheduleList);
        when(timeRepo.findBySectionCd("SEC03")).thenReturn(sec03ScheduleList);
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
        when(sectionRepo.findByStartStationCd("STATION01")).thenReturn(emptySectionCdList);
        Exception ex = assertThrows(
            IllegalArgumentException.class,
            () -> service.getSearchedScheduleByStation(request)
        );
        assertEquals("SectionCD is Not found", ex.getMessage());
    }

    @Test
    @DisplayName("区間キロデータに存在しない到着駅がリクエストされた場合にエラーを発生させる")
    void getSearchedScheduleByStation_withNotExistGoalSectionRequest_returnIllegalArgumentException() {
        when(sectionRepo.findByStartStationCd("STATION01")).thenReturn(depatureSectionList);
        when(sectionRepo.findByGoalStationCd("STATION02")).thenReturn(emptySectionCdList);
        Exception ex = assertThrows(
            IllegalArgumentException.class,
            () -> service.getSearchedScheduleByStation(request)
        );
        assertEquals("SectionCD is Not found", ex.getMessage());
    }

    @Test
    @DisplayName("車種データに存在しないダイヤコードがリクエストされた場合にエラーを発生させる")
    void getSearchedScheduleByStation_withNotExistTrainTypeRequest_returnIllegalArgumentException() {
        when(sectionRepo.findByStartStationCd("STATION01")).thenReturn(depatureSectionList);
        when(sectionRepo.findByGoalStationCd("STATION02")).thenReturn(arrivalSectionList);
        when(timeRepo.findBySectionCd("SEC01")).thenReturn(sec01ScheduleList);
        when(timeRepo.findBySectionCd("SEC02")).thenReturn(sec02ScheduleList);
        when(timeRepo.findBySectionCd("SEC03")).thenReturn(sec03ScheduleList);
        when(scheduleRepo.findTrainTypeNameByScheduleCd("TIME02")).thenReturn(null);
        Exception ex = assertThrows(
            IllegalArgumentException.class,
            () -> service.getSearchedScheduleByStation(request)
        );
        assertEquals("TrainTypeName is Not found", ex.getMessage());
    }

    @Test
    @DisplayName("ダイヤコードを指定して車両編成が取得できる")
    void getTrainCarList_returnTrainCarListSuccess() {
        String scheduleCd = "TEST01";
        List<TrainCarFormationResponseDto> expectList = getTrainCarResponseDtosList();

        when(scheduleRepo.findTrainCarFormationByScheduleCd(scheduleCd)).thenReturn(expectList);

        List<TrainCarFormationResponseDto> actualList = service.getTrainCarList(scheduleCd);

        assertEquals(2, actualList.size());
        assertEquals(expectList, actualList);
    }
}
