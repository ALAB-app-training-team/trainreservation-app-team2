package com.alab.shinkansendego.searchhistory;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SearchHistoryRepository extends JpaRepository<SearchHistoryEntity, UUID> {
    List<SearchHistoryEntity> findByAccountId(UUID accountId);

    List<SearchHistoryEntity> findByAccountIdOrderByCreatedAtDesc(UUID accountId);
}
