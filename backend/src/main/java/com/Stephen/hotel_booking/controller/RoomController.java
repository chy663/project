package com.Stephen.hotel_booking.controller;

import com.Stephen.hotel_booking.entity.Room;
import com.Stephen.hotel_booking.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*") // 允许跨域请求
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    /**
     * 根据酒店ID获取该酒店所有房型
     * 对应前端 adminDetail 页面的数据展示
     */
    @GetMapping("/hotel/{hotelId}")
    public List<Room> getRoomsByHotel(@PathVariable Long hotelId) {
        return roomRepository.findByHotelId(hotelId);
    }

    /**
     * 根据房间ID获取单个房间详情
     * 对应前端 adminEditRoom 页面进入时的初始数据回显
     */
    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        return roomRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 更新房间信息
     * 对应前端 adminEditRoom 页面点击 Save 按钮的操作
     */
    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room roomDetails) {
        return roomRepository.findById(id).map(room -> {
            // 核心修改点：只更新价格和最大人数
            room.setPrice(roomDetails.getPrice());
            room.setMaxPeople(roomDetails.getMaxPeople());

            // 如果你未来需要修改房型名称或库存，可以在下面取消注释
            // room.setRoomType(roomDetails.getRoomType());
            // room.setTotalInventory(roomDetails.getTotalInventory());

            Room updatedRoom = roomRepository.save(room);
            return ResponseEntity.ok(updatedRoom);
        }).orElse(ResponseEntity.notFound().build());
    }
}