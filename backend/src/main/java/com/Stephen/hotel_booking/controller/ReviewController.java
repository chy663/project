package com.Stephen.hotel_booking.controller;
import com.Stephen.hotel_booking.entity.Order;
import com.Stephen.hotel_booking.entity.Review;
import com.Stephen.hotel_booking.entity.Room;
import com.Stephen.hotel_booking.entity.Hotel;
import com.Stephen.hotel_booking.repository.OrderRepository;
import com.Stephen.hotel_booking.repository.ReviewRepository;
import com.Stephen.hotel_booking.repository.RoomRepository;
import com.Stephen.hotel_booking.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin
public class ReviewController {
    @Autowired
    private ReviewRepository reviewRepository;

    // 提交评论
    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody Review review) {
        return ResponseEntity.ok(reviewRepository.save(review));
    }

    // 获取某个房间的评论
    @GetMapping("/room/{roomId}")
    public List<Review> getRoomReviews(@PathVariable Long roomId) {
        return reviewRepository.findByRoomIdOrderByCreateTimeDesc(roomId);
    }
}