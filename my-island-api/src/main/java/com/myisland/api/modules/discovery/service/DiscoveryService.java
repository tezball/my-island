package com.myisland.api.modules.discovery.service;

import com.myisland.api.modules.discovery.dto.PoiDto;
import com.myisland.api.modules.discovery.dto.UserPoiVisitDto;
import com.myisland.api.modules.discovery.entity.PointOfInterest;
import com.myisland.api.modules.discovery.entity.PointOfInterest.PoiCategory;
import com.myisland.api.modules.discovery.entity.UserPoiVisit;
import com.myisland.api.modules.discovery.entity.UserPoiVisit.VisitStatus;
import com.myisland.api.modules.discovery.repository.PoiRepository;
import com.myisland.api.modules.discovery.repository.UserPoiVisitRepository;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class DiscoveryService {

    private final PoiRepository poiRepository;
    private final UserPoiVisitRepository visitRepository;
    private final UserRepository userRepository;

    public DiscoveryService(PoiRepository poiRepository, UserPoiVisitRepository visitRepository,
                            UserRepository userRepository) {
        this.poiRepository = poiRepository;
        this.visitRepository = visitRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<PoiDto> getAllPois() {
        return poiRepository.findAll().stream()
                .map(PoiDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PoiDto getPoiById(Long id) {
        PointOfInterest poi = poiRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("POI not found: " + id));
        return PoiDto.from(poi);
    }

    @Transactional(readOnly = true)
    public List<PoiDto> getPoisByCategory(PoiCategory category) {
        return poiRepository.findByCategory(category).stream()
                .map(PoiDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserPoiVisitDto> getUserVisits(Long userId) {
        return visitRepository.findByUserId(userId).stream()
                .map(UserPoiVisitDto::from)
                .toList();
    }

    @Transactional
    public UserPoiVisitDto upsertVisit(Long userId, Long poiId, VisitStatus status, String notes) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));
        PointOfInterest poi = poiRepository.findById(poiId)
                .orElseThrow(() -> new EntityNotFoundException("POI not found: " + poiId));

        UserPoiVisit visit = visitRepository.findByUserIdAndPoiId(userId, poiId)
                .orElse(null);

        if (visit == null) {
            visit = UserPoiVisit.builder()
                    .user(user)
                    .poi(poi)
                    .status(status)
                    .notes(notes)
                    .visitedAt(status == VisitStatus.VISITED ? LocalDateTime.now() : null)
                    .build();
        } else {
            visit.setStatus(status);
            visit.setNotes(notes);
            if (status == VisitStatus.VISITED && visit.getVisitedAt() == null) {
                visit.setVisitedAt(LocalDateTime.now());
            }
        }

        visit = visitRepository.save(visit);
        return UserPoiVisitDto.from(visit);
    }

    @Transactional
    public void deleteVisit(Long userId, Long poiId) {
        visitRepository.deleteByUserIdAndPoiId(userId, poiId);
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getUserVisitStats(Long userId) {
        long visited = visitRepository.countByUserIdAndStatus(userId, VisitStatus.VISITED);
        long planned = visitRepository.countByUserIdAndStatus(userId, VisitStatus.PLANNED);
        long total = poiRepository.count();
        return Map.of(
                "visited", visited,
                "planned", planned,
                "total", total
        );
    }
}
