package com.alab.shinkansendego.station;

import jakarta.persistence.*;
import lombok.*;

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
