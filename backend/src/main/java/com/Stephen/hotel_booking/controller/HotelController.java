package com.Stephen.hotel_booking.controller;

import com.Stephen.hotel_booking.entity.Hotel;
import com.Stephen.hotel_booking.repository.HotelRepository;
import com.Stephen.hotel_booking.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "*")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @Autowired
    private HotelRepository hotelRepository;

    @GetMapping("/init-ai-vectors")
    public String init() {
        hotelService.initHotelTags();
        return "Tags Initialized!";
    }

    @GetMapping("/ai-search")
    public List<Hotel> aiSearch(@RequestParam String query) {
        return hotelService.searchByAiTags(query);
    }

    /**
     * 获取酒店列表
     * 如果提供了 startDate 和 endDate，则只返回在该时间段内有库存的酒店
     */
    @GetMapping
    public List<Hotel> getAllHotels(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<Hotel> hotels;

        if (startDate != null && endDate != null) {
            // 核心逻辑：只获取在选定时间内至少有一个房间每天都有库存的酒店
            hotels = hotelRepository.findAvailableHotels(startDate, endDate);
        } else {
            // 默认逻辑：获取所有酒店
            hotels = hotelRepository.findAll();
        }

        // 统一调用 Service 层处理动态价格区间显示逻辑
        return hotelService.processPriceRanges(hotels);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        return hotelRepository.findById(id)
                .map(hotel -> ResponseEntity.ok(hotelService.processPriceRanges(hotel)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/admin/{adminId}")
    public ResponseEntity<Hotel> getHotelByAdmin(@PathVariable Long adminId) {
        return hotelRepository.findByAdminId(adminId)
                .map(hotel -> {
                    // 关键：在返回管理员端前处理动态价格并保存
                    Hotel processedHotel = hotelService.processPriceRanges(hotel);
                    return ResponseEntity.ok(processedHotel);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}