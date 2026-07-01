package com.alab.shinkansendego.purchasedseat;

import lombok.*;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PurchasedSeatEntity {
    private UUID id;
    private UUID purchase_id;
    private String train_car_cd;
    private String seat_cd;
    private UUID code_token;
}
