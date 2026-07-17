package com.alab.shinkansendego.seat;

import com.alab.shinkansendego.seattype.SeatTypeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

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
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_type_cd", referencedColumnName = "seat_type_cd", insertable = false, updatable = false)
    private SeatTypeEntity seatType;
}
