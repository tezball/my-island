package com.myisland.api.modules.accommodation.controller;

import com.myisland.api.modules.accommodation.entity.SavedLot;
import com.myisland.api.modules.accommodation.entity.Lot;
import com.myisland.api.modules.accommodation.repository.LotRepository;
import com.myisland.api.modules.accommodation.repository.SavedLotRepository;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.repository.UserRepository;
import com.myisland.api.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/saved")
@Tag(name = "Saved Lots", description = "Save/unsave favorite lots")
public class SavedLotController {

    private final SavedLotRepository savedLotRepository;
    private final UserRepository userRepository;
    private final LotRepository lotRepository;

    public SavedLotController(SavedLotRepository savedLotRepository,
                              UserRepository userRepository,
                              LotRepository lotRepository) {
        this.savedLotRepository = savedLotRepository;
        this.userRepository = userRepository;
        this.lotRepository = lotRepository;
    }

    @GetMapping
    @Operation(summary = "Get saved lot IDs for the current user")
    public ResponseEntity<List<Long>> getSavedLotIds(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Long> lotIds = savedLotRepository.findByUserIdOrderByCreatedAtDesc(userDetails.getUserId())
                .stream()
                .map(sl -> sl.getLot().getId())
                .toList();
        return ResponseEntity.ok(lotIds);
    }

    @PostMapping("/{lotId}")
    @Operation(summary = "Save a lot as favorite")
    @Transactional
    public ResponseEntity<Void> saveLot(
            @PathVariable Long lotId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        if (savedLotRepository.existsByUserIdAndLotId(userDetails.getUserId(), lotId)) {
            return ResponseEntity.ok().build();
        }

        User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Lot lot = lotRepository.findById(lotId)
                .orElseThrow(() -> new RuntimeException("Lot not found"));

        savedLotRepository.save(new SavedLot(user, lot));
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{lotId}")
    @Operation(summary = "Unsave a lot")
    @Transactional
    public ResponseEntity<Void> unsaveLot(
            @PathVariable Long lotId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        savedLotRepository.deleteByUserIdAndLotId(userDetails.getUserId(), lotId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check/{lotId}")
    @Operation(summary = "Check if a lot is saved")
    public ResponseEntity<Boolean> isLotSaved(
            @PathVariable Long lotId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        boolean isSaved = savedLotRepository.existsByUserIdAndLotId(userDetails.getUserId(), lotId);
        return ResponseEntity.ok(isSaved);
    }

    @PostMapping("/bulk")
    @Operation(summary = "Bulk save lot IDs (for merging localStorage on login)")
    @Transactional
    public ResponseEntity<Void> bulkSaveLots(
            @RequestBody List<Long> lotIds,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        for (Long lotId : lotIds) {
            if (!savedLotRepository.existsByUserIdAndLotId(userDetails.getUserId(), lotId)) {
                Lot lot = lotRepository.findById(lotId).orElse(null);
                if (lot != null) {
                    savedLotRepository.save(new SavedLot(user, lot));
                }
            }
        }
        return ResponseEntity.ok().build();
    }
}
