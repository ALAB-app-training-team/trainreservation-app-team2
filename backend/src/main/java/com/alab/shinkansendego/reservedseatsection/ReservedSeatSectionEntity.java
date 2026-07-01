package com.alab.shinkansendego.reservedseatsection;

import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReservedSeatSectionEntity {
    private UUID id;
    private UUID purchase_id;
    private LocalDate ride_date;
    private String schedule_cd;
    private String train_car_cd;
    private String seat_cd;
    private String reserved_section_cd;
}
