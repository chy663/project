package com.Stephen.hotel_booking.repository;

import com.Stephen.hotel_booking.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    // 根据酒店ID查询所有房型，这是点击酒店查看详情时的核心逻辑
    List<Room> findByHotelId(Long hotelId);
}