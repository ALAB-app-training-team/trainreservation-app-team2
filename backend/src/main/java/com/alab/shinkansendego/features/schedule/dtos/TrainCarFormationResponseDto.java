package com.alab.shinkansendego.features.schedule.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TrainCarFormationResponseDto {
    private String train_car_cd;
    private int train_car_number;
    private String seat_type_cd;
    private String name;
}
