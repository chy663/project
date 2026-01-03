package com.Stephen.hotel_booking.controller;

import com.Stephen.hotel_booking.entity.Hotel;
import com.Stephen.hotel_booking.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin 
public class HotelController {

    @Autowired
    private HotelService hotelService;

    
    @GetMapping
    public List<Hotel> getHotels() {
        return hotelService.getAllHotels();
    }
}