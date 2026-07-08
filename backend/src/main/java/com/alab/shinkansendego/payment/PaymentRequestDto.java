package com.alab.shinkansendego.payment;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PaymentRequestDto {
    @NotBlank(message = "number is Blank")
    private String number;
    @NotBlank(message = "name is Blank")
    private String name;
    @NotBlank(message = "expiry is Blank")
    private String expiry;
    @NotBlank(message = "cvc is Blank")
    private String cvc;
}
