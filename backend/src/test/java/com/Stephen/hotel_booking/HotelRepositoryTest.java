package com.Stephen.hotel_booking;

import com.Stephen.hotel_booking.entity.Hotel;
import com.Stephen.hotel_booking.repository.HotelRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class HotelRepositoryTest {

    @Autowired
    private HotelRepository hotelRepository;

    @Test
    public void testSaveAndFindHotel() {
        // 1. Create a new Hotel object 
        Hotel hotel = new Hotel();
        hotel.setName("Test Hilton Hotel");
        hotel.setAddress("123 Test Street");
        hotel.setPrice(888.0);
        hotel.setStarRating(5);

        // 2. Save to database 
        Hotel savedHotel = hotelRepository.save(hotel);

        // 3. Verify the result 
        assertThat(savedHotel).isNotNull(); 
        assertThat(savedHotel.getId()).isGreaterThan(0); 
        

    }
}