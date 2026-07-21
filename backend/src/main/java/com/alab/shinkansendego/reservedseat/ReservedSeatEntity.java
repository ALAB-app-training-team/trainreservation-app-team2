package com.alab.shinkansendego.reservedseat;

import com.alab.shinkansendego.seat.SeatEntity;
import com.alab.shinkansendego.traincar.TrainCarEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
    @Column(name = "seat_fare")
    private Integer seatFare;
    @Column(name = "is_canceled")
    private Boolean IsCanceled;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "train_car_cd", referencedColumnName = "train_car_cd", insertable = false, updatable = false)
    private TrainCarEntity trainCar;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_cd", referencedColumnName = "seat_cd", insertable = false, updatable = false)
    private SeatEntity seat;
}
