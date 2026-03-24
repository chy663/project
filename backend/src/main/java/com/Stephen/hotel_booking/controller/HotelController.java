package com.Stephen.hotel_booking.controller;

import com.Stephen.hotel_booking.entity.Hotel;
import com.Stephen.hotel_booking.repository.HotelRepository;
import com.Stephen.hotel_booking.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping
    public List<Hotel> getAllHotels() {
        // 调用 Service 层带价格处理的方法
        return hotelService.getAllHotels();
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