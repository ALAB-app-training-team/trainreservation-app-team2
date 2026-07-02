package com.alab.shinkansendego.traincar;

import com.alab.shinkansendego.seattype.*;
import jakarta.persistence.*;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_type_cd", referencedColumnName = "seat_type_cd")
    private SeatTypeEntity seatType;
}
