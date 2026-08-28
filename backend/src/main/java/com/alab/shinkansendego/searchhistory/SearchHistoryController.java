package com.alab.shinkansendego.searchhistory;

import com.alab.shinkansendego.account.AccountSessionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "api/searchhistory")
public class SearchHistoryController {
    private final SearchHistoryService searchHistoryService;

    @Autowired
    public SearchHistoryController(SearchHistoryService searchHistoryService) {
        this.searchHistoryService = searchHistoryService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SearchHistoryDto>> getSearchHistory(@AuthenticationPrincipal AccountSessionDto session) {
        List<SearchHistoryDto> response = searchHistoryService.getSearchHistory(session.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UUID> recordSearchHistory(@AuthenticationPrincipal AccountSessionDto session, SearchHistoryDto searchHistory) {
        UUID historyId = searchHistoryService.recordSearchHistory(searchHistory, session.getId());
        return ResponseEntity.ok(historyId);
    }
}
