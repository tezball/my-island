package com.example.myislandapi.service;

import com.example.myislandapi.dto.request.PropertyDraftRequest;
import com.example.myislandapi.dto.response.CampsiteDetailResponse;
import com.example.myislandapi.dto.response.PropertyDraftResponse;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.model.PropertyDraftModel;
import com.example.myislandapi.model.UserModel;
import com.example.myislandapi.repository.jdbc.JdbcPropertyDraftRepository;
import com.example.myislandapi.repository.jdbc.JdbcUserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class PropertySetupService {

    private static final Logger log = LoggerFactory.getLogger(PropertySetupService.class);

    private final JdbcPropertyDraftRepository draftRepository;
    private final JdbcUserRepository userRepository;
    private final CampsiteService campsiteService;
    private final EventPublisher eventPublisher;
    private final ObjectMapper objectMapper;

    public PropertySetupService(
            JdbcPropertyDraftRepository draftRepository,
            JdbcUserRepository userRepository,
            CampsiteService campsiteService,
            EventPublisher eventPublisher,
            ObjectMapper objectMapper) {
        this.draftRepository = draftRepository;
        this.userRepository = userRepository;
        this.campsiteService = campsiteService;
        this.eventPublisher = eventPublisher;
        this.objectMapper = objectMapper;
    }

    /**
     * Get the current draft for an owner.
     */
    @Transactional(readOnly = true)
    public Optional<PropertyDraftResponse> getDraft(UUID ownerId) {
        return draftRepository.findByOwnerId(ownerId)
                .map(this::toResponse);
    }

    /**
     * Save or update the draft for an owner.
     * Each owner can only have one draft at a time.
     */
    public PropertyDraftResponse saveDraft(UUID ownerId, PropertyDraftRequest request) {
        UserModel owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String dataJson;
        try {
            dataJson = objectMapper.writeValueAsString(request);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize draft data", e);
        }

        PropertyDraftModel draft = draftRepository.findByOwnerId(ownerId)
                .map(existing -> {
                    existing.setPropertyType(request.propertyType());
                    existing.setData(dataJson);
                    return existing;
                })
                .orElseGet(() -> {
                    PropertyDraftModel newDraft = new PropertyDraftModel();
                    newDraft.setOwnerId(ownerId);
                    newDraft.setPropertyType(request.propertyType());
                    newDraft.setData(dataJson);
                    return newDraft;
                });

        PropertyDraftModel saved = draftRepository.save(draft);

        // Publish Kafka event
        eventPublisher.publishPropertyDraftSaved(saved.getId(), ownerId, request.propertyType());

        log.info("Saved property draft {} for owner {}", saved.getId(), ownerId);
        return toResponse(saved);
    }

    /**
     * Delete the draft for an owner.
     */
    public void deleteDraft(UUID ownerId) {
        draftRepository.deleteByOwnerId(ownerId);
        log.info("Deleted property draft for owner {}", ownerId);
    }

    /**
     * Publish the draft as a real property.
     * This creates the campsite/lots from the draft data and deletes the draft.
     */
    public CampsiteDetailResponse publishDraft(UUID draftId, UUID ownerId) {
        PropertyDraftModel draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new ResourceNotFoundException("Draft not found"));

        if (!draft.getOwnerId().equals(ownerId)) {
            throw new IllegalArgumentException("Draft does not belong to this owner");
        }

        PropertyDraftRequest draftData;
        try {
            draftData = objectMapper.readValue(draft.getData(), PropertyDraftRequest.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize draft data", e);
        }

        // Create the campsite using existing CampsiteService
        CampsiteDetailResponse campsite = campsiteService.createCampsiteFromDraft(ownerId, draftData);

        // Delete the draft
        draftRepository.deleteById(draft.getId());

        // Publish Kafka events
        eventPublisher.publishPropertyCreated(campsite.id(), ownerId, draft.getPropertyType());
        eventPublisher.publishPropertyPendingReview(campsite.id(), ownerId);

        log.info("Published property {} from draft {} for owner {}", campsite.id(), draftId, ownerId);
        return campsite;
    }

    private PropertyDraftResponse toResponse(PropertyDraftModel draft) {
        Object data;
        try {
            data = objectMapper.readValue(draft.getData(), Object.class);
        } catch (JsonProcessingException e) {
            data = draft.getData();
        }

        return new PropertyDraftResponse(
                draft.getId(),
                draft.getPropertyType(),
                data,
                draft.getCreatedAt(),
                draft.getUpdatedAt()
        );
    }
}
