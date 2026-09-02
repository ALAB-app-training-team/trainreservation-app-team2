package com.alab.shinkansendego.searchhistory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class SearchHistoryService {
    private final SearchHistoryRepository searchHistoryRepository;
    private static final int MAX_SEARCH_HISTORY_COUNT = 5;

    @Autowired
    public SearchHistoryService(SearchHistoryRepository searchHistoryRepository) {
        this.searchHistoryRepository = searchHistoryRepository;
    }

    /**
     *
     * @param accountId アカウントのId
     * @return アカウントに紐づくList<SearchHistoryEntity> (無ければ空のリスト)
     */
    public List<SearchHistoryDto> getSearchHistory(UUID accountId) {
        List<SearchHistoryEntity> histories = searchHistoryRepository.findByAccountId(accountId);
        if (CollectionUtils.isEmpty(histories)) {
            return List.of();
        }
        histories.sort(
            Comparator.comparing(SearchHistoryEntity::getCreatedAt)
                .reversed());
        return histories.stream().map(
            history -> new SearchHistoryDto(
                history.getId(),
                history.getDate(),
                history.getTime(),
                history.getDepartureStationCd(),
                history.getArrivalStationCd(),
                history.getIsArrivalTime(),
                history.getCreatedAt()
            )
        ).toList();
    }

    /**
     *
     * @param history   保存する検索履歴
     * @param accountId 検索履歴を保存するアカウントID
     * @return 検索履歴ID
     */
    @Transactional
    public UUID recordSearchHistory(SearchHistoryDto history, UUID accountId) {

        List<SearchHistoryEntity> histories = searchHistoryRepository.findByAccountId(accountId);
        if (!CollectionUtils.isEmpty(histories)) {
            histories.sort(
                Comparator.comparing(SearchHistoryEntity::getCreatedAt)
                    .reversed());
        }
        if (histories.size() >= MAX_SEARCH_HISTORY_COUNT) {
            searchHistoryRepository.delete(histories.getLast());
        }
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
