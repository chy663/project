package com.Stephen.hotel_booking.service;

import com.Stephen.hotel_booking.entity.Hotel;
import com.Stephen.hotel_booking.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

   
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    
    public Hotel saveHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }
}