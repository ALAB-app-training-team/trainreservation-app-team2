package com.alab.shinkansendego.features.schedule.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReserveRequestDto {
    @NotNull(message = "ScheduleCd is Null")
    private String schedule_cd;
    @NotNull(message = "Date is Null")
    private LocalDate ride_date;
    @NotNull(message = "DepartureStationCd is Null")
    private String departure_station_cd;
    @NotNull(message = "ArrivalStationCd is Null")
    private String arrival_station_cd;
    @NotNull(message = "Seats is Null")
    private List<SelectedSeatDto> seats;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SelectedSeatDto {
        @NotNull(message = "trainCarCd is Null")
        private String train_car_cd;
        @NotNull(message = "seatCd is Null")
        private String seat_cd;
    }
}
