package com.alab.shinkansendego.payment;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PaymentController.class)
public class PaymentControllerTest {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String baseUrl = "/api/payments";

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Test
    @DisplayName("クレジットカード情報を受け取り、トークンを発行できる")
    void insertCreditCard_withPaymentRequestDto_return201StatusCodeAndPaymentToken() throws Exception {
        String url = baseUrl + "/tokens";
        PaymentRequestDto request = new PaymentRequestDto("1111222233334444", "TARO YAMADA", "12/28", "123");
        mockMvc.perform(post(url)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_PLAIN))
                .andExpect(result -> {
                    String responseBody = result.getResponse().getContentAsString();
                    org.junit.jupiter.api.Assertions.assertDoesNotThrow(() -> java.util.UUID.fromString(responseBody));
                });
    }

    @Test
    @DisplayName("トークンを受け取り、決済IDを発行できる")
    void payByPaymentToken_withPaymentToken_return201StatusCodeAndPaymentId() throws Exception {
        String request = UUID.randomUUID().toString();
        mockMvc.perform(post(baseUrl)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_PLAIN))
                .andExpect(result -> {
                    String responseBody = result.getResponse().getContentAsString();
                    org.junit.jupiter.api.Assertions.assertDoesNotThrow(() -> java.util.UUID.fromString(responseBody));
                });
    }
}
