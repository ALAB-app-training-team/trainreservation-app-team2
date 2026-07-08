package com.alab.shinkansendego.stopstation;

import com.alab.shinkansendego.station.StationEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.List;
import lombok.*;

@Data
@Entity
@RequiredArgsConstructor
@Table(name = "M_StopStation")
public class StopStationEntity {
    @Id
    @NotNull
    @NonNull
    @Column(name = "stop_station_cd")
    private String stopStationCd;

    @NotNull
    @NonNull
    @Column(name = "station_cd")
    private String stationCd;

    @NotNull
    @NonNull
    @Column(name = "stop_category")
    private String stopCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_cd", referencedColumnName = "station_cd", insertable = false, updatable = false)
    private StationEntity station;
}
