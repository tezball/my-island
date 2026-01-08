package com.example.myislandapi.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for managing password reset tokens.
 * Uses in-memory storage with automatic expiration cleanup.
 * For production, consider using Redis or database storage.
 */
@Service
public class PasswordResetTokenService {

    private static final long TOKEN_EXPIRY_HOURS = 1;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private record TokenData(UUID userId, Instant expiresAt) {}

    private final Map<String, TokenData> tokenStore = new ConcurrentHashMap<>();

    /**
     * Generate a secure reset token for a user.
     */
    public String generateToken(UUID userId) {
        // Generate a secure random token
        byte[] tokenBytes = new byte[32];
        SECURE_RANDOM.nextBytes(tokenBytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);

        // Store with expiration
        Instant expiresAt = Instant.now().plusSeconds(TOKEN_EXPIRY_HOURS * 3600);
        tokenStore.put(token, new TokenData(userId, expiresAt));

        return token;
    }

    /**
     * Validate a token and return the associated user ID if valid.
     */
    public Optional<UUID> validateToken(String token) {
        TokenData data = tokenStore.get(token);
        if (data == null) {
            return Optional.empty();
        }

        if (Instant.now().isAfter(data.expiresAt())) {
            tokenStore.remove(token);
            return Optional.empty();
        }

        return Optional.of(data.userId());
    }

    /**
     * Invalidate a token after use.
     */
    public void invalidateToken(String token) {
        tokenStore.remove(token);
    }

    /**
     * Cleanup expired tokens every 15 minutes.
     */
    @Scheduled(fixedRate = 900000)
    public void cleanupExpiredTokens() {
        Instant now = Instant.now();
        tokenStore.entrySet().removeIf(entry -> now.isAfter(entry.getValue().expiresAt()));
    }
}
