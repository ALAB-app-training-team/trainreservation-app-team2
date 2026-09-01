package com.alab.shinkansendego.searchhistory;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SearchHistoryServiceTest {
    private final UUID accountId = UUID.randomUUID();
    @Mock
    private SearchHistoryRepository searchHistoryRepository;
    @InjectMocks
    private SearchHistoryService service;
    private List<SearchHistoryEntity> mockSearchHistories;

    private SearchHistoryEntity createSearchHistoryEntity(
        int id,
        String date,
        String time,
        String departureStationCd,
        String arrivalStationCd,
        boolean isArrivalTime
    ) {
        return new SearchHistoryEntity(
            UUID.fromString(
                "00000000-0000-0000-0000-%012d".formatted(id)
            ),
            accountId,
            LocalDate.parse(date),
            LocalTime.parse(time),
            departureStationCd,
            arrivalStationCd,
            isArrivalTime,
            Timestamp.valueOf(date + " 00:00:00")
        );
    }

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
        mockSearchHistories = List.of(
            createSearchHistoryEntity(1, "2026-08-03", "08:30:00", "THK01", "THK09", false), // 東京->仙台
            createSearchHistoryEntity(2, "2026-08-08", "12:00:00", "CMN01", "CMN03", true), // 大宮->盛岡
            createSearchHistoryEntity(3, "2026-08-15", "17:45:00", "THK09", "THK20", false), // 仙台->新青森
            createSearchHistoryEntity(4, "2026-08-22", "10:15:00", "CMN04", "JET09", true), // 高崎->新潟
            createSearchHistoryEntity(5, "2026-08-28", "19:00:00", "HKR02", "HKR05", false) // 軽井沢->長野
        );
    }

    @Test
    @DisplayName("アカウントIDに一致する検索履歴を履歴作成順の降順で取得することができる")
    void getSearchHistory_returnOrderedSearchHistory() {
        when(searchHistoryRepository.findByAccountId(any())).thenReturn(new ArrayList<>(mockSearchHistories));

        List<SearchHistoryDto> result = service.getSearchHistory(accountId);
        assertAll(
            () -> assertEquals(5, result.size()),
            () -> assertEquals(UUID.fromString(
                "00000000-0000-0000-0000-%012d".formatted(5)
            ), result.getFirst().getId()),
            () -> assertEquals(UUID.fromString(
                "00000000-0000-0000-0000-%012d".formatted(1)
            ), result.getLast().getId())

        );
    }

    @Test
    @DisplayName("正しくDTOにマッピングされる")
    void getSearchHistory_mapCorrectly() {
        SearchHistoryEntity entity = createSearchHistoryEntity(1, "2026-08-03", "08:30:00", "THK01", "THK09", false);
        when(searchHistoryRepository.findByAccountId(any())).thenReturn(new ArrayList<>(List.of(entity)));

        SearchHistoryDto result = service.getSearchHistory(accountId).getFirst();

        assertAll(
            () -> assertEquals(entity.getId(), result.getId()),
            () -> assertEquals(entity.getDate(), result.getDate()),
            () -> assertEquals(entity.getTime(), result.getTime()),
            () -> assertEquals(entity.getDepartureStationCd(), result.getDepartureStationCd()),
            () -> assertEquals(entity.getArrivalStationCd(), result.getArrivalStationCd()),
            () -> assertEquals(entity.getIsArrivalTime(), result.getIsArrivalTime()),
            () -> assertEquals(entity.getCreatedAt(), result.getCreatedAt())
        );
    }

    @Test
    @DisplayName("アカウントIDに一致する検索履歴が無ければ空のリストを返す")
    void getSearchHistory_withNoSearchHistoryMatch_returnEmptyList() {
        when(searchHistoryRepository.findByAccountId(any())).thenReturn(List.of());

        List<SearchHistoryDto> result = service.getSearchHistory(accountId);
        assertEquals(0, result.size());
    }

    @Test
    @DisplayName("既存の履歴が0件で履歴を保存してUUIDを返す")
    void recordSearchHistory_with3HistoryExist_returnUUID() {
        UUID historyId = UUID.randomUUID();
        SearchHistoryDto dto = createSearchHistoryDto(
            historyId, LocalDate.of(2026, 9, 10), LocalTime.of(9, 0, 0), "THK01", "THK09", true
        );

        SearchHistoryEntity entity = new SearchHistoryEntity(
            historyId,
            accountId,
            LocalDate.of(2026, 9, 10),
            LocalTime.of(9, 0, 0),
            "THK01", // 東京
            "THK09", // 仙台
            false,
            Timestamp.from(Instant.now())
        );

        when(searchHistoryRepository.findByAccountId(any())).thenReturn(new ArrayList<>(List.of()));
        when(searchHistoryRepository.save(any())).thenReturn(entity);

        UUID result = service.recordSearchHistory(dto, accountId);
        assertEquals(historyId, result);
        verify(searchHistoryRepository, never()).delete(any());
        verify(searchHistoryRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("既存の履歴が4件でdeleteがが呼ばれずに履歴が保存される")
    void recordSearchHistory_with4HistoryExist_returnUUID() {
        UUID historyId = UUID.randomUUID();
        SearchHistoryDto dto = createSearchHistoryDto(
            historyId, LocalDate.of(2026, 9, 10), LocalTime.of(9, 0, 0), "THK01", "THK09", true
        );

        SearchHistoryEntity entity = new SearchHistoryEntity(
            historyId,
            accountId,
            LocalDate.of(2026, 9, 10),
            LocalTime.of(9, 0, 0),
            "THK01", // 東京
            "THK09", // 仙台
            false,
            Timestamp.from(Instant.now())
        );

        when(searchHistoryRepository.findByAccountId(any())).thenReturn(
            new ArrayList<>(List.of
                (createSearchHistoryEntity(1, "2026-08-03", "08:30:00", "THK01", "THK09", false), // 東京->仙台
                    createSearchHistoryEntity(2, "2026-08-08", "12:00:00", "CMN01", "CMN03", true), // 大宮->盛岡
                    createSearchHistoryEntity(3, "2026-08-15", "17:45:00", "THK09", "THK20", false), // 仙台->新青森
                    createSearchHistoryEntity(4, "2026-08-22", "10:15:00", "CMN04", "JET09", true) // 高崎->新潟
                )
            )
        );
        when(searchHistoryRepository.save(any())).thenReturn(entity);

        UUID result = service.recordSearchHistory(dto, accountId);
        assertEquals(historyId, result);
        verify(searchHistoryRepository, never()).delete(any());
        verify(searchHistoryRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("既存の履歴が5件でdeleteが呼ばれ履歴が保存される")
    void recordSearchHistory_with5HistoryExist_returnUUID() {
        UUID historyId = UUID.randomUUID();
        SearchHistoryDto dto = createSearchHistoryDto(
            historyId, LocalDate.of(2026, 9, 10), LocalTime.of(9, 0, 0), "THK01", "THK09", true
        );

        SearchHistoryEntity entity = new SearchHistoryEntity(
            historyId,
            accountId,
            LocalDate.of(2026, 9, 10),
            LocalTime.of(9, 0, 0),
            "THK01", // 東京
            "THK09", // 仙台
            false,
            Timestamp.from(Instant.now())
        );

        when(searchHistoryRepository.findByAccountId(any())).thenReturn(new ArrayList<>(mockSearchHistories));
        when(searchHistoryRepository.save(any())).thenReturn(entity);

        UUID result = service.recordSearchHistory(dto, accountId);
        assertEquals(historyId, result);
        verify(searchHistoryRepository, times(1)).delete(any());
        verify(searchHistoryRepository, times(1)).save(any());
    }
}

