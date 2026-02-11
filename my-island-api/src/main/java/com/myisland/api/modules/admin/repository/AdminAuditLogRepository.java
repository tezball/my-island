package com.myisland.api.modules.admin.repository;

import com.myisland.api.modules.admin.entity.AdminAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminAuditLogRepository extends JpaRepository<AdminAuditLog, Long> {

    Page<AdminAuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT a FROM AdminAuditLog a WHERE a.adminUserId = :adminUserId ORDER BY a.createdAt DESC")
    Page<AdminAuditLog> findByAdminUserId(Long adminUserId, Pageable pageable);

    @Query("SELECT a FROM AdminAuditLog a WHERE a.entityType = :entityType AND a.entityId = :entityId ORDER BY a.createdAt DESC")
    List<AdminAuditLog> findByEntity(String entityType, Long entityId);

    @Query("SELECT a FROM AdminAuditLog a WHERE a.action = :action ORDER BY a.createdAt DESC")
    Page<AdminAuditLog> findByAction(String action, Pageable pageable);

    @Query("""
            SELECT a FROM AdminAuditLog a
            WHERE (:adminUserId IS NULL OR a.adminUserId = :adminUserId)
            AND (:action IS NULL OR a.action = :action)
            AND (:entityType IS NULL OR a.entityType = :entityType)
            ORDER BY a.createdAt DESC
            """)
    Page<AdminAuditLog> findFiltered(Long adminUserId, String action, String entityType, Pageable pageable);
}
