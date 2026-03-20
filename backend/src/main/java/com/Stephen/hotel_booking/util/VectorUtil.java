package com.Stephen.hotel_booking.util;

import java.util.List;

public class VectorUtil {
    /**
     * 计算两个向量之间的余弦相似度
     * 范围 [-1, 1]，越接近 1 表示越相似
     */
    public static double cosineSimilarity(float[] vectorA, float[] vectorB) {
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += Math.pow(vectorA[i], 2);
            normB += Math.pow(vectorB[i], 2);
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}