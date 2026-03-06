package com.Stephen.hotel_booking.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "room")
@Data // 使用 Lombok 自动生成 Getter/Setter
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hotel_id", nullable = false)
    private Long hotelId;

    @Column(name = "room_type", nullable = false, length = 50)
    private String roomType;

    @Column(nullable = false)
    private Double price;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    @Column(name = "max_people")
    private Integer maxPeople;

    @Column(name = "total_inventory")
    private Integer totalInventory; // 使用 Integer 避免默认 0 的干扰

    // Order.java 核心改动
    @Column(name = "hotel_name")
    private String hotelName;



    // 如果需要直接关联 Hotel 对象，可以添加以下配置（可选）
    /*
    @ManyToOne
    @JoinColumn(name = "hotel_id", insertable = false, updatable = false)
    private Hotel hotel;
    */
}