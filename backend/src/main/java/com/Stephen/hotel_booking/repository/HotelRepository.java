package com.Stephen.hotel_booking.repository;

import com.Stephen.hotel_booking.entity.Hotel;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

    @Query(value = "SELECT DISTINCT h.* FROM hotel h " +
            "JOIN room r ON h.id = r.hotel_id " +
            "WHERE r.id NOT IN (" +
            "    SELECT ri.room_id FROM room_inventory ri " +
            "    WHERE ri.inventory_date >= :startDate " +
            "    AND ri.inventory_date < :endDate " +
            "    AND ri.remaining_inventory <= 0" +
            ")", nativeQuery = true)
    List<Hotel> findAvailableHotels(@Param("startDate") LocalDate startDate,
                                    @Param("endDate") LocalDate endDate);
    Optional<Hotel> findByAdminId(Long adminId);
}