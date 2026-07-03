package com.alab.shinkansendego.departurearrivaltime;

import lombok.*;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DepartureArrivalTimeDto {
    private String scheduleCd;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
}
