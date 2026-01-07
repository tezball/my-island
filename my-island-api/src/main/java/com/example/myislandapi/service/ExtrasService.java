package com.example.myislandapi.service;

import com.example.myislandapi.dto.request.CreateExtraRequest;
import com.example.myislandapi.dto.request.UpdateExtraRequest;
import com.example.myislandapi.dto.response.ExtraResponse;
import com.example.myislandapi.exception.BadRequestException;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.model.CampsiteModel;
import com.example.myislandapi.model.ExtraModel;
import com.example.myislandapi.repository.jdbc.JdbcCampsiteRepository;
import com.example.myislandapi.repository.jdbc.JdbcExtraRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class ExtrasService {

    private final JdbcExtraRepository extraRepository;
    private final JdbcCampsiteRepository campsiteRepository;

    public ExtrasService(JdbcExtraRepository extraRepository, JdbcCampsiteRepository campsiteRepository) {
        this.extraRepository = extraRepository;
        this.campsiteRepository = campsiteRepository;
    }

    // ========== Public endpoints ==========

    public List<ExtraResponse> getExtrasByCampsite(UUID campsiteId) {
        return extraRepository.findByCampsiteIdAndAvailableTrue(campsiteId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ExtraResponse> getAllAvailableExtras() {
        // Note: JDBC repository doesn't have findAll, so we'll need to handle this differently
        // For now, this method would need a new repository method
        // Return empty list as placeholder
        return List.of();
    }

    public ExtraResponse getExtra(UUID id) {
        ExtraModel extra = extraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Extra not found"));
        return toResponse(extra);
    }

    // ========== Owner endpoints ==========

    public List<ExtraResponse> getOwnerExtras(UUID ownerId, UUID campsiteId) {
        List<ExtraModel> extras;
        if (campsiteId != null) {
            extras = extraRepository.findByCampsiteIdAndCampsiteOwnerIdOrderByCreatedAtDesc(campsiteId, ownerId);
        } else {
            extras = extraRepository.findByCampsiteOwnerIdOrderByCreatedAtDesc(ownerId);
        }
        return extras.stream()
                .map(this::toResponse)
                .toList();
    }

    public ExtraResponse getOwnerExtra(UUID ownerId, UUID extraId) {
        ExtraModel extra = extraRepository.findByIdAndCampsiteOwnerId(extraId, ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Extra not found"));
        return toResponse(extra);
    }

    @Transactional
    public ExtraResponse createExtra(UUID ownerId, CreateExtraRequest request) {
        // Verify owner owns the campsite
        CampsiteModel campsite = campsiteRepository.findByIdAndOwnerId(request.campsiteId(), ownerId)
                .orElseThrow(() -> new BadRequestException("Campsite not found or not owned by you"));

        ExtraModel extra = new ExtraModel();
        extra.setCampsiteId(campsite.getId());
        extra.setName(request.name());
        extra.setDescription(request.description());
        extra.setPrice(request.price());
        extra.setPerNight(request.perNight());
        extra.setImageUrl(request.imageUrl());
        extra.setAvailable(request.available() != null ? request.available() : true);

        ExtraModel saved = extraRepository.save(extra);
        return toResponse(saved, campsite);
    }

    @Transactional
    public ExtraResponse updateExtra(UUID ownerId, UUID extraId, UpdateExtraRequest request) {
        ExtraModel extra = extraRepository.findByIdAndCampsiteOwnerId(extraId, ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Extra not found"));

        if (request.name() != null) {
            extra.setName(request.name());
        }
        if (request.description() != null) {
            extra.setDescription(request.description());
        }
        if (request.price() != null) {
            extra.setPrice(request.price());
        }
        if (request.perNight() != null) {
            extra.setPerNight(request.perNight());
        }
        if (request.imageUrl() != null) {
            extra.setImageUrl(request.imageUrl());
        }
        if (request.available() != null) {
            extra.setAvailable(request.available());
        }

        ExtraModel saved = extraRepository.save(extra);
        return toResponse(saved);
    }

    @Transactional
    public void deleteExtra(UUID ownerId, UUID extraId) {
        ExtraModel extra = extraRepository.findByIdAndCampsiteOwnerId(extraId, ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Extra not found"));

        // Soft delete - just set available to false
        extra.setAvailable(false);
        extraRepository.save(extra);
    }

    private ExtraResponse toResponse(ExtraModel extra) {
        CampsiteModel campsite = campsiteRepository.findById(extra.getCampsiteId()).orElse(null);
        return toResponse(extra, campsite);
    }

    private ExtraResponse toResponse(ExtraModel extra, CampsiteModel campsite) {
        return new ExtraResponse(
                extra.getId(),
                extra.getCampsiteId(),
                campsite != null ? campsite.getName() : null,
                extra.getName(),
                extra.getDescription(),
                extra.getPrice(),
                extra.isPerNight(),
                extra.getImageUrl(),
                extra.isAvailable()
        );
    }
}
