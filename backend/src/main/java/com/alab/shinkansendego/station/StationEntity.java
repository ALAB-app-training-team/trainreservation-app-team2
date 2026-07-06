package com.alab.shinkansendego.station;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "M_Station")
public class StationEntity {
    @Id
    @Column(name = "station_cd")
    private String stationCd;

    @Column(name = "name")
    private String name;
}
