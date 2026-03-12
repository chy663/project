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
     * Register: Store the encrypted password using BCrypt
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        // Encode the plain text password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);
        savedUser.setPassword(null); // Remove sensitive info before returning
        return ResponseEntity.ok(savedUser);
    }

    /**
     * Login: Compare plain text with database hash using matches method
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Validation: matches(input_plain_text, database_hash)
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                user.setPassword(null);
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.status(401).body("Invalid username or password");
    }

    /**
     * Update Profile: e.g., changing nickname
     */
    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody User userRequest) {
        return userRepository.findById(id).map(user -> {
            user.setNickname(userRequest.getNickname());
            User updated = userRepository.save(user);
            updated.setPassword(null); // Security: do not return password hash
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Change Password
     * Parameters: oldPassword, newPassword
     */
    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody Map<String, String> passwordMap) {
        String oldPassword = passwordMap.get("oldPassword");
        String newPassword = passwordMap.get("newPassword");

        return userRepository.findById(id).map(user -> {
            // 1. Verify if the old password matches the stored hash
            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                return ResponseEntity.status(401).body("Old password incorrect");
            }
            // 2. Encode the new password and save
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return ResponseEntity.ok("Password updated successfully");
        }).orElse(ResponseEntity.notFound().build());
    }
}