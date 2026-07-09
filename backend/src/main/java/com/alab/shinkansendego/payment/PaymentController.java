package com.alab.shinkansendego.payment;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(path = "api/payments")
public class PaymentController {
    @Autowired
    public PaymentController() {
    }

    @PostMapping(path = "tokens")
    public ResponseEntity<String> insertCreditCard(@Valid @RequestBody PaymentRequestDto request) {
        UUID paymentToken = UUID.randomUUID();
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentToken.toString());
    }

    @PostMapping
    public ResponseEntity<String> payByPaymentToken(@Valid @RequestBody String paymentToken) {
        UUID paymentId = UUID.randomUUID();
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentId.toString());
    }
}
