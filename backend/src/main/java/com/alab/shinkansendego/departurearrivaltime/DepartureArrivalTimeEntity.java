package com.alab.shinkansendego.departurearrivaltime;

import com.alab.shinkansendego.sectionkm.SectionKmEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "M_DepartureArrivalTime")
public class DepartureArrivalTimeEntity {
    @Id
    @Column(name = "time_cd")
    private String timeCd;

    @Column(name = "schedule_cd")
    private String scheduleCd;

    @Column(name = "departure_time")
    private LocalTime departureTime;

    @Column(name = "arrival_time")
    private LocalTime arrivalTime;

    @Column(name = "section_cd")
    private String sectionCd;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_cd", referencedColumnName = "section_cd", insertable = false, updatable = false)
    private SectionKmEntity sectionKm;
}
