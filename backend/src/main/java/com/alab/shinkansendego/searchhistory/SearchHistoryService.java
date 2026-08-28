package com.alab.shinkansendego.searchhistory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class SearchHistoryService {
    private final SearchHistoryRepository searchHistoryRepository;

    @Autowired
    private SearchHistoryService(SearchHistoryRepository searchHistoryRepository) {
        this.searchHistoryRepository = searchHistoryRepository;
    }

    /**
     *
     * @param accountId アカウントのId
     * @return アカウントに紐づくList<SearchHistoryEntity> (無ければ空のリスト)
     */
    public List<SearchHistoryDto> getSearchHistory(UUID accountId) {
        List<SearchHistoryEntity> histories = searchHistoryRepository.findById(accountId).map(List::of).orElseGet(List::of);
        if (CollectionUtils.isEmpty(histories)) {
            return List.of();
        }
        return histories.stream().map(
            history -> new SearchHistoryDto(
                history.getId(),
                history.getDate(),
                history.getTime(),
                history.getDepartureStationCd(),
                history.getArrivalStationCd(),
                history.getIsArrivalTime(),
                history.getCreateAt()
            )
        ).toList();
    }

    /**
     *
     * @param history 保存する検索履歴
     * @return 検索履歴UUID
     */
    public UUID recordSearchHistory(SearchHistoryDto history, UUID accountId) {
        SearchHistoryEntity target = new SearchHistoryEntity(
            UUID.randomUUID(),
            accountId,
            history.getDate(),
            history.getTime(),
            history.getDepartureStationCd(),
            history.getArrivalStationCd(),
            history.getIsArrivalTime(),
            Timestamp.from(Instant.now())
        );
        SearchHistoryEntity saved = searchHistoryRepository.save(target);
        return saved.getId();
    }
}
