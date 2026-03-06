package com.Stephen.hotel_booking.repository;

import com.Stephen.hotel_booking.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // 根据用户ID查询订单，用于订单页显示
    List<Order> findByUserId(Long userId);
}