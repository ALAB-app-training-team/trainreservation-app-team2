package com.alab.shinkansendego.reservedseatsection;

import jakarta.persistence.*;
import lombok.*;

import java.time.*;
import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "T_ReservedSeatSection")
public class ReservedSeatSectionEntity {
    @Id
    @Column(name = "id")
    private UUID id;

    @Column(name = "purchase_id")
    private UUID purchaseId;

    @Column(name = "ride_date")
    private LocalDate rideDate;

    @Column(name = "schedule_cd")
    private String scheduleCd;

    @Column(name = "train_car_cd")
    private String trainCarCd;

    @Column(name = "seat_cd")
    private String seatCd;

    @Column(name = "reserved_section_cd")
    private String reservedSectionCd;
}
