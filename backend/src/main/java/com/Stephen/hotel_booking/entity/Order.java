package com.Stephen.hotel_booking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders") // "order" 通常是数据库保留字，建议使用 "orders"
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId; // 实际项目中应关联 User 对象

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "hotel_id", nullable = false)
    private Long hotelId;

    @Column(nullable = false)
    private Double totalPrice;

    @Column(nullable = false)
    private String status; // 例如: PENDING, CONFIRMED, CANCELLED

    private LocalDateTime createTime;

    @Column(name = "complete_time")
    private LocalDateTime completeTime;

    @Column(name = "hotel_name")
    private String hotelName;

    @Column(name = "room_type")
    private String roomType;

    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
        if (status == null) status = "CONFIRMED"; // 模拟支付成功，默认状态为已确认
    }
}