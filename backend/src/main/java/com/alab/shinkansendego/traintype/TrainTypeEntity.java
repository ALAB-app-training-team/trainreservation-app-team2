package com.alab.shinkansendego.traintype;

import com.alab.shinkansendego.trainSeries.TrainSeriesEntity;
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
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "M_TrainType")
public class TrainTypeEntity {
    @Id
    @Column(name = "train_type_cd")
    private String trainTypeCd;
    @Column(name = "name")
    private String name;
    @Column(name = "train_series_cd")
    private String trainSeriesCd;
    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    @JoinColumn(name = "train_series_cd", referencedColumnName = "train_series_cd", insertable = false, updatable = false)
    private TrainSeriesEntity trainSeries;
}
