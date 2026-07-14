package com.alab.shinkansendego.farekm;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Table(name = "M_ExpressFareKm")
@Entity
public class ExpressFareKm {
    @Id
    @Column(name = "express_fare_cd")
    private String expressFareCd;

    @Column(name = "min_km")
    private Integer minKm;

    @Column(name = "max_km")
    private Integer maxKm;

    @Column(name = "express_fare")
    private Integer expressFare;
}
