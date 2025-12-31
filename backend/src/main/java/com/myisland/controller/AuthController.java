package com.myisland.controller;

import com.myisland.dto.AuthResponse;
import com.myisland.dto.ErrorResponse;
import com.myisland.dto.LoginRequest;
import com.myisland.model.User;
import com.myisland.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<AuthResponse> response = authService.login(request);
        if (response.isPresent()) {
            return ResponseEntity.ok(response.get());
        }
        return ResponseEntity.status(401).body(new ErrorResponse("Invalid email or password"));
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin() {
        Optional<AuthResponse> response = authService.googleLogin();
        if (response.isPresent()) {
            return ResponseEntity.ok(response.get());
        }
        return ResponseEntity.status(500).body(new ErrorResponse("Google login failed"));
    }

    @GetMapping("/google/callback")
    public ResponseEntity<?> googleCallback() {
        Optional<AuthResponse> response = authService.googleLogin();
        if (response.isPresent()) {
            return ResponseEntity.ok(response.get());
        }
        return ResponseEntity.status(500).body(new ErrorResponse("Google login failed"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        authService.logout(authHeader);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        Optional<User> user = authService.getUserFromToken(authHeader);
        if (user.isPresent()) {
            return ResponseEntity.ok(Map.of("user", user.get()));
        }
        return ResponseEntity.status(401).body(new ErrorResponse("Not authenticated"));
    }
}
