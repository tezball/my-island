package com.myisland.api.modules.identity.controller;

import com.myisland.api.modules.identity.dto.*;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.service.AuthService;
import com.myisland.api.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "User authentication and registration endpoints")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    @Operation(summary = "Register a new user")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate and get JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout current user")
    public ResponseEntity<Void> logout() {
        // JWT is stateless, so logout is handled client-side by discarding the token
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<AuthResponse.UserDto> getCurrentUser(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = authService.getCurrentUser(userDetails.getUserId());
        return ResponseEntity.ok(AuthResponse.UserDto.from(user));
    }

    @PostMapping("/upgrade/owner")
    @Operation(summary = "Upgrade current user to property owner")
    public ResponseEntity<AuthResponse> upgradeToOwner(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UpgradeToOwnerRequest request
    ) {
        return ResponseEntity.ok(authService.upgradeToOwner(userDetails.getUserId(), request));
    }

    @PostMapping("/upgrade/supplier")
    @Operation(summary = "Upgrade current user to supplier")
    public ResponseEntity<AuthResponse> upgradeToSupplier(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UpgradeToSupplierRequest request
    ) {
        return ResponseEntity.ok(authService.upgradeToSupplier(userDetails.getUserId(), request));
    }
}
