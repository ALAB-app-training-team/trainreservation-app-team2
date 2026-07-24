package com.alab.shinkansendego.reservation;

import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeEntity;
import com.alab.shinkansendego.reservedseat.ReservedSeatEntity;
import com.alab.shinkansendego.schedule.ScheduleEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.util.Set;
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
    @Column(name = "is_deleted")
    private Boolean isDeleted;
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_cd", referencedColumnName = "schedule_cd", insertable = false, updatable = false)
    private Set<DepartureArrivalTimeEntity> departureArrivalTime;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_cd", referencedColumnName = "schedule_cd", insertable = false, updatable = false)
    private ScheduleEntity schedule;
    @OneToMany(fetch = FetchType.LAZY)
    @ToString.Exclude
    @JoinColumn(name = "reservation_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Set<ReservedSeatEntity> reservedSeat;
}
