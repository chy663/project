package com.Stephen.hotel_booking.controller;

import com.Stephen.hotel_booking.entity.Order;
import com.Stephen.hotel_booking.entity.RoomInventory;
import com.Stephen.hotel_booking.repository.OrderRepository;
import com.Stephen.hotel_booking.repository.RoomInventoryRepository;
import com.Stephen.hotel_booking.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RoomInventoryRepository roomInventoryRepository;

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUserId(@PathVariable Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        if (order.getCheckInDate() == null || order.getCheckOutDate() == null) {
            return ResponseEntity.badRequest().body("日期不能为空");
        }
        if (!order.getCheckInDate().isBefore(order.getCheckOutDate())) {
            return ResponseEntity.badRequest().body("入住日期必须早于退房日期");
        }

        LocalDate current = order.getCheckInDate();
        while (current.isBefore(order.getCheckOutDate())) {
            Optional<RoomInventory> inventoryOpt = roomInventoryRepository.findByRoomIdAndInventoryDate(order.getRoomId(), current);

            if (inventoryOpt.isEmpty() || inventoryOpt.get().getRemainingInventory() <= 0) {
                return ResponseEntity.status(400).body(current + " 该日期房间已售罄");
            }

            RoomInventory inventory = inventoryOpt.get();
            inventory.setRemainingInventory(inventory.getRemainingInventory() - 1);
            roomInventoryRepository.save(inventory);

            current = current.plusDays(1);
        }

        int result = roomRepository.decreaseInventory(order.getRoomId());
        if (result == 0) {
            throw new RuntimeException("Room total inventory exhausted");
        }

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    /**
     * Cancel order and restore inventory
     */
    @PostMapping("/{id}/cancel")
    @Transactional
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        Order order = orderRepository.findById(id).orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        // Check if the order is already cancelled or completed
        if ("CANCELLED".equals(order.getStatus())) {
            return ResponseEntity.badRequest().body("订单已是取消状态");
        }

        // 1. Restore daily inventory in RoomInventory table
        LocalDate current = order.getCheckInDate();
        while (current.isBefore(order.getCheckOutDate())) {
            Optional<RoomInventory> inventoryOpt = roomInventoryRepository.findByRoomIdAndInventoryDate(order.getRoomId(), current);

            if (inventoryOpt.isPresent()) {
                RoomInventory inventory = inventoryOpt.get();
                inventory.setRemainingInventory(inventory.getRemainingInventory() + 1);
                roomInventoryRepository.save(inventory);
            }
            // If inventory record doesn't exist for some reason, we skip or handle as needed

            current = current.plusDays(1);
        }

        // 2. Restore total inventory in Room table
        roomRepository.increaseInventory(order.getRoomId());

        // 3. Update order status
        order.setStatus("CANCELLED");
        orderRepository.save(order);

        return ResponseEntity.ok("订单已取消，库存已返还");
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeOrder(@PathVariable Long id) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order != null) {
            order.setStatus("COMPLETED");
            order.setCompleteTime(java.time.LocalDateTime.now());
            orderRepository.save(order);
            return ResponseEntity.ok("已办理入住");
        }
        return ResponseEntity.notFound().build();
    }
}