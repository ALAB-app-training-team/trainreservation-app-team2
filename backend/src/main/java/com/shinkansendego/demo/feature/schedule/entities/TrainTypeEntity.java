package com.shinkansendego.demo.feature.schedule.entities;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TrainTypeEntity {
    private String train_type_cd;
    private String name;
}
