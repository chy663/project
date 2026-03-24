package com.Stephen.hotel_booking.controller;

import com.Stephen.hotel_booking.entity.Order;
import com.Stephen.hotel_booking.entity.Room;
import com.Stephen.hotel_booking.entity.Hotel;
import com.Stephen.hotel_booking.repository.OrderRepository;
import com.Stephen.hotel_booking.repository.RoomRepository;
import com.Stephen.hotel_booking.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*") // 允许前端跨域请求
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private HotelRepository hotelRepository;

    /**
     * 1. 创建预订订单
     * 接收前端传来的 roomId, userId, guestName, guestPhone 等信息
     */
    @PostMapping("/book")
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody Order bookingRequest) {
        System.out.println("Booking Request Content: " + bookingRequest.toString());
        // 获取房间详情
        Room room = roomRepository.findById(bookingRequest.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // 获取关联的酒店详情以取得酒店名称
        Hotel hotel = hotelRepository.findById(room.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        // 执行原子扣减库存
        int updatedRows = roomRepository.decreaseInventory(room.getId());

        if (updatedRows > 0) {
            // 补全订单核心信息
            bookingRequest.setHotelId(room.getHotelId());
            bookingRequest.setHotelName(hotel.getName());   // 存储酒店名
            bookingRequest.setRoomType(room.getRoomType()); // 存储房型名
            bookingRequest.setTotalPrice(room.getPrice());

            // 统一使用 PAID 状态
            bookingRequest.setStatus("PAID");

            // 注意：bookingRequest 中的 guestName 和 guestPhone 会自动被 JPA 持久化到数据库
            Order savedOrder = orderRepository.save(bookingRequest);
            return ResponseEntity.ok(savedOrder);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Inadequate inventory");
        }
    }

    /**
     * 2. 取消订单/退订接口
     * 仅允许 PAID 状态的订单退订，退订后恢复库存
     */
    @PostMapping("/{orderId}/cancel")
    @Transactional
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"PAID".equals(order.getStatus())) {
            return ResponseEntity.badRequest().body("Only PAID orders can be cancelled");
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);

        // 恢复库存
        roomRepository.increaseInventory(order.getRoomId());

        return ResponseEntity.ok("Order cancelled successfully");
    }

    /**
     * 3. 完成订单接口
     */
    @PostMapping("/{orderId}/complete")
    @Transactional
    public ResponseEntity<?> completeOrder(@PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"PAID".equals(order.getStatus())) {
            return ResponseEntity.badRequest().body("Only PAID orders can be completed");
        }

        order.setStatus("COMPLETED");
        order.setCompleteTime(java.time.LocalDateTime.now());
        orderRepository.save(order);

        return ResponseEntity.ok("Order completed successfully");
    }

    /**
     * 4. 根据用户ID获取订单列表
     */
    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {
        return orderRepository.findByUserId(userId);
    }

    /**
     * 5. 获取所有订单（调试用）
     */
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}