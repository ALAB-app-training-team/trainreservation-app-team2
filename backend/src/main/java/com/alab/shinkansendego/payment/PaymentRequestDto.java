package com.alab.shinkansendego.payment;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PaymentRequestDto {
    @NotNull(message = "number is Null")
    private String number;
    @NotNull(message = "name is Null")
    private String name;
    @NotNull(message = "expiry is Null")
    private String expiry;
    @NotNull(message = "cvc is Null")
    private String cvc;
}
