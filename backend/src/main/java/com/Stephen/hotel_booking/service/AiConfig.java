package com.Stephen.hotel_booking.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {

    @Value("${spring.ai.openai.api-key}")
    private String apiKey;

    @Value("${spring.ai.openai.chat.options.model}")
    private String chatModelId;

    public static final String DOUBAO_API_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";

    public String getApiKey() {
        return apiKey;
    }

    public String getChatModelId() {
        return chatModelId;
    }
}