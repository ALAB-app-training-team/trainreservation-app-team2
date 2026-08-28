package com.alab.shinkansendego.searchhistory;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.Date;
import java.util.UUID;

@Data
@AllArgsConstructor
public class SearchHistoryDto {
    private UUID id;
    private Date date;
    private Time time;
    private String departureStationCd;
    private String arrivalStationCd;
    private Boolean isArrivalTime;
    private Timestamp create_at;
}
