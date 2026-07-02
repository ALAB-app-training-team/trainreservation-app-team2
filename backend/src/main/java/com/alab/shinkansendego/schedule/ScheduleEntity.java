package com.alab.shinkansendego.schedule;

import com.alab.shinkansendego.traintype.TrainTypeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    @JoinColumn(name = "train_type_cd", referencedColumnName = "train_type_cd", insertable = false, updatable = false)
    private TrainTypeEntity trainType;
}
