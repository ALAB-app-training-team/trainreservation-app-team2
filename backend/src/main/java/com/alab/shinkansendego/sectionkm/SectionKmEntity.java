package com.alab.shinkansendego.sectionkm;

import com.alab.shinkansendego.station.StationEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "M_SectionKm")
public class SectionKmEntity {
    @Id
    @NonNull
    @Column(name = "section_cd")
    private String sectionCd;
<<<<<<< HEAD
    @NonNull
    @Column(name = "start_station_cd")
    private String startStationCd;
    @NonNull
    @Column(name = "goal_station_cd")
    private String goalStationCd;
    @NonNull
    @Column(name = "distance_km")
    private Double distanceKm;
=======
    @Column(name = "start_station_cd")
    private String startStationCd;
    @Column(name = "goal_station_cd")
    private String goalStationCd;
    @Column(name = "distance_km")
    private double distanceKm;
>>>>>>> 97bbf34a223a86a903671ad503e7459d045e3e58
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "start_station_cd", referencedColumnName = "station_cd", insertable = false, updatable = false)
    private StationEntity startStation;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_station_cd", referencedColumnName = "station_cd", insertable = false, updatable = false)
    private StationEntity goalStation;
}
