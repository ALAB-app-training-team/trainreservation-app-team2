package com.alab.shinkansendego.features.schedule.entities;

import lombok.*;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PurchaseSeatEntity {
    private UUID id;
    private UUID purchase_id;
    private String train_car_cd;
    private String seat_cd;
    private UUID code_token;
}
