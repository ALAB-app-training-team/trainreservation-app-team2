package com.alab.shinkansendego.farekm;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "M_SupplementaryFareKm")
@Entity
public class SupplementaryFareKmEntity {
    @Id
    @Column(name = "supplementary_fare_cd")
    private String supplementaryFareCd;
    @Column(name = "min_km")
    private Integer minKm;
    @Column(name = "max_km")
    private Integer maxKm;
    @Column(name = "reserved_fare")
    private Integer reservedFare;
    @Column(name = "green_fare")
    private Integer greenFare;
    @Column(name = "gc_fare")
    private Integer gcFare;
}
