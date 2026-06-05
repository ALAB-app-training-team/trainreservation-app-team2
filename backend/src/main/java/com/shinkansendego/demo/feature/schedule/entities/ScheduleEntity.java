package com.shinkansendego.demo.feature.schedule.entities;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ScheduleEntity {
    private String schedule_cd;
    private String train_type_cd;
}
