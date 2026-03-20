package com.Stephen.hotel_booking;

import com.Stephen.hotel_booking.service.DoubaoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

@SpringBootTest
public class AiTest {

    @Autowired
    private DoubaoService doubaoService;

    @Test
    void testDoubaoDirectCall() {
        System.out.println("--- 正在发起豆包直接调用测试 ---");
        try {
            String response = doubaoService.getChatResponse("你好，请介绍一下你自己，并确认你现在的 API 路径是正确的。");
            System.out.println("豆包回复内容：\n" + response);
        } catch (IOException e) {
            System.err.println("测试失败：" + e.getMessage());
        }
    }
}