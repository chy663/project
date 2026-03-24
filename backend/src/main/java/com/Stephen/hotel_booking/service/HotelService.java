package com.Stephen.hotel_booking.service;

import com.Stephen.hotel_booking.entity.Hotel;
import com.Stephen.hotel_booking.entity.Room;
import com.Stephen.hotel_booking.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private DoubaoService doubaoService;

    public List<Hotel> getAllHotels() {
        return processPriceRanges(hotelRepository.findAll());
    }

    @Transactional
    public void initHotelTags() {
        List<Hotel> hotels = hotelRepository.findAll();
        System.out.println(">>> Starting tag initialization. Total hotels: " + hotels.size());

        for (Hotel hotel : hotels) {
            if (hotel.getTags() != null && !hotel.getTags().trim().isEmpty()) {
                System.out.println("Skipping hotel with existing tags: " + hotel.getName());
                continue;
            }
            try {
                String content = hotel.getName() + " " + (hotel.getDescription() == null ? "" : hotel.getDescription());
                String tags = doubaoService.extractTags(content);

                if (tags != null && !tags.trim().isEmpty()) {
                    String cleanTags = tags.replace("\n", "").replace("\r", "").trim();
                    hotel.setTags(cleanTags);
                    hotelRepository.save(hotel);
                    hotelRepository.flush();
                    System.out.println(">>> Hotel [" + hotel.getName() + "] tags generated successfully: " + cleanTags);
                } else {
                    System.err.println(">>> Hotel [" + hotel.getName() + "] AI returned no valid tags");
                }
            } catch (Exception e) {
                System.err.println(">>> Exception occurred while processing hotel [" + hotel.getName() + "]: " + e.getMessage());
            }
        }
        System.out.println(">>> All hotels processed successfully!");
    }

    private final Map<String, String> queryCache = new ConcurrentHashMap<>();

    public List<Hotel> searchByAiTags(String query) {
        List<Hotel> allHotels = hotelRepository.findAll();

        if (query == null || query.trim().isEmpty() || "undefined".equals(query)) {
            return processPriceRanges(allHotels);
        }

        String searchResult;
        String trimmedQuery = query.trim().toLowerCase();

        if (queryCache.containsKey(trimmedQuery)) {
            searchResult = queryCache.get(trimmedQuery);
        } else {
            searchResult = doubaoService.extractTags(trimmedQuery);
            if (searchResult != null && !searchResult.trim().isEmpty()) {
                queryCache.put(trimmedQuery, searchResult);
            }
        }

        if (searchResult == null || searchResult.trim().isEmpty() || searchResult.contains("none")) {
            return new ArrayList<>();
        }

        List<String> keywords = Arrays.stream(searchResult.toLowerCase()
                        .replace("\"", "").replace("'", "").split("[,，]"))
                .map(String::trim)
                .filter(k -> !k.isEmpty())
                .collect(Collectors.toList());

        List<Hotel> filteredList = allHotels.stream()
                .filter(h -> h.getTags() != null && !h.getTags().isEmpty())
                .map(h -> {
                    String hotelTags = h.getTags().toLowerCase();
                    long matchCount = keywords.stream().filter(hotelTags::contains).count();
                    h.setSearchScore((double) matchCount / keywords.size());
                    return h;
                })
                .filter(h -> h.getSearchScore() >= 0.25)
                .sorted((a, b) -> {
                    int scoreCompare = Double.compare(b.getSearchScore(), a.getSearchScore());
                    return scoreCompare != 0 ? scoreCompare : a.getId().compareTo(b.getId());
                })
                .collect(Collectors.toList());

        return processPriceRanges(filteredList);
    }

    /**
     * 处理酒店列表的价格区间
     */
    @Transactional
    public List<Hotel> processPriceRanges(List<Hotel> hotels) {
        return hotels.stream().map(this::processPriceRanges).collect(Collectors.toList());
    }

    /**
     * 处理单个酒店的价格区间并同步到数据库
     */
    @Transactional
    public Hotel processPriceRanges(Hotel hotel) {
        List<Room> rooms = hotel.getRooms();
        if (rooms != null && !rooms.isEmpty()) {
            double min = rooms.stream().mapToDouble(Room::getPrice).min().orElse(0);
            double max = rooms.stream().mapToDouble(Room::getPrice).max().orElse(0);

            String priceStr = (min == max) ? String.valueOf((int)min) : (int)min + " - " + (int)max;

            hotel.setPrice(priceStr);
            hotelRepository.save(hotel); // 保存修改到数据库
        } else {
            hotel.setPrice("N/A");
        }
        return hotel;
    }
}