package com.Stephen.hotel_booking.service;

import com.Stephen.hotel_booking.entity.Hotel;
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
        return hotelRepository.findAll();
    }

    /**
     * Initialize tags
     * @Transactional ensures save operations are committed to MySQL in real-time
     */
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
                // Combine name and description for analysis
                String content = hotel.getName() + " " + (hotel.getDescription() == null ? "" : hotel.getDescription());
                String tags = doubaoService.extractTags(content);

                if (tags != null && !tags.trim().isEmpty()) {
                    // Clean potential whitespaces or line breaks
                    String cleanTags = tags.replace("\n", "").replace("\r", "").trim();
                    hotel.setTags(cleanTags);

                    // Save and force immediate write to database
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

    /**
     * Execute AI Semantic Search
     */
    private final Map<String, String> queryCache = new ConcurrentHashMap<>();

    public List<Hotel> searchByAiTags(String query) {
        // 1. Get all hotels for processing
        List<Hotel> allHotels = hotelRepository.findAll();

        // 2. Default homepage logic: if query is empty or undefined, return all
        if (query == null || query.trim().isEmpty() || "undefined".equals(query)) {
            System.out.println(">>> Query is empty. Displaying all hotels.");
            return allHotels;
        }

        // 3. AI result retrieval (with caching logic)
        String searchResult;
        String trimmedQuery = query.trim().toLowerCase();

        if (queryCache.containsKey(trimmedQuery)) {
            searchResult = queryCache.get(trimmedQuery);
            System.out.println(">>> Cache hit: [" + trimmedQuery + "] -> " + searchResult);
        } else {
            System.out.println(">>> Requesting AI tag extraction: " + trimmedQuery);
            searchResult = doubaoService.extractTags(trimmedQuery);
            if (searchResult != null && !searchResult.trim().isEmpty()) {
                queryCache.put(trimmedQuery, searchResult);
            }
        }

        // 4. AI result validation
        if (searchResult == null || searchResult.trim().isEmpty() || searchResult.contains("none")) {
            System.out.println(">>> AI failed to identify intent. Returning empty results.");
            return new ArrayList<>();
        }

        // 5. Process AI keywords into a clean List
        System.out.println(">>> Executing AI semantic search for: " + query);
        List<String> keywords = Arrays.stream(searchResult.toLowerCase()
                        .replace("\"", "").replace("'", "").split("[,，]"))
                .map(String::trim)
                .filter(k -> !k.isEmpty())
                .collect(Collectors.toList());

        System.out.println(">>> Final matching keywords: " + keywords);

        // 6. Execute weighted filtering and sorting
        List<Hotel> filteredList = allHotels.stream()
                .filter(h -> h.getTags() != null && !h.getTags().isEmpty())
                .map(h -> {
                    String hotelTags = h.getTags().toLowerCase();
                    // Count how many search keywords match the hotel tags
                    long matchCount = keywords.stream()
                            .filter(hotelTags::contains)
                            .count();

                    // Calculate match score (matches / total keywords)
                    double score = (double) matchCount / keywords.size();
                    h.setSearchScore(score);
                    return h;
                })
                // --- Accuracy Filtering ---
                // Threshold: Only display hotels with at least 25% match rate.
                .filter(h -> h.getSearchScore() >= 0.25)
                // Sort by score (descending), then by ID for consistency
                .sorted((a, b) -> {
                    int scoreCompare = Double.compare(b.getSearchScore(), a.getSearchScore());
                    return scoreCompare != 0 ? scoreCompare : a.getId().compareTo(b.getId());
                })
                .collect(Collectors.toList());

        System.out.println(">>> Search completed. Matching hotels found: " + filteredList.size());
        return filteredList;
    }
}