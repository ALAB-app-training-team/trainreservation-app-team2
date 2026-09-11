package com.alab.shinkansendego.searchhistory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistoryEntity, UUID> {
    List<SearchHistoryEntity> findByAccountId(UUID accountId);

    Optional<SearchHistoryEntity> findByIdAndAccountId(UUID id, UUID accountId);
}
