package com.alab.shinkansendego.sectionkm;

import com.alab.shinkansendego.station.StationEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "M_SectionKm")
public class SectionKmEntity {
    @Id
    @Column(name = "section_cd")
    private String sectionCd;

    @Column(name = "start_station_cd")
    private String startStationCd;

    @Column(name = "goal_station_cd")
    private String goalStationCd;

    @Column(name = "distance_km")
    private double distanceKm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "start_station_cd", referencedColumnName = "station_cd", insertable = false, updatable = false)
    private StationEntity startStation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_station_cd", referencedColumnName = "station_cd", insertable = false, updatable = false)
    private StationEntity goalStation;
}
