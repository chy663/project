package com.Stephen.hotel_booking.service;

import com.Stephen.hotel_booking.entity.Hotel;
import com.Stephen.hotel_booking.entity.Room;
import com.Stephen.hotel_booking.repository.HotelRepository;
import com.Stephen.hotel_booking.repository.RoomRepository;
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

    @Autowired
    private RoomRepository roomRepository;

    // 获取指定酒店的所有房型列表
    public List<Room> getRoomsByHotelId(Long hotelId) {
        // 调用 Repository 层的查询方法
        return roomRepository.findByHotelId(hotelId);
    }
}