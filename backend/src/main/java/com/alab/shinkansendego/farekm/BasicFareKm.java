package com.alab.shinkansendego.farekm;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Table(name = "M_BasicFareKm")
@Entity
public class BasicFareKm {
    @Id
    @Column(name = "basic_fare_cd")
    private String basicFareCd;

    @Column(name = "min_km")
    private Integer minKm;

    @Column(name = "max_km")
    private Integer maxKm;

    @Column(name = "basic_fare")
    private Integer basicFare;
}
