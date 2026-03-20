package com.Stephen.hotel_booking.service;

import com.Stephen.hotel_booking.service.AiConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class DoubaoService {

    @Autowired
    private AiConfig aiConfig;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(60, TimeUnit.SECONDS)
            .build();

    // 核心方法：调用 Flash 模型提取标签
    // DoubaoService.java

    public String extractTags(String content) {
        try {
            String tagPool = "high-speedinternet, ergonomicworkstations, meetingrooms, quietenvironment, " +
                    "boutique, interiordesign, rooftopbar, localattractions, " +
                    "family-oriented, child-friendly, kidsclub, familypool, " +
                    "extended-stay, privatekitchens, laundryfacilities, high-speedwi-fi, " +
                    "affordable, clean, amenities, communalareas";

            String prompt = "You are a hotel booking assistant. Analyze the user query and map it to the most relevant keywords " +
                    "from the following FIXED TAG POOL: [" + tagPool + "]. " +
                    "Rules: " +
                    "1. ONLY output keywords from the pool, separated by commas. " +
                    "2. If no tags match, output 'none'. " +
                    "3. Priority should be given to the most unique features. " +
                    "User Query: " + content;

            Map<String, Object> requestBodyMap = new HashMap<>();
            // 确保这个 ID 在火山引擎后台是“运行中”状态
            requestBodyMap.put("model", "ep-20260320141212-kxtxg");

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "user", "content", prompt));
            requestBodyMap.put("messages", messages);

            String jsonPayload = objectMapper.writeValueAsString(requestBodyMap);

            Request request = new Request.Builder()
                    .url(AiConfig.DOUBAO_API_URL) // <--- 再次确认这里是 chat/completions
                    .addHeader("Authorization", "Bearer " + aiConfig.getApiKey())
                    .post(RequestBody.create(jsonPayload, MediaType.parse("application/json")))
                    .build();

            try (Response response = client.newCall(request).execute()) {
                String responseBody = response.body().string();

                // 如果 API 报错了，这行日志能告诉你为什么（比如 Key 错了或额度没了）
                if (!response.isSuccessful()) {
                    System.err.println("API 调用失败! 状态码: " + response.code() + " 错误详情: " + responseBody);
                    return "";
                }

                JsonNode rootNode = objectMapper.readTree(responseBody);
                String rawContent = rootNode.path("choices").get(0).path("message").path("content").asText();

                System.out.println("AI 原始返回内容: " + rawContent);

                // 清洗数据：转小写、去掉换行、去掉所有空格
                return rawContent.toLowerCase().replace("\n", "").replace(" ", "").trim();
            }
        } catch (Exception e) {
            System.err.println("DoubaoService 发生异常: " + e.getMessage());
            e.printStackTrace();
            return "";
        }
    }
}