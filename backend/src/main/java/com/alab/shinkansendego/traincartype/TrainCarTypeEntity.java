package com.alab.shinkansendego.traincartype;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "M_TrainCarType")
public class TrainCarTypeEntity {
    @Id
    @Column(name = "train_car_type_cd")
    private String trainCarTypeCd;
    @Column(name = "name")
    private String name;
}
