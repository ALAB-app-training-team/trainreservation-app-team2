package com.shinkansendego.demo.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {
        private String id;
        private String name;
        private String mail;
        private String password;
        private String pay_token;
}
