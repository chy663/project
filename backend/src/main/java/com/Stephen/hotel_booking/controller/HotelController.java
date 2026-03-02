package com.Stephen.hotel_booking.controller;

import com.Stephen.hotel_booking.entity.Hotel;
import com.Stephen.hotel_booking.entity.Room; // 确保导入了 Room 实体类
import com.Stephen.hotel_booking.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin // 允许跨域请求，方便 uni-app 前端调用
public class HotelController {

    @Autowired
    private HotelService hotelService;

    /**
     * 接口 1: 获取所有酒店列表
     * 用于首页展示
     */
    @GetMapping
    public List<Hotel> getHotels() {
        return hotelService.getAllHotels();
    }

    /**
     * 接口 2: 根据酒店 ID 获取该酒店下的所有房型
     * 用于酒店详情页展示各酒店独特的房型定位（如商务、亲子等）
     * 请求示例: GET http://localhost:8088/api/hotels/1/rooms
     */
    @GetMapping("/{hotelId}/rooms")
    public List<Room> getHotelRooms(@PathVariable Long hotelId) {
        // 调用 Service 层逻辑，该逻辑内部应使用 RoomRepository 查询数据库
        return hotelService.getRoomsByHotelId(hotelId);
    }
}