package com.Stephen.hotel_booking.service;

import com.Stephen.hotel_booking.entity.Room;
import com.Stephen.hotel_booking.entity.RoomInventory;
import com.Stephen.hotel_booking.repository.RoomRepository;
import com.Stephen.hotel_booking.repository.RoomInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Component
public class InventoryScheduler {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomInventoryRepository inventoryRepository;

    /**
     * Initialize or update inventory to 1 for the next 30 days
     */
    @Scheduled(cron = "* * 14 * * ?")
    @Transactional
    public void initDailyInventory() {
        List<Room> allRooms = roomRepository.findAll();
        LocalDate today = LocalDate.now();

        for (int i = 0; i < 30; i++) {
            LocalDate targetDate = today.plusDays(i);

            for (Room room : allRooms) {
                // Find existing inventory for the specific date
                Optional<RoomInventory> existingOpt = inventoryRepository.findByRoomIdAndInventoryDate(room.getId(), targetDate);

                if (existingOpt.isEmpty()) {
                    // Create new record with inventory 1
                    RoomInventory inventory = new RoomInventory();
                    inventory.setRoomId(room.getId());
                    inventory.setInventoryDate(targetDate);
                    inventory.setRemainingInventory(1);
                    inventoryRepository.save(inventory);
                } else {
                    // Update existing record to 1
                    RoomInventory inventory = existingOpt.get();
                    inventory.setRemainingInventory(1);
                    inventoryRepository.save(inventory);
                }
            }
        }

        // Optional: Update the base inventory in Room table to 1 as well
        allRooms.forEach(room -> {
            room.setTotalInventory(1);
            roomRepository.save(room);
        });
    }
}