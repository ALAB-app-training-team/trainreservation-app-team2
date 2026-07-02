package com.alab.shinkansendego.reservation;

import lombok.*;

import java.time.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReservedScheduleDto {
    private LocalTime departureTime;
    private String departureStationCd;
    private String departureStationName;
    private LocalTime arrivalTime;
    private String arrivalStationCd;
    private String arrivalStationName;
}
