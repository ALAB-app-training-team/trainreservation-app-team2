package com.alab.shinkansendego;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean // ←これが必須
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // ここをラムダ形式に変更
            .cors(cors -> cors.configure(http))//.cors(cors ->{}) 追加
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))//追加
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll() // /api/** は誰でもアクセス可能
                .anyRequest().authenticated()           // 他は認証必須
            )
            .formLogin(form -> form.disable())//追加
            .httpBasic(basic -> basic.disable())//追加
        ;
        return http.build();
    }
}
