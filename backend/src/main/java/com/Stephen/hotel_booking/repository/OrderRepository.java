package com.Stephen.hotel_booking.repository;

import com.Stephen.hotel_booking.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // 关键修改：根据用户ID查询该用户的所有订单
    List<Order> findByUserId(Long userId);
}