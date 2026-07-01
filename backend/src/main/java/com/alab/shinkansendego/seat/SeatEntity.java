package com.alab.shinkansendego.seat;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "M_Seat")
public class SeatEntity {
    @Id
    @Column(name = "seat_cd")
    private String seatCd;

    @Column(name = "seat_type_cd")
    private String seatTypeCd;

    @Column(name = "seat_number")
    private Integer seatNumber;

    @Column(name = "seat_column")
    private String seatColumn;
}
