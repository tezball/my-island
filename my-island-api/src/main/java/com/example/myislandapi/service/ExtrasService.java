package com.example.myislandapi.service;

import com.example.myislandapi.dto.request.CreateExtraRequest;
import com.example.myislandapi.dto.request.UpdateExtraRequest;
import com.example.myislandapi.dto.response.ExtraResponse;
import com.example.myislandapi.entity.Campsite;
import com.example.myislandapi.entity.Extra;
import com.example.myislandapi.exception.BadRequestException;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.repository.CampsiteRepository;
import com.example.myislandapi.repository.ExtraRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class ExtrasService {

    private final ExtraRepository extraRepository;
    private final CampsiteRepository campsiteRepository;

    public ExtrasService(ExtraRepository extraRepository, CampsiteRepository campsiteRepository) {
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
        return extraRepository.findAll()
                .stream()
                .filter(Extra::isAvailable)
                .map(this::toResponse)
                .toList();
    }

    public ExtraResponse getExtra(UUID id) {
        Extra extra = extraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Extra not found"));
        return toResponse(extra);
    }

    // ========== Owner endpoints ==========

    public List<ExtraResponse> getOwnerExtras(UUID ownerId, UUID campsiteId) {
        List<Extra> extras;
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
        Extra extra = extraRepository.findByIdAndCampsiteOwnerId(extraId, ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Extra not found"));
        return toResponse(extra);
    }

    @Transactional
    public ExtraResponse createExtra(UUID ownerId, CreateExtraRequest request) {
        // Verify owner owns the campsite
        Campsite campsite = campsiteRepository.findByIdAndOwnerId(request.campsiteId(), ownerId)
                .orElseThrow(() -> new BadRequestException("Campsite not found or not owned by you"));

        Extra extra = new Extra();
        extra.setCampsite(campsite);
        extra.setName(request.name());
        extra.setDescription(request.description());
        extra.setPrice(request.price());
        extra.setPerNight(request.perNight());
        extra.setImageUrl(request.imageUrl());
        extra.setAvailable(request.available() != null ? request.available() : true);

        Extra saved = extraRepository.save(extra);
        return toResponse(saved);
    }

    @Transactional
    public ExtraResponse updateExtra(UUID ownerId, UUID extraId, UpdateExtraRequest request) {
        Extra extra = extraRepository.findByIdAndCampsiteOwnerId(extraId, ownerId)
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

        Extra saved = extraRepository.save(extra);
        return toResponse(saved);
    }

    @Transactional
    public void deleteExtra(UUID ownerId, UUID extraId) {
        Extra extra = extraRepository.findByIdAndCampsiteOwnerId(extraId, ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Extra not found"));

        // Soft delete - just set available to false
        extra.setAvailable(false);
        extraRepository.save(extra);
    }

    private ExtraResponse toResponse(Extra extra) {
        return new ExtraResponse(
                extra.getId(),
                extra.getCampsite().getId(),
                extra.getCampsite().getName(),
                extra.getName(),
                extra.getDescription(),
                extra.getPrice(),
                extra.isPerNight(),
                extra.getImageUrl(),
                extra.isAvailable()
        );
    }
}
