package com.myisland.api.service;

import com.myisland.api.dto.request.LoginRequest;
import com.myisland.api.dto.response.AuthResponse;
import com.myisland.api.dto.response.UserResponse;
import com.myisland.api.entity.User;
import com.myisland.api.repository.UserRepository;
import com.myisland.api.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = tokenProvider.generateToken(user.getId().toString());

        return AuthResponse.builder()
            .user(UserResponse.from(user))
            .token(token)
            .build();
    }

    public UserResponse getCurrentUser(User user) {
        return UserResponse.from(user);
    }
}
