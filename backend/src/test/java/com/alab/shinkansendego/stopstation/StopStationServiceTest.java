package com.alab.shinkansendego.stopstation;


import com.alab.shinkansendego.station.StationEntity;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.DiscriminatorOptions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

public class StopStationServiceTest {

    @Mock
    private StopStationRepository stopStationRepository;
    @InjectMocks
    private StopStationService service;

    private final StationEntity tokyo = new StationEntity("THK01", "東京");
    private final StationEntity ueno = new StationEntity("THK02", "上野");
    private final StationEntity omiya = new StationEntity("CMN01", "大宮");
    private final StationEntity sendai = new StationEntity("THK09", "仙台");
    private final StationEntity morioka = new StationEntity("CMN03", "盛岡");

    private final List<StopStationEntity> allStation = List.of(
            new StopStationEntity("0061", "CMN03", "HB", morioka),
            new StopStationEntity("0011", "THK02", "HB", ueno),
            new StopStationEntity("0001", "THK01", "HB", tokyo),
            new StopStationEntity("0021", "CMN01", "HB", omiya)
    );
    private final List<StopStationEntity> stationsWithSameStationCd = List.of(
            new StopStationEntity("0061", "CMN03", "HB", morioka),
            new StopStationEntity("0062", "CMN03", "YM", morioka),
            new StopStationEntity("0063", "CMN03", "NS", morioka)
    );

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("異なる駅CDを持つ駅をそれぞれDTOにして返すことができる")
    void getStopStationWithoutTransfer_returnDTOWithEachStation() {
        when(stopStationRepository.findAll()).thenReturn(allStation);
        List<StationResponseDto> result = service.getStopStationWithoutTransfers();
        assertEquals(4, result.size());
    }

    @Test
    @DisplayName("異なる駅CDを持つ駅をソートして返すことができる")
    void getStopStationWithoutTransfers_returnDTOSorted() {
        when(stopStationRepository.findAll()).thenReturn(allStation);
        List<StationResponseDto> result = service.getStopStationWithoutTransfers();
        assertAll(
                () -> assertEquals("THK01", result.get(0).getStationCd()),
                () -> assertEquals("THK02", result.get(1).getStationCd()),
                () -> assertEquals("CMN01", result.get(2).getStationCd()),
                () -> assertEquals("CMN03", result.get(3).getStationCd())
        );
    }

    @Test
    @DisplayName("同じ駅CDを持つ駅をまとめて返すことができる")
    void getStopStationWithoutTransfer_returnDTOWithIntegrateForSameStationCd() {
        when(stopStationRepository.findAll()).thenReturn(stationsWithSameStationCd);
        List<StationResponseDto> result = service.getStopStationWithoutTransfers();
        assertEquals(1, result.size());
    }

    @Test
    @DisplayName("同じ駅CDを持つ駅の停車カテゴリーをまとめることができる")
    void getStopStationWithoutTransfer_returnDTOWithIntegrateCategoryForSameStationCd() {
        when(stopStationRepository.findAll()).thenReturn(stationsWithSameStationCd);
        List<StationResponseDto> result = service.getStopStationWithoutTransfers();
        assertAll(
                () -> assertTrue(result.getFirst().getCategories().contains("HB")),
                () -> assertTrue(result.getFirst().getCategories().contains("YM")),
                () -> assertTrue(result.getFirst().getCategories().contains("NS"))
        );
    }

    @Test
    @DisplayName("停車駅テーブルに対応する駅テーブルのレコードがなかった場合Null参照例外を投げる")
    void getStopStationWithoutTransfer_throwNullPointerExceptionWithoutStation() {
        List<StopStationEntity> allStopStationsWithoutStation = List.of(
                new StopStationEntity("0061", "CMN03", "HB"),
                new StopStationEntity("0011", "THK02", "HB"),
                new StopStationEntity("0001", "THK01", "HB"),
                new StopStationEntity("0021", "CMN01", "HB")
        );
        when(stopStationRepository.findAll()).thenReturn(allStopStationsWithoutStation);

        assertThrows(NullPointerException.class, () -> service.getStopStationWithoutTransfers());
    }

    @Test
    @DisplayName("停車駅テーブルが空の場合空のDTOリストを返す")
    void getStopStationWithoutTransfer_returnEmptyListWithEmptyStopStation() {
        List<StopStationEntity> emptyEntityList = List.of();

        when(stopStationRepository.findAll()).thenReturn(emptyEntityList);

        assertTrue(service.getStopStationWithoutTransfers().isEmpty());
    }
}
