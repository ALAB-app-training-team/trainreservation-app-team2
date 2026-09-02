package com.alab.shinkansendego.searchhistory;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchHistoryDto {
    private UUID id;
    @NotNull
    private LocalDate date;
    @NotNull
    private LocalTime time;
    @NotNull
    private String departureStationCd;
    @NotNull
    private String arrivalStationCd;
    @NotNull
    private Boolean isArrivalTime;
    private Timestamp createdAt;
}
