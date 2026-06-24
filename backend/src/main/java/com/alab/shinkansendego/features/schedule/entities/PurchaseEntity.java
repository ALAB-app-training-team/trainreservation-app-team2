package com.alab.shinkansendego.features.schedule.entities;

import java.time.LocalDate;
import java.util.UUID;

public class PurchaseEntity {
    private UUID id;
    private LocalDate ride_date;
    private String schedule_cd;
    private String departure_station_cd;
    private String arrival_station_cd;
}
