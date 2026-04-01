package com.Stephen.hotel_booking.repository;

import com.Stephen.hotel_booking.entity.RoomInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface RoomInventoryRepository extends JpaRepository<RoomInventory, Long> {

    // Fixed method name to match the property in RoomInventory entity
    Optional<RoomInventory> findByRoomIdAndInventoryDate(Long roomId, LocalDate inventoryDate);
}