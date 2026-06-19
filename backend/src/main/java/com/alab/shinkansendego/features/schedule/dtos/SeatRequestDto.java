package com.alab.shinkansendego.features.schedule.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SeatRequestDto {
    @NotNull(message = "ScheduleCd is Null")
    private String schedule_cd;
    @NotNull(message = "Date is Null")
    private LocalDate date;
    @NotNull(message = "DepartureStationCd is Null")
    private String departure_station_cd;
    @NotNull(message = "ArrivalStationCd is Null")
    private String arrival_station_cdr;
    @NotNull(message = "TrainCarCd is Null")
    private String train_car_cd;
}
