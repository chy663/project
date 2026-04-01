package com.Stephen.hotel_booking.entity;

import jakarta.persistence.*; // 使用 jakarta
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "room_inventory")
@Data
public class RoomInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "inventory_date", nullable = false)
    private LocalDate inventoryDate;

    @Column(name = "remaining_inventory", nullable = false)
    private Integer remainingInventory;
}