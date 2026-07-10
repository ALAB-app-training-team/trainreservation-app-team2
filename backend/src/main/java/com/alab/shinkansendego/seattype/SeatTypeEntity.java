package com.alab.shinkansendego.seattype;

import com.alab.shinkansendego.seat.SeatEntity;
import com.alab.shinkansendego.traincartype.TrainCarTypeEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "M_SeatType")
public class SeatTypeEntity {
    @Id
    @Column(name = "seat_type_cd")
    private String seatTypeCd;

    @Column(name = "name")
    private String name;

    @Column(name = "train_car_type_cd")
    private String trainCarTypeCd;

    @OneToMany
    @JoinColumn(name = "seat_type_cd", referencedColumnName = "seat_type_cd", insertable = false, updatable = false)
    private List<SeatEntity> seats;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "train_car_type_cd", referencedColumnName = "train_car_type_cd", insertable = false, updatable = false)
    private TrainCarTypeEntity trainCarType;
}
