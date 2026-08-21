package com.alab.shinkansendego.email;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EmailRequestDto {
    private String reserverMail;
    private String reserverName;
    private UUID reservationId;
    private String trainTypeName;
    private LocalDate rideDate;
    private String departureStationName;
    private LocalTime departureTime;
    private String arrivalStationName;
    private LocalTime arrivalTime;
    private Integer totalAmount;
    private Integer oldAmount;
    private List<SelectedSeatDto> seats;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @RequiredArgsConstructor
    public static class SelectedSeatDto {
        private String trainCarCd;
        private String trainCarTypeCd;
        private String seatCd;
        private Integer seatFare;
    }
}
