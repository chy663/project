package com.Stephen.hotel_booking.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {

    @Value("${spring.ai.openai.api-key}")
    private String apiKey;

    @Value("${spring.ai.openai.embedding.options.model}")
    private String modelId;

    // 豆包 API V3 标准聊天地址
    public static final String DOUBAO_API_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";

    public String getApiKey() {
        return apiKey;
    }

    public String getModelId() {
        return modelId;
    }
}