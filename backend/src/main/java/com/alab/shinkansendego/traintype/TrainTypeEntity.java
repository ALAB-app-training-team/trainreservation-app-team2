package com.alab.shinkansendego.traintype;

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
@Table(name = "M_TrainType")
public class TrainTypeEntity {
    @Id
    @Column(name = "train_type_cd")
    private String trainTypeCd;

    @Column(name = "name")
    private String name;

    @Column(name = "train_series_cd")
    private String trainSeriesCd;
}
