package com.Stephen.hotel_booking;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    // 注册 BCryptPasswordEncoder Bean 供 Controller 使用
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // 禁用 CSRF 以便小程序跨域调用
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/**").permitAll() // 放行所有酒店、订单及用户 API
                        .anyRequest().authenticated()
                );
        return http.build();
    }
}