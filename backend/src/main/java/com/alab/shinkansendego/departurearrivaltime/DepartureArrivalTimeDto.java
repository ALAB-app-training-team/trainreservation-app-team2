package com.alab.shinkansendego.departurearrivaltime;

import lombok.*;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DepartureArrivalTimeDto {
    private String schedule_cd;
    private LocalTime departure_time;
    private LocalTime arrival_time;
}
