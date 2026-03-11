package com.Stephen.hotel_booking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long roomId;
    private String roomType; // 冗余存储，方便查询

    @Column(columnDefinition = "TEXT")
    private String content; // 评论内容

    private Integer rating; // 评分 (1-5)
    private LocalDateTime createTime;

    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
    }
}