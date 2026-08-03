package com.alab.shinkansendego.schedule;

import com.alab.shinkansendego.traintype.TrainTypeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "M_Schedule")
public class ScheduleEntity {
    @Id
    @Column(name = "schedule_cd")
    private String scheduleCd;
    @Column(name = "train_type_cd")
    private String trainTypeCd;
    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    @JoinColumn(name = "train_type_cd", referencedColumnName = "train_type_cd", insertable = false, updatable = false)
    private TrainTypeEntity trainType;
}
