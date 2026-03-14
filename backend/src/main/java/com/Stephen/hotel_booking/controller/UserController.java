package com.Stephen.hotel_booking.controller;

import com.Stephen.hotel_booking.entity.User;
import com.Stephen.hotel_booking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    /**
     * 注册：存储角色信息并加密密码
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        // 如果注册时没有指定角色，默认设为 USER
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        // 加密原始密码
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);
        savedUser.setPassword(null); // 返回前清空密码，保护隐私
        return ResponseEntity.ok(savedUser);
    }

    /**
     * 登录：验证哈希密码并返回包含 role 的用户信息
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // 验证密码：matches(输入的明文, 数据库中的哈希)
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                // 克隆一个对象用于返回，避免影响持久化上下文，或手动置空密码
                User responseUser = new User();
                responseUser.setId(user.getId());
                responseUser.setUsername(user.getUsername());
                responseUser.setNickname(user.getNickname());
                responseUser.setRole(user.getRole()); // 确保 role 返回给前端
                return ResponseEntity.ok(responseUser);
            }
        }
        return ResponseEntity.status(401).body("Invalid username or password");
    }

    /**
     * 更新个人资料
     */
    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody User userRequest) {
        return userRepository.findById(id).map(user -> {
            user.setNickname(userRequest.getNickname());
            User updated = userRepository.save(user);
            updated.setPassword(null);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * 修改密码
     */
    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody Map<String, String> passwordMap) {
        String oldPassword = passwordMap.get("oldPassword");
        String newPassword = passwordMap.get("newPassword");

        return userRepository.findById(id).map(user -> {
            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                return ResponseEntity.status(401).body("Old password incorrect");
            }
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return ResponseEntity.ok("Password updated successfully");
        }).orElse(ResponseEntity.notFound().build());
    }
}