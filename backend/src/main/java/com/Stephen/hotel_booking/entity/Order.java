package com.Stephen.hotel_booking.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    // 如果前端没有显式传 hotelId，nullable 应设为 true 避免插入失败
    @Column(name = "hotel_id")
    private Long hotelId;

    // 前端计算可能不及时，建议这里允许为空或在 Service 层计算
    @Column(name = "total_price")
    private Double totalPrice;

    @Column(nullable = false)
    private String status;

    @Column(name = "create_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    @Column(name = "complete_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime completeTime;

    @Column(name = "hotel_name")
    private String hotelName;

    @Column(name = "room_type")
    private String roomType;

    @Column(name = "guest_name")
    private String guestName;

    @Column(name = "guest_phone")
    private String guestPhone;

    /**
     * 入住日期
     * @JsonFormat 必须增加，以确保能正确解析前端传来的 "yyyy-MM-dd" 字符串
     */
    @Column(name = "check_in_date", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate checkInDate;

    /**
     * 退房日期
     */
    @Column(name = "check_out_date", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate checkOutDate;

    @Column(name = "ai_guide", columnDefinition = "TEXT")
    private String aiGuide;

    @PrePersist
    protected void onCreate() {
        if (createTime == null) {
            createTime = LocalDateTime.now();
        }
        if (status == null) {
            status = "PAID"; // 根据你前端传的 status: 'PAID' 进行对齐
        }
    }
}