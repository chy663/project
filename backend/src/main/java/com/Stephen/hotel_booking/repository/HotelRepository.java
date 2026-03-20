package com.Stephen.hotel_booking.repository;

import com.Stephen.hotel_booking.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    // 新增：根据管理员用户ID查找其管理的酒店
    Optional<Hotel> findByAdminId(Long adminId);

}