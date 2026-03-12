package com.Stephen.hotel_booking.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 关键修改：建立与用户的关联
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Long roomId;
    private String hotelName;
    private String roomType;
    private String checkIn;
    private String checkOut;
    private Double totalPrice;
    private String status; // e.g., "Pending", "Confirmed"
}