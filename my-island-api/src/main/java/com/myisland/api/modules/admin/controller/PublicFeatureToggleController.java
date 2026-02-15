package com.myisland.api.modules.admin.controller;

import com.myisland.api.modules.admin.service.FeatureToggleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/feature-toggles")
public class PublicFeatureToggleController {

    private final FeatureToggleService featureToggleService;

    public PublicFeatureToggleController(FeatureToggleService featureToggleService) {
        this.featureToggleService = featureToggleService;
    }

    @GetMapping("/enabled")
    public ResponseEntity<Map<String, Boolean>> getEnabledToggles() {
        return ResponseEntity.ok(featureToggleService.getEnabledTogglesMap());
    }
}
