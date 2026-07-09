package com.alab.shinkansendego.reservation;

import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeEntity;
import com.alab.shinkansendego.schedule.ScheduleEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "T_Reservation")
public class ReservationEntity {
    @Id
    @Column(name = "id")
    private UUID id;

    @Column(name = "ride_date")
    private LocalDate rideDate;

    @Column(name = "schedule_cd")
    private String scheduleCd;

    @Column(name = "departure_station_cd")
    private String departureStationCd;

    @Column(name = "arrival_station_cd")
    private String arrivalStationCd;

    @Column(name = "payment_tracking_id")
    private String paymentTrackingId;

    @Column(name = "reserver_name")
    private String reserverName;

    @Column(name = "reserver_mail")
    private String reserverMail;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_cd", referencedColumnName = "schedule_cd", insertable = false, updatable = false)
    private List<DepartureArrivalTimeEntity> departureArrivalTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_cd", referencedColumnName = "schedule_cd", insertable = false, updatable = false)
    private ScheduleEntity schedule;
}
