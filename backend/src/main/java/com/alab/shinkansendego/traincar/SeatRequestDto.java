package com.alab.shinkansendego.traincar;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

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
    @NotNull(message = "DepartureTime is Null")
    private LocalTime departure_time;
    @NotNull(message = "ArrivalTime is Null")
    private LocalTime arrival_time;
    @NotNull(message = "TrainCarCd is Null")
    private String train_car_cd;
}
