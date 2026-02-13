package com.myisland.api.modules.admin.controller;

import com.myisland.api.modules.admin.service.AdminUserService;
import com.myisland.api.security.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/users")
public class AdminUserController {

    private final AdminUserService userService;

    public AdminUserController(AdminUserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<Page<Map<String, Object>>> listUsers(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(userService.listUsers(search, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(userService.updateUser(
                userDetails.getUserId(), id, request.name(), request.isOwner(), request.isSupplier(), request.isAdmin()));
    }

    @PutMapping("/{id}/toggle-active")
    public ResponseEntity<Map<String, Object>> toggleActive(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(userService.toggleActive(userDetails.getUserId(), id));
    }

    @GetMapping("/eligible-owners")
    public ResponseEntity<Page<Map<String, Object>>> eligibleOwners(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(userService.findEligibleOwners(search, page, size));
    }

    @GetMapping("/eligible-suppliers")
    public ResponseEntity<Page<Map<String, Object>>> eligibleSuppliers(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(userService.findEligibleSuppliers(search, page, size));
    }

    public record UpdateUserRequest(
            String name,
            Boolean isOwner,
            Boolean isSupplier,
            Boolean isAdmin
    ) {}
}
