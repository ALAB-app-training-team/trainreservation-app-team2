package com.alab.shinkansendego.reservation;

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
    private String scheduleCd;
    @NotNull(message = "Date is Null")
    private LocalDate rideDate;
    @NotNull(message = "DepartureStationCd is Null")
    private String departureStationCd;
    @NotNull(message = "ArrivalStationCd is Null")
    private String arrivalStationCd;
    @NotNull(message = "Seats is Null")
    private List<SelectedSeatDto> seats;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SelectedSeatDto {
        @NotNull(message = "trainCarCd is Null")
        private String trainCarCd;
        @NotNull(message = "seatCd is Null")
        private String seatCd;
    }
}
