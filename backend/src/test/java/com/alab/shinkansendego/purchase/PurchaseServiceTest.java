package com.alab.shinkansendego.purchase;

import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeEntity;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.purchasedseat.PurchasedSeatRepository;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionRepository;
import com.alab.shinkansendego.sectionkm.SectionKmRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DuplicateKeyException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class PurchaseServiceTest {
    @Mock
    private PurchaseRepository purchaseRepo;
    @Mock
    private PurchasedSeatRepository purchasedSeatRepo;
    @Mock
    private SectionKmRepository sectionKmRepo;
    @Mock
    private DepartureArrivalTimeRepository departureArrivalTimeRepo;
    @Mock
    private ReservedSeatSectionRepository reservedSeatSectionRepo;
    @InjectMocks
    private PurchaseService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("購入情報・購入座席情報を挿入できる")
    void insertPurchase_withValidReserveRequestDto_returnInsertPurchaseId() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01002"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01003"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01004"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01005"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01006")));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getSchedule_cd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        when(sectionKmRepo.findSectionCdByStartStationCd(request.getDeparture_station_cd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(sectionKmRepo.findSectionCdByGoalStationCd(request.getArrival_station_cd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getSchedule_cd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeAndArrivalTime(request.getSchedule_cd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(purchaseRepo.save(any())).thenReturn(1);
        when(purchasedSeatRepo.saveAll(any()).size()).thenReturn(request.getSeats().size());
        when(reservedSeatSectionRepo.insertReservedSeatSections(any())).thenReturn(request.getSeats().size());

        UUID result = service.insertPurchase(request);
        assertNotNull(result);
    }

    @Test
    @DisplayName("座席リストが空の場合、IllegalArgumentExceptionが発生する")
    void insertPurchase_withEmptySelectedSeatDto_throwsIllegalArgumentException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", List.of());
        assertThrows(IllegalArgumentException.class, () -> {
            service.insertPurchase(request);
        });
    }

    @Test
    @DisplayName("座席リストがnullの場合、IllegalArgumentExceptionが発生する")
    void insertPurchase_withNullSelectedSeatDto_throwsIllegalArgumentException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", null);
        assertThrows(IllegalArgumentException.class, () -> {
            service.insertPurchase(request);
        });
    }

    @Test
    @DisplayName("座席リストが6以上の場合、IllegalArgumentExceptionが発生する")
    void insertPurchase_withMaxSelectedSeatDto_throwsIllegalArgumentException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001")));
        assertThrows(IllegalArgumentException.class, () -> {
            service.insertPurchase(request);
        });
    }

    @Test
    @DisplayName("該当区間の出発到着時刻が存在しない場合、IllegalArgumentExceptionが発生する")
    void insertPurchase_withNotExistingSection_throwsIllegalArgumentException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01002"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01003"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01004"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01005"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01006")));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getSchedule_cd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        when(sectionKmRepo.findSectionCdByStartStationCd(request.getDeparture_station_cd())).thenReturn(List.of());
        when(sectionKmRepo.findSectionCdByGoalStationCd(request.getArrival_station_cd())).thenReturn(List.of());
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getSchedule_cd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(null);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeAndArrivalTime(request.getSchedule_cd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of());

        assertThrows(IllegalArgumentException.class, () -> {
            service.insertPurchase(request);
        });
    }

    @Test
    @DisplayName("同一購入情報IDで重複した座席を予約しようとした場合、DataAccessExceptionが発生する")
    void insertPurchase_withSameSelectedSeatDto_throwsDataAccessException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001")));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getSchedule_cd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        when(sectionKmRepo.findSectionCdByStartStationCd(request.getDeparture_station_cd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(sectionKmRepo.findSectionCdByGoalStationCd(request.getArrival_station_cd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getSchedule_cd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeAndArrivalTime(request.getSchedule_cd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(purchaseRepo.save(any())).thenReturn(1);
        when(purchasedSeatRepo.saveAll(any()).size()).thenThrow(new DuplicateKeyException("UNIQUE制約エラー"));
        assertThrows(org.springframework.dao.DataAccessException.class, () -> {
            service.insertPurchase(request);
        });
    }

    @Test
    @DisplayName("insertPurchaseが失敗した場合、RuntimeExceptionが発生する")
    void insertPurchase_withInsertInsertPurchaseFails_throwsRuntimeException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001")));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getSchedule_cd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        when(sectionKmRepo.findSectionCdByStartStationCd(request.getDeparture_station_cd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(sectionKmRepo.findSectionCdByGoalStationCd(request.getArrival_station_cd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getSchedule_cd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeAndArrivalTime(request.getSchedule_cd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(purchaseRepo.save(any())).thenReturn(0);
        assertThrows(RuntimeException.class, () -> {
            service.insertPurchase(request);
        });
    }

    @Test
    @DisplayName("saveAllが失敗した場合、RuntimeExceptionが発生する")
    void insertPurchase_withInsertPurchasedFails_throwsRuntimeException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001")));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getSchedule_cd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        when(sectionKmRepo.findSectionCdByStartStationCd(request.getDeparture_station_cd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(sectionKmRepo.findSectionCdByGoalStationCd(request.getArrival_station_cd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getSchedule_cd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeAndArrivalTime(request.getSchedule_cd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(purchaseRepo.save(any())).thenReturn(1);
        when(purchasedSeatRepo.saveAll(any()).size()).thenReturn(0);

        assertThrows(RuntimeException.class, () -> {
            service.insertPurchase(request);
        });
    }

    @Test
    @DisplayName("既に予約済みの座席を予約しようとした場合、DataAccessExceptionが発生する")
    void insertPurchase_withAlreadyReservedSeat_throwsDataAccessException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001")));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getSchedule_cd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        when(sectionKmRepo.findSectionCdByStartStationCd(request.getDeparture_station_cd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(sectionKmRepo.findSectionCdByGoalStationCd(request.getArrival_station_cd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getSchedule_cd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeAndArrivalTime(request.getSchedule_cd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(purchaseRepo.save(any())).thenReturn(1);
        when(purchasedSeatRepo.saveAll(any()).size()).thenReturn(request.getSeats().size());
        when(reservedSeatSectionRepo.insertReservedSeatSections(any())).thenThrow(new DuplicateKeyException("UNIQUE制約エラー"));

        assertThrows(org.springframework.dao.DataAccessException.class, () -> {
            service.insertPurchase(request);
        });
    }

    @Test
    @DisplayName("insertReservedSeatSectionsが失敗した場合、RuntimeExceptionが発生する")
    void insertPurchase_withInsertReservedSeatSectionsFails_throwsRuntimeException() {
        ReserveRequestDto request = new ReserveRequestDto("Test01", LocalDate.now(), "Test0", "Test1", List.of(new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"), new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001")));
        DepartureArrivalTimeEntity departureArrivalTime = new DepartureArrivalTimeEntity();
        departureArrivalTime.setTimeCd("Test1");
        departureArrivalTime.setScheduleCd(request.getSchedule_cd());
        departureArrivalTime.setDepartureTime(LocalTime.of(6, 4));
        departureArrivalTime.setArrivalTime(LocalTime.of(6, 9));
        departureArrivalTime.setSectionCd("Test1");
        when(sectionKmRepo.findSectionCdByStartStationCd(request.getDeparture_station_cd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(sectionKmRepo.findSectionCdByGoalStationCd(request.getArrival_station_cd())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(departureArrivalTimeRepo.findByScheduleCdAndSectionCdIn(request.getSchedule_cd(), List.of(departureArrivalTime.getSectionCd()))).thenReturn(departureArrivalTime);
        when(departureArrivalTimeRepo.findByScheduleCdAndDepartureTimeAndArrivalTime(request.getSchedule_cd(), departureArrivalTime.getDepartureTime(), departureArrivalTime.getArrivalTime())).thenReturn(List.of(departureArrivalTime.getSectionCd()));
        when(purchaseRepo.save(any())).thenReturn(1);
        when(purchasedSeatRepo.saveAll(any()).size()).thenReturn(request.getSeats().size());
        when(reservedSeatSectionRepo.insertReservedSeatSections(any())).thenReturn(0);

        assertThrows(RuntimeException.class, () -> {
            service.insertPurchase(request);
        });
    }
}
