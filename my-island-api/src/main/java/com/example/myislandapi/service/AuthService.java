package com.example.myislandapi.service;

import com.example.myislandapi.dto.request.LoginRequest;
import com.example.myislandapi.dto.request.SignupRequest;
import com.example.myislandapi.dto.response.AuthResponse;
import com.example.myislandapi.dto.response.UserResponse;
import com.example.myislandapi.event.EmailEvent;
import com.example.myislandapi.model.UserModel;
import com.example.myislandapi.exception.ConflictException;
import com.example.myislandapi.exception.UnauthorizedException;
import com.example.myislandapi.repository.jdbc.JdbcUserRepository;
import com.example.myislandapi.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    private final JdbcUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EventPublisher eventPublisher;

    public AuthService(JdbcUserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider, EventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public AuthResponse register(SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ConflictException("Email is already registered");
        }

        UserModel user = new UserModel();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setName(request.name());

        user = userRepository.save(user);

        // Publish welcome email event
        eventPublisher.publishEmailEvent(EmailEvent.welcome(user.getId()));

        return generateAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        UserModel user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        return generateAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        String tokenType = jwtTokenProvider.getTokenType(refreshToken);
        if (!"refresh".equals(tokenType)) {
            throw new UnauthorizedException("Invalid token type");
        }

        UUID userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        return generateAuthResponse(user);
    }

    private AuthResponse generateAuthResponse(UserModel user) {
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        UserResponse userResponse = mapToUserResponse(user);

        return new AuthResponse(
                accessToken,
                refreshToken,
                jwtTokenProvider.getAccessTokenExpiration(),
                userResponse
        );
    }

    private UserResponse mapToUserResponse(UserModel user) {
        List<UserResponse.LinkedAccountResponse> linkedAccounts = user.getLinkedAccounts().stream()
                .map(la -> new UserResponse.LinkedAccountResponse(
                        la.getProvider().name().toLowerCase(),
                        la.getEmail(),
                        la.isConnected()
                ))
                .toList();

        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getAvatar(),
                user.getPhone(),
                user.getBio(),
                user.isOwner(),
                user.isSupplier(),
                user.getCreatedAt(),
                UserResponse.NotificationPreferencesResponse.from(user.getNotificationPreferences()),
                linkedAccounts
        );
    }
}
