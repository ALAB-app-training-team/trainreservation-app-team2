package com.alab.shinkansendego.farekm;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Table(name = "M_SupplementaryFareKm")
@Entity
public class SupplementaryFareKm {
    @Id
    @Column(name = "supplementary_fare_cd")
    private String supplementaryFareCd;

    @Column(name = "min_km")
    private Integer minKm;

    @Column(name = "max_km")
    private Integer maxKm;

    @Column(name = "reserved_seat_fare")
    private Integer reservedSeatFare;

    @Column(name = "green_fare")
    private Integer greenFare;

    @Column(name = "gc_fare")
    private Integer gcFare;

}
