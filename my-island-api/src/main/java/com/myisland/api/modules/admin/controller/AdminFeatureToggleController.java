package com.myisland.api.modules.admin.controller;

import com.myisland.api.modules.admin.dto.FeatureToggleDto;
import com.myisland.api.modules.admin.dto.UpdateFeatureToggleRequest;
import com.myisland.api.modules.admin.entity.FeatureToggle;
import com.myisland.api.modules.admin.service.AdminAuditService;
import com.myisland.api.modules.admin.service.FeatureToggleService;
import com.myisland.api.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/feature-toggles")
public class AdminFeatureToggleController {

    private final FeatureToggleService featureToggleService;
    private final AdminAuditService adminAuditService;

    public AdminFeatureToggleController(FeatureToggleService featureToggleService,
                                        AdminAuditService adminAuditService) {
        this.featureToggleService = featureToggleService;
        this.adminAuditService = adminAuditService;
    }

    @GetMapping
    public ResponseEntity<List<FeatureToggleDto>> getAllToggles() {
        List<FeatureToggleDto> toggles = featureToggleService.getAllToggles().stream()
                .map(FeatureToggleDto::from)
                .toList();
        return ResponseEntity.ok(toggles);
    }

    @PutMapping("/{name}")
    public ResponseEntity<FeatureToggleDto> updateToggle(
            @PathVariable String name,
            @RequestBody UpdateFeatureToggleRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        FeatureToggle toggle = featureToggleService.updateToggle(name, request.enabled(), userDetails.getUserId());

        adminAuditService.log(
                userDetails.getUserId(),
                "TOGGLE_UPDATE",
                "FEATURE_TOGGLE",
                toggle.getId(),
                "Feature toggle '" + name + "' set to " + request.enabled(),
                String.valueOf(!request.enabled()),
                String.valueOf(request.enabled())
        );

        return ResponseEntity.ok(FeatureToggleDto.from(toggle));
    }
}
