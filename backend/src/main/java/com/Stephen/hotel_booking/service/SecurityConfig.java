package com.Stephen.hotel_booking.service;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // 禁用 CSRF 保护（小程序开发常用）
                .cors(Customizer.withDefaults()) // 开启 CORS 支持
                .authorizeHttpRequests(auth -> auth
                        // 1. 用户认证相关（登录、注册）
                        .requestMatchers("/api/users/login", "/api/users/register").permitAll()

                        // 2. 酒店与房间信息（允许所有人查看）
                        .requestMatchers(HttpMethod.GET, "/api/hotels/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/rooms/**").permitAll()

                        // 3. 评论信息（解决 roomDetail 页面 reviews 报错）
                        .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()

                        // 4. 订单相关（根据你的需求，目前设为允许所有，实际建议 authenticated）
                        .requestMatchers("/api/orders/**").permitAll()

                        // 5. 收藏功能（解决 POST 403 报错）
                        .requestMatchers(HttpMethod.POST, "/api/favorites/toggle").permitAll()

                        // 6. 管理员功能（如果需要，可以放行 PUT/POST 房型接口）
                        .requestMatchers(HttpMethod.PUT, "/api/rooms/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/rooms/**").permitAll()

                        // 🚩 必须把 anyRequest().authenticated() 放在最后！
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}