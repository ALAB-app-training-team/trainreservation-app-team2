package com.alab.shinkansendego.traincar;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

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
