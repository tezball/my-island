package com.example.myislandapi.controller;

import com.example.myislandapi.dto.response.CampsiteResponse;
import com.example.myislandapi.security.UserDetailsImpl;
import com.example.myislandapi.service.FavoriteService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public ResponseEntity<Page<CampsiteResponse>> getFavorites(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(favoriteService.getUserFavorites(userDetails.getId(), pageable));
    }

    @PostMapping("/{campsiteId}")
    public ResponseEntity<Void> addFavorite(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID campsiteId) {
        favoriteService.addFavorite(userDetails.getId(), campsiteId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{campsiteId}")
    public ResponseEntity<Void> removeFavorite(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID campsiteId) {
        favoriteService.removeFavorite(userDetails.getId(), campsiteId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{campsiteId}/check")
    public ResponseEntity<Boolean> isFavorite(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID campsiteId) {
        return ResponseEntity.ok(favoriteService.isFavorite(userDetails.getId(), campsiteId));
    }
}
