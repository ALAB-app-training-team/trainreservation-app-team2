package com.alab.shinkansendego.traintype;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "M_TrainType")
public class TrainTypeEntity {
    @Id
    @Column(name = "train_type_cd")
    private String trainTypeCd;

    @Column(name = "name")
    private String name;
}
