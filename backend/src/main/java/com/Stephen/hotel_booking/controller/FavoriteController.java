package com.Stephen.hotel_booking.controller;

import com.Stephen.hotel_booking.entity.Favorite;
import com.Stephen.hotel_booking.entity.Room;
import com.Stephen.hotel_booking.repository.FavoriteRepository;
import com.Stephen.hotel_booking.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private RoomRepository roomRepository;

    // 切换收藏状态：如果已收藏则取消，未收藏则添加
    @PostMapping("/toggle")
    public ResponseEntity<?> toggleFavorite(@RequestBody Favorite favorite) {
        Optional<Favorite> existing = favoriteRepository.findByUserIdAndRoomId(favorite.getUserId(), favorite.getRoomId());
        if (existing.isPresent()) {
            favoriteRepository.deleteByUserIdAndRoomId(favorite.getUserId(), favorite.getRoomId());
            return ResponseEntity.ok("Removed");
        } else {
            favoriteRepository.save(favorite);
            return ResponseEntity.ok("Added");
        }
    }

    // 获取某个用户的所有已收藏的房间详细信息
    @GetMapping("/user/{userId}/rooms")
    public ResponseEntity<?> getUserFavoriteRooms(@PathVariable Long userId) {
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);
        List<Long> roomIds = favorites.stream().map(Favorite::getRoomId).collect(Collectors.toList());
        List<Room> rooms = roomRepository.findAllById(roomIds);
        return ResponseEntity.ok(rooms);
    }

    // 获取用户收藏的所有 roomId 列表，用于详情页点亮红心
    @GetMapping("/user/{userId}/roomIds")
    public ResponseEntity<List<Long>> getUserFavoriteRoomIds(@PathVariable Long userId) {
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);
        List<Long> roomIds = favorites.stream().map(Favorite::getRoomId).collect(Collectors.toList());
        return ResponseEntity.ok(roomIds);
    }
}