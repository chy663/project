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
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private HotelRepository hotelRepository;

    /**
     * 1. 创建预订订单
     * 自动补全酒店名称和房型名称，并统一状态为 PAID
     */
    @PostMapping("/book")
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody Order bookingRequest) {
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

            Order savedOrder = orderRepository.save(bookingRequest);
            return ResponseEntity.ok(savedOrder);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Inadequate inventory");
        }
    }

    /**
     * 2. 取消订单/退订接口
     * 严格校验：仅允许 PAID 状态的订单退订，退订后恢复库存，状态变为 CANCELLED
     */
    @PostMapping("/{orderId}/cancel")
    @Transactional
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // 校验：目前只处理 PAID 状态的退订
        if (!"PAID".equals(order.getStatus())) {
            return ResponseEntity.badRequest().body("Only PAID orders can be cancelled");
        }

        // 修改订单状态为 CANCELLED
        order.setStatus("CANCELLED");
        orderRepository.save(order);

        // 调用 RoomRepository 恢复库存
        roomRepository.increaseInventory(order.getRoomId());

        return ResponseEntity.ok("Order cancelled successfully");
    }

    /**
     * 3. 完成订单接口 (新增)
     * 将订单状态从 PAID 改为 COMPLETED（代表用户已入住/离店，不需要修改库存）
     */
    @PostMapping("/{orderId}/complete")
    @Transactional
    public ResponseEntity<?> completeOrder(@PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"PAID".equals(order.getStatus())) {
            return ResponseEntity.badRequest().body("Only PAID orders can be completed");
        }

        // 1. 修改订单状态为 COMPLETED
        order.setStatus("COMPLETED");

        // 2. 记录当前时间为完成时间
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