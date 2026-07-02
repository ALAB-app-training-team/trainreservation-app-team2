package com.alab.shinkansendego.traincar;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
@Table(name = "M_TrainCar")
public class TrainCarEntity {
    @Id
    @Column(name = "train_car_cd")
    private String trainCarCd;

    @NotNull
    @Column(name = "train_series_cd")
    private String trainSeriesCd;

    @NotNull
    @Column(name = "train_car_number")
    private Integer trainCarNumber;

    @NotNull
    @Column(name = "seat_type_cd")
    private String seatTypeCd;
}
