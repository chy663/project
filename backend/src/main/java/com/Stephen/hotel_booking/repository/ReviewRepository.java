package com.Stephen.hotel_booking.repository;
import com.Stephen.hotel_booking.entity.Order;
import com.Stephen.hotel_booking.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // 根据房间 ID 获取所有评论
    List<Review> findByRoomIdOrderByCreateTimeDesc(Long roomId);
}