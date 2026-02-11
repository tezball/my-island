package com.myisland.api.modules.admin.controller;

import com.myisland.api.modules.admin.entity.AdminAuditLog;
import com.myisland.api.modules.admin.service.AdminAuditService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/audit")
public class AdminAuditController {

    private final AdminAuditService auditService;

    public AdminAuditController(AdminAuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<Page<AdminAuditLog>> listAuditLogs(
            @RequestParam(required = false) Long adminUserId,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String entityType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(auditService.listAuditLogs(adminUserId, action, entityType, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminAuditLog> getAuditLog(@PathVariable Long id) {
        return ResponseEntity.ok(auditService.getAuditLog(id));
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    public ResponseEntity<List<AdminAuditLog>> getEntityAuditTrail(
            @PathVariable String entityType,
            @PathVariable Long entityId) {
        return ResponseEntity.ok(auditService.getEntityAuditTrail(entityType, entityId));
    }
}
