package com.alab.shinkansendego.features.schedule.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SeatResponseDto {
    private String train_car_cd;
    private Integer train_car_number;
    private String seat_cd;
    private Integer seat_number;
    private String seat_column;
    private Boolean is_reserved;
}
