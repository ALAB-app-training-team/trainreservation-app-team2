package com.alab.shinkansendego.features.reservation.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReservedSeatDto {
    private String train_car_type_name;
    private Integer train_car_number;
    private Integer seat_number;
    private String seat_column;
    private String code_token;
}
