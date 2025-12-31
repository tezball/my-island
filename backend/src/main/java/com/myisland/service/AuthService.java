package com.myisland.service;

import com.myisland.dto.AuthResponse;
import com.myisland.dto.LoginRequest;
import com.myisland.model.User;
import com.myisland.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final Map<String, String> tokenToUserId = new ConcurrentHashMap<>();

    // Mock credentials for 3 user types
    private static final Map<String, String> MOCK_CREDENTIALS = Map.of(
        "visitor@my-island.com", "visitor123",
        "owner@my-island.com", "owner123",
        "supplier@my-island.com", "supplier123"
    );

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<AuthResponse> login(LoginRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();

        // Check if credentials match any mock user
        String expectedPassword = MOCK_CREDENTIALS.get(email.toLowerCase());
        if (expectedPassword != null && expectedPassword.equals(password)) {
            User user = userRepository.findByEmail(email.toLowerCase()).orElse(null);
            if (user != null) {
                String token = "mock-jwt-token-" + user.getRole() + "-" + System.currentTimeMillis();
                tokenToUserId.put(token, user.getId());
                return Optional.of(AuthResponse.builder()
                        .user(user)
                        .token(token)
                        .build());
            }
        }
        return Optional.empty();
    }

    public Optional<AuthResponse> googleLogin() {
        // Google login defaults to owner account for demo purposes
        User user = userRepository.findByEmail("owner@my-island.com").orElse(null);
        if (user != null) {
            String token = "mock-google-jwt-token-" + System.currentTimeMillis();
            tokenToUserId.put(token, user.getId());
            return Optional.of(AuthResponse.builder()
                    .user(user)
                    .token(token)
                    .build());
        }
        return Optional.empty();
    }

    public void logout(String token) {
        if (token != null) {
            tokenToUserId.remove(token.replace("Bearer ", ""));
        }
    }

    public Optional<User> getUserFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Optional.empty();
        }
        String token = authHeader.substring(7);
        String userId = tokenToUserId.get(token);
        if (userId == null) {
            return Optional.empty();
        }
        return userRepository.findById(userId);
    }
}
