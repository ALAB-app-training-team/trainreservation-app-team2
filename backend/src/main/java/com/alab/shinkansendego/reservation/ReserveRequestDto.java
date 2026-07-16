package com.alab.shinkansendego.reservation;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    @NotNull(message = "ReserverName is Null")
    private String reserverName;
    @NotNull(message = "ReserverMail is Null")
    private String reserverMail;
    @NotNull(message = "PaymentToken is Null")
    private String paymentToken;
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
