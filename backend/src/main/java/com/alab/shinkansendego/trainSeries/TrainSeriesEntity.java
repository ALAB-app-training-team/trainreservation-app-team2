package com.alab.shinkansendego.trainSeries;

import com.alab.shinkansendego.traincar.TrainCarEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.ToString;

import java.util.List;

@Data
@Entity
@Table(name = "M_TrainSeries")
public class TrainSeriesEntity {
    @Id
    @Column(name = "train_series_cd")
    private String trainSeriesCd;
    @NotNull
    @Column(name = "name")
    private String name;
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "trainSeries")
    @ToString.Exclude
    private List<TrainCarEntity> trainCars;
}
