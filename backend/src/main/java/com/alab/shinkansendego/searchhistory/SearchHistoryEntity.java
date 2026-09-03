package com.alab.shinkansendego.searchhistory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "T_SearchHistory")
public class SearchHistoryEntity {
    @Id
    @Column(name = "id")
    private UUID id;
    @Column(name = "account_id")
    private UUID accountId;
    @Column(name = "date")
    private LocalDate date;
    @Column(name = "time")
    private LocalTime time;
    @Column(name = "departure_station_cd")
    private String departureStationCd;
    @Column(name = "arrival_station_cd")
    private String arrivalStationCd;
    @Column(name = "is_arrival_time")
    private Boolean isArrivalTime;
    @Column(name = "created_at")
    private Timestamp createdAt;
}
