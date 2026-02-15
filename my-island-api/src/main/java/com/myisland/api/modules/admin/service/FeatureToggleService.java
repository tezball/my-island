package com.myisland.api.modules.admin.service;

import com.myisland.api.modules.admin.entity.FeatureToggle;
import com.myisland.api.modules.admin.repository.FeatureToggleRepository;
import com.myisland.api.shared.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FeatureToggleService {

    private final FeatureToggleRepository featureToggleRepository;

    public FeatureToggleService(FeatureToggleRepository featureToggleRepository) {
        this.featureToggleRepository = featureToggleRepository;
    }

    @Transactional(readOnly = true)
    public boolean isEnabled(String name) {
        return featureToggleRepository.findByName(name)
                .map(FeatureToggle::isEnabled)
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public boolean isSubscriptionEnforced() {
        return isEnabled("SUBSCRIPTION_ENFORCEMENT");
    }

    @Transactional(readOnly = true)
    public boolean isBookingEnabled() {
        return isEnabled("BOOKING_ENABLED");
    }

    @Transactional(readOnly = true)
    public List<FeatureToggle> getAllToggles() {
        return featureToggleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Map<String, Boolean> getEnabledTogglesMap() {
        return featureToggleRepository.findAll().stream()
                .collect(Collectors.toMap(FeatureToggle::getName, FeatureToggle::isEnabled));
    }

    @Transactional
    public FeatureToggle updateToggle(String name, boolean enabled, Long adminUserId) {
        FeatureToggle toggle = featureToggleRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Feature toggle not found: " + name));
        toggle.setEnabled(enabled);
        toggle.setUpdatedBy(adminUserId);
        return featureToggleRepository.save(toggle);
    }
}
