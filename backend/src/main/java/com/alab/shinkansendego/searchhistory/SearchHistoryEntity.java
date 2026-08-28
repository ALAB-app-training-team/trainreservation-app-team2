package com.alab.shinkansendego.searchhistory;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.Date;
import java.util.UUID;

@Data
@NoArgsConstructor
public class SearchHistoryEntity {
    @Id
    @Column(name = "id")
    private UUID id;
    @NonNull
    @Column(name = "account_id")
    private UUID accountId;
    @NonNull
    @Column(name = "date")
    private Date date;
    @NonNull
    @Column(name = "time")
    private Time time;
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
    @Column(name = "insert_timestamp")
    private Timestamp insertTimeStamp;
}
