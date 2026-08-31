package com.alab.shinkansendego.searchhistory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Entity
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
public class SearchHistoryEntity {
    @Id
    @Column(name = "id")
    private UUID id;
    @NonNull
    @Column(name = "account_id")
    private UUID accountId;
    @NonNull
    @Column(name = "date")
    private LocalDate date;
    @NonNull
    @Column(name = "time")
    private LocalTime time;
    @NonNull
    @Column(name = "departure_station_cd")
    private String departureStationCd;
    @NonNull
    @Column(name = "arrival_station_cd")
    private String arrivalStationCd;
    @NonNull
    @Column(name = "is_arrival_time")
    private Boolean isArrivalTime;
    @NonNull
    @Column(name = "created_at")
    private Timestamp createdAt;
}
