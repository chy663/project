package com.Stephen.hotel_booking.controller;

import com.Stephen.hotel_booking.entity.Order;
import com.Stephen.hotel_booking.entity.Room;
import com.Stephen.hotel_booking.entity.Hotel;
import com.Stephen.hotel_booking.repository.OrderRepository;
import com.Stephen.hotel_booking.repository.RoomRepository;
import com.Stephen.hotel_booking.repository.HotelRepository;
import com.Stephen.hotel_booking.service.DoubaoService;
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

    @Autowired
    private DoubaoService doubaoService;

    @PostMapping("/book")
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody Order bookingRequest) {
        System.out.println("Booking Request Content: " + bookingRequest.toString());

        Room room = roomRepository.findById(bookingRequest.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Hotel hotel = hotelRepository.findById(room.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        int updatedRows = roomRepository.decreaseInventory(room.getId());

        if (updatedRows > 0) {
            bookingRequest.setHotelId(room.getHotelId());
            bookingRequest.setHotelName(hotel.getName());
            bookingRequest.setRoomType(room.getRoomType());
            bookingRequest.setTotalPrice(room.getPrice());
            bookingRequest.setStatus("PAID");

            Order savedOrder = orderRepository.save(bookingRequest);
            return ResponseEntity.ok(savedOrder);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Inadequate inventory");
        }
    }

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

        roomRepository.increaseInventory(order.getRoomId());

        return ResponseEntity.ok("Order cancelled successfully");
    }

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

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/{orderId}/ai-guide")
    @Transactional
    public ResponseEntity<?> generateAiGuide(@PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"COMPLETED".equals(order.getStatus())) {
            return ResponseEntity.badRequest().body("Only COMPLETED orders can generate AI guide");
        }

        if (order.getAiGuide() != null && !order.getAiGuide().trim().isEmpty()) {
            return ResponseEntity.ok(order.getAiGuide());
        }

        Hotel hotel = hotelRepository.findById(order.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        String guide = doubaoService.generateTravelGuide(
                hotel.getAddress(),
                hotel.getDescription(),
                order.getRoomType()
        );

        if (!guide.startsWith("Failed") && !guide.startsWith("Error")) {
            order.setAiGuide(guide);
            orderRepository.save(order);
        }

        return ResponseEntity.ok(guide);
    }
}