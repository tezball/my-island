package com.example.myislandapi.service;

import com.example.myislandapi.dto.response.ExtraResponse;
import com.example.myislandapi.entity.Extra;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.repository.ExtraRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class ExtrasService {

    private final ExtraRepository extraRepository;

    public ExtrasService(ExtraRepository extraRepository) {
        this.extraRepository = extraRepository;
    }

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

    private ExtraResponse toResponse(Extra extra) {
        return new ExtraResponse(
                extra.getId(),
                extra.getName(),
                extra.getDescription(),
                extra.getPrice(),
                extra.isPerNight(),
                extra.getImageUrl()
        );
    }
}
