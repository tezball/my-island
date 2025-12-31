package com.myisland.controller;

import com.myisland.dto.ErrorResponse;
import com.myisland.model.Campsite;
import com.myisland.model.User;
import com.myisland.service.AuthService;
import com.myisland.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    private final FavoriteService favoriteService;
    private final AuthService authService;

    public FavoriteController(FavoriteService favoriteService, AuthService authService) {
        this.favoriteService = favoriteService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> getFavorites(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Optional<User> userOpt = authService.getUserFromToken(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(new ErrorResponse("Not authenticated"));
        }

        List<Campsite> favorites = favoriteService.getFavorites(userOpt.get().getId());
        return ResponseEntity.ok(Map.of("favorites", favorites));
    }

    @PostMapping("/{campsiteId}")
    public ResponseEntity<?> toggleFavorite(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable String campsiteId
    ) {
        Optional<User> userOpt = authService.getUserFromToken(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(new ErrorResponse("Not authenticated"));
        }

        boolean saved = favoriteService.toggleFavorite(userOpt.get().getId(), campsiteId);
        return ResponseEntity.ok(Map.of("saved", saved));
    }
}
