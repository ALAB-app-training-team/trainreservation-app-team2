package com.alab.shinkansendego.reservedseat;

import com.alab.shinkansendego.seat.SeatEntity;
import com.alab.shinkansendego.traincar.TrainCarEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "T_ReservedSeat")
public class ReservedSeatEntity {
    @Id
    @Column(name = "id")
    private UUID id;

    @Column(name = "reservation_id")
    private UUID reservationId;

    @Column(name = "train_car_cd")
    private String trainCarCd;

    @Column(name = "seat_cd")
    private String seatCd;

    @Column(name = "code_token")
    private UUID codeToken;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "train_car_cd", referencedColumnName = "train_car_cd", insertable = false, updatable = false)
    private TrainCarEntity trainCar;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_cd", referencedColumnName = "seat_cd", insertable = false, updatable = false)
    private SeatEntity seat;
}
