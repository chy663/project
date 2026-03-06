package com.Stephen.hotel_booking.repository;

import com.Stephen.hotel_booking.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByHotelId(Long hotelId);

    @Modifying
    @Transactional
    @Query("UPDATE Room r SET r.totalInventory = r.totalInventory - 1 WHERE r.id = :roomId AND r.totalInventory > 0")
    int decreaseInventory(@Param("roomId") Long roomId);

    /**
     * 增加库存：用于退订逻辑
     */
    @Modifying
    @Transactional
    @Query("UPDATE Room r SET r.totalInventory = r.totalInventory + 1 WHERE r.id = :roomId")
    void increaseInventory(@Param("roomId") Long roomId);
}