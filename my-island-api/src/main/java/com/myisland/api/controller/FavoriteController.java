package com.myisland.api.controller;

import com.myisland.api.dto.response.CampsiteResponse;
import com.myisland.api.entity.Campsite;
import com.myisland.api.entity.User;
import com.myisland.api.exception.ResourceNotFoundException;
import com.myisland.api.repository.CampsiteRepository;
import com.myisland.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final UserRepository userRepository;
    private final CampsiteRepository campsiteRepository;

    @GetMapping
    public ResponseEntity<Map<String, List<CampsiteResponse>>> getFavorites(
        @AuthenticationPrincipal User user
    ) {
        // Re-fetch user to get lazy-loaded favorites
        User fullUser = userRepository.findById(user.getId()).orElseThrow();

        List<CampsiteResponse> favorites = fullUser.getFavorites().stream()
            .map(CampsiteResponse::from)
            .toList();

        return ResponseEntity.ok(Map.of("favorites", favorites));
    }

    @PostMapping("/{campsiteId}")
    @Transactional
    public ResponseEntity<Map<String, Boolean>> toggleFavorite(
        @AuthenticationPrincipal User currentUser,
        @PathVariable UUID campsiteId
    ) {
        User user = userRepository.findById(currentUser.getId()).orElseThrow();
        Campsite campsite = campsiteRepository.findById(campsiteId)
            .orElseThrow(() -> new ResourceNotFoundException("Campsite", campsiteId.toString()));

        boolean isSaved;
        if (user.getFavorites().contains(campsite)) {
            user.getFavorites().remove(campsite);
            isSaved = false;
        } else {
            user.getFavorites().add(campsite);
            isSaved = true;
        }

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("saved", isSaved));
    }
}
