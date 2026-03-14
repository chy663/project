package com.Stephen.hotel_booking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password; // 存储哈希加密后的字符串

    private String nickname;

    private LocalDateTime createTime;

    private String role;

    @PrePersist
    protected void onCreate() {
        this.createTime = LocalDateTime.now();
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}