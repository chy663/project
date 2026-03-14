package com.Stephen.hotel_booking.entity;


import lombok.Data;
import jakarta.persistence.*;

@Entity 
@Table(name = "hotel") 
@Data 
public class Hotel {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    @Column(nullable = false, length = 100)
    private String name; 

    private String address; 

    private String price;

    private String description;

    private String capacity;
    private Integer maxCapacity;

    @Column(name = "star_rating")
    private Integer starRating;

    @Column(name = "admin_id")
    private Long adminId;
}