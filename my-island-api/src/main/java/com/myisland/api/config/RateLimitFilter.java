package com.myisland.api.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitFilter.class);

    private record RateLimitConfig(int maxTokens, long refillPeriodSeconds) {}

    private static final Map<String, RateLimitConfig> RATE_LIMITS = Map.of(
            "/auth/login", new RateLimitConfig(100, 900),           // 100 per 15 min
            "/auth/signup", new RateLimitConfig(10, 3600),          // 10 per hour
            "/auth/forgot-password", new RateLimitConfig(3, 3600),  // 3 per hour
            "/auth/resend-verification", new RateLimitConfig(3, 3600), // 3 per hour
            "/bookings", new RateLimitConfig(20, 3600),             // 20 per hour
            "/reviews", new RateLimitConfig(10, 3600)               // 10 per hour
    );

    // Prefix-based rate limits (matches paths starting with the prefix)
    private record PrefixRateLimitConfig(String prefix, int maxTokens, long refillPeriodSeconds) {}

    private static final List<PrefixRateLimitConfig> PREFIX_RATE_LIMITS = List.of(
            new PrefixRateLimitConfig("/images/", 30, 3600) // 30 image uploads per hour
    );

    private static class TokenBucket {
        double tokens;
        long lastRefillTime;
        final int maxTokens;
        final long refillPeriodSeconds;

        TokenBucket(int maxTokens, long refillPeriodSeconds) {
            this.tokens = maxTokens;
            this.lastRefillTime = System.currentTimeMillis();
            this.maxTokens = maxTokens;
            this.refillPeriodSeconds = refillPeriodSeconds;
        }

        synchronized boolean tryConsume() {
            refill();
            if (tokens >= 1) {
                tokens -= 1;
                return true;
            }
            return false;
        }

        private void refill() {
            long now = System.currentTimeMillis();
            long elapsedMs = now - lastRefillTime;
            double tokensToAdd = (elapsedMs / 1000.0) * ((double) maxTokens / refillPeriodSeconds);
            tokens = Math.min(maxTokens, tokens + tokensToAdd);
            lastRefillTime = now;
        }
    }

    private final ConcurrentHashMap<String, TokenBucket> buckets = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getServletPath();

        // Check exact match first, then prefix match
        RateLimitConfig config = RATE_LIMITS.get(path);
        String rateLimitKey = path;
        if (config == null) {
            for (PrefixRateLimitConfig prefix : PREFIX_RATE_LIMITS) {
                if (path.startsWith(prefix.prefix())) {
                    config = new RateLimitConfig(prefix.maxTokens(), prefix.refillPeriodSeconds());
                    rateLimitKey = prefix.prefix();
                    break;
                }
            }
        }

        if (config == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = extractClientIp(request);
        String bucketKey = clientIp + ":" + rateLimitKey;

        RateLimitConfig finalConfig = config;
        TokenBucket bucket = buckets.computeIfAbsent(bucketKey,
                k -> new TokenBucket(finalConfig.maxTokens, finalConfig.refillPeriodSeconds));

        if (!bucket.tryConsume()) {
            log.warn("Rate limit exceeded for {} on {}", clientIp, path);
            response.setStatus(429);
            response.setContentType("application/json");
            objectMapper.writeValue(response.getWriter(),
                    Map.of("status", 429, "message", "Too many requests. Please try again later."));
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String extractClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    @Scheduled(fixedRate = 900_000) // every 15 minutes
    public void cleanupExpiredBuckets() {
        long now = System.currentTimeMillis();
        long expiryMs = 3600_000; // 1 hour
        buckets.entrySet().removeIf(entry -> {
            TokenBucket bucket = entry.getValue();
            return (now - bucket.lastRefillTime) > expiryMs;
        });
    }
}
