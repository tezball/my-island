package com.myisland.api.modules.admin.service;

import com.myisland.api.modules.admin.entity.AdminAuditLog;
import com.myisland.api.modules.admin.repository.AdminAuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminAuditService {

    private final AdminAuditLogRepository adminAuditLogRepository;

    public AdminAuditService(AdminAuditLogRepository adminAuditLogRepository) {
        this.adminAuditLogRepository = adminAuditLogRepository;
    }

    @Transactional
    public void log(Long adminUserId, String action, String entityType, Long entityId, String summary, String previousValue, String newValue) {
        AdminAuditLog log = new AdminAuditLog();
        log.setAdminUserId(adminUserId);
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setSummary(summary);
        log.setPreviousValue(previousValue);
        log.setNewValue(newValue);
        log.setCreatedAt(LocalDateTime.now());
        adminAuditLogRepository.save(log);
    }

    public Page<AdminAuditLog> listAuditLogs(Long adminUserId, String action, String entityType, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        String effectiveAction = (action != null && !action.isBlank()) ? action : null;
        String effectiveEntityType = (entityType != null && !entityType.isBlank()) ? entityType : null;

        return adminAuditLogRepository.findFiltered(adminUserId, effectiveAction, effectiveEntityType, pageRequest);
    }

    public AdminAuditLog getAuditLog(Long id) {
        return adminAuditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audit log entry not found with id: " + id));
    }

    public List<AdminAuditLog> getEntityAuditTrail(String entityType, Long entityId) {
        return adminAuditLogRepository.findByEntity(entityType, entityId);
    }
}
