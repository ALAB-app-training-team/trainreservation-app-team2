package com.alab.shinkansendego.searchhistory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class SearchHistoryDto {
    private UUID id;
    @NonNull
    private LocalDate date;
    @NonNull
    private LocalTime time;
    @NonNull
    private String departureStationCd;
    @NonNull
    private String arrivalStationCd;
    @NonNull
    private Boolean isArrivalTime;
    private Timestamp createdAt;
}
