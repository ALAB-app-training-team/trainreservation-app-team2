package com.alab.shinkansendego.features.reservation.dtos;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReservationResponseDto {
    private String train_type_name;
    private String departure_station_name;
    private LocalTime departure_time;
    private String arrival_station_name;
    private LocalTime arrival_time;
    private LocalDate ride_date;
    private List<ReservedSeatDto> reserved_seats;
}
