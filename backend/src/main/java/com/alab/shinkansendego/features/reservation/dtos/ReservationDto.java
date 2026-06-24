package com.alab.shinkansendego.features.reservation.dtos;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReservationDto {
    private String train_type_name;
    private String departure_station_cd;
    private String arrival_station_cd;
    private LocalDate ride_date;
}
