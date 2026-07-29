package com.alab.shinkansendego;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        HttpSecurity httpSecurity = http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configure(http))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401をセット
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("Unauthorized");
                })
                .accessDeniedHandler((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403をセット
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("Forbidden");
                })
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/login", "/api/logout", "/api/stations", "/api/stopstations", "/api/schedules", "/api/reservations", "/api/traincars",
                    "/api/payments", "/api/payments/tokens", "/api/schedules/**", "/api/traincars/**", "/api/reservations/**").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());
        return http.build();
    }
}
