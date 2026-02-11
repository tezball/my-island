package com.myisland.api.modules.admin.service;

import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final AdminAuditService adminAuditService;

    public AdminUserService(UserRepository userRepository, AdminAuditService adminAuditService) {
        this.userRepository = userRepository;
        this.adminAuditService = adminAuditService;
    }

    @Transactional(readOnly = true)
    public Page<Map<String, Object>> listUsers(String search, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<User> users;
        if (search == null || search.isBlank()) {
            users = userRepository.findAll(pageRequest);
        } else {
            users = userRepository.searchByNameOrEmail(search, pageRequest);
        }
        return users.map(this::toDto);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return toDto(user);
    }

    @Transactional
    public Map<String, Object> updateUser(Long adminUserId, Long userId, String name, Boolean isOwner, Boolean isSupplier, Boolean isAdmin) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        String previousValue = String.format("name=%s, isOwner=%s, isSupplier=%s, isAdmin=%s",
                user.getName(), user.isOwner(), user.isSupplier(), user.isAdmin());

        if (name != null) {
            user.setName(name);
        }
        if (isOwner != null) {
            user.setOwner(isOwner);
        }
        if (isSupplier != null) {
            user.setSupplier(isSupplier);
        }
        if (isAdmin != null) {
            user.setAdmin(isAdmin);
        }

        User saved = userRepository.save(user);

        String newValue = String.format("name=%s, isOwner=%s, isSupplier=%s, isAdmin=%s",
                saved.getName(), saved.isOwner(), saved.isSupplier(), saved.isAdmin());

        adminAuditService.log(
                adminUserId,
                "UPDATE_USER",
                "USER",
                userId,
                "Updated user: " + user.getName(),
                previousValue,
                newValue
        );

        return toDto(saved);
    }

    @Transactional
    public Map<String, Object> toggleActive(Long adminUserId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        boolean previousActive = user.isActive();
        user.setActive(!previousActive);

        User saved = userRepository.save(user);

        adminAuditService.log(
                adminUserId,
                "TOGGLE_USER_ACTIVE",
                "USER",
                userId,
                "Toggled active status for user: " + user.getName(),
                "isActive=" + previousActive,
                "isActive=" + saved.isActive()
        );

        return toDto(saved);
    }

    private Map<String, Object> toDto(User user) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", user.getId());
        dto.put("name", user.getName());
        dto.put("email", user.getEmail());
        dto.put("role", user.getRole() != null ? user.getRole().name() : null);
        dto.put("isOwner", user.isOwner());
        dto.put("isSupplier", user.isSupplier());
        dto.put("isStaff", user.isStaff());
        dto.put("isAdmin", user.isAdmin());
        dto.put("isActive", user.isActive());
        dto.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
        return dto;
    }
}
