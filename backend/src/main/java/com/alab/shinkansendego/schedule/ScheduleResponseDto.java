package com.alab.shinkansendego.schedule;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleResponseDto {
    private Integer reservedFare;
    private Integer greenFare;
    private Integer gcFare;
    private List<ScheduleDto> schedules;
}
