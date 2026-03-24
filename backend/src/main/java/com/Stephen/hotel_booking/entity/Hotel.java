package com.Stephen.hotel_booking.entity;

import lombok.Data;
import jakarta.persistence.*;
import java.util.List;

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

    @Column(name = "tags")
    private String tags;

    // Establish association with Room entity to fetch price range
    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "hotel_id")
    private List<Room> rooms;

    @Transient
    private double searchScore;
    public double getSearchScore() { return searchScore; }
    public void setSearchScore(double searchScore) { this.searchScore = searchScore; }
}