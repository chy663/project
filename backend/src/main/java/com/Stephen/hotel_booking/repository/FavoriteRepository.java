package com.Stephen.hotel_booking.repository;

import com.Stephen.hotel_booking.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Long userId);

    Optional<Favorite> findByUserIdAndRoomId(Long userId, Long roomId);

    @Transactional
    void deleteByUserIdAndRoomId(Long userId, Long roomId);
}