package com.Stephen.hotel_booking.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class DoubaoService {

    @Autowired
    private AiConfig aiConfig;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(60, TimeUnit.SECONDS)
            .readTimeout(120, TimeUnit.SECONDS)
            .writeTimeout(120, TimeUnit.SECONDS)
            .build();

    public String extractTags(String content) {
        try {
            String tagPool = "high-speedinternet, ergonomicworkstations, meetingrooms, quietenvironment, " +
                    "boutique, interiordesign, rooftopbar, localattractions, " +
                    "family-oriented, child-friendly, kidsclub, familypool, " +
                    "extended-stay, privatekitchens, laundryfacilities, high-speedwi-fi, " +
                    "affordable, clean, amenities, communalareas, luxury, spa, wellness, " +
                    "gym, fitnesscenter, pet-friendly, beachfront, oceanview, citycenter, " +
                    "eco-friendly, sustainable, all-inclusive, free-parking, airport-shuttle, " +
                    "adults-only, romantic, honeymoon, businesscenter, ev-charging, " +
                    "smart-room, voice-control, casino, golf-course, ski-in-ski-out, " +
                    "historic, castle, glamping, budget, hostel, backpacker, disabled-access, " +
                    "wheelchair-accessible, vegan-options, halal-food, kosher-food";

            String prompt = "You are a hotel booking assistant. Analyze the user query and map it to the most relevant keywords " +
                    "from the following FIXED TAG POOL: [" + tagPool + "]. " +
                    "Rules: " +
                    "1. ONLY output keywords from the pool, separated by commas. " +
                    "2. If no tags match, output 'none'. " +
                    "3. Priority should be given to the most unique features. " +
                    "User Query: " + content;

            Map<String, Object> requestBodyMap = new HashMap<>();
            requestBodyMap.put("model", aiConfig.getChatModelId());

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "user", "content", prompt));
            requestBodyMap.put("messages", messages);

            String jsonPayload = objectMapper.writeValueAsString(requestBodyMap);

            Request request = new Request.Builder()
                    .url(AiConfig.DOUBAO_API_URL)
                    .addHeader("Authorization", "Bearer " + aiConfig.getApiKey())
                    .post(RequestBody.create(jsonPayload, MediaType.parse("application/json")))
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    System.err.println("API Request Failed! Status: " + response.code());
                    return "";
                }

                String responseBody = response.body().string();
                JsonNode rootNode = objectMapper.readTree(responseBody);
                String rawContent = rootNode.path("choices").get(0).path("message").path("content").asText();

                System.out.println("AI Raw Content: " + rawContent);

                return rawContent.toLowerCase().replace("\n", "").replace(" ", "").trim();
            }
        } catch (Exception e) {
            System.err.println("DoubaoService Exception: " + e.getMessage());
            return "";
        }
    }

    public String generateTravelGuide(String hotelLocation, String hotelDescription, String roomType) {
        try {
            String prompt = "You are an expert travel guide. Analyze the following hotel booking information to infer the location and user preferences. " +
                    "Generate a detailed, step-by-step travel guide for the area surrounding the hotel. " +
                    "Provide actionable recommendations for attractions, dining, and activities.\n" +
                    "Hotel Location: " + hotelLocation + "\n" +
                    "Hotel Description: " + hotelDescription + "\n" +
                    "Room Type: " + roomType + "\n" +
                    "Output the guide clearly using formatting, headings, and bullet points in English.";

            Map<String, Object> requestBodyMap = new HashMap<>();
            requestBodyMap.put("model", aiConfig.getChatModelId());

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "user", "content", prompt));
            requestBodyMap.put("messages", messages);

            String jsonPayload = objectMapper.writeValueAsString(requestBodyMap);

            Request request = new Request.Builder()
                    .url(AiConfig.DOUBAO_API_URL)
                    .addHeader("Authorization", "Bearer " + aiConfig.getApiKey())
                    .post(RequestBody.create(jsonPayload, MediaType.parse("application/json")))
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    System.err.println("API Request Failed! Status: " + response.code());
                    return "Failed to generate travel guide.";
                }

                String responseBody = response.body().string();
                JsonNode rootNode = objectMapper.readTree(responseBody);
                return rootNode.path("choices").get(0).path("message").path("content").asText();
            }
        } catch (Exception e) {
            System.err.println("DoubaoService Exception: " + e.getMessage());
            return "Error generating travel guide.";
        }
    }
}