package com.alab.shinkansendego.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class EmailController {
    @Autowired
    private EmailService emailService;

    @GetMapping("/email")
    public String testEmail() {
        emailService.sendReservationConfirmation("user@example.com", "TEST-123");
        return "メール送信リクエストを送信しました！";
    }
}
