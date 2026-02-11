package com.myisland.api.modules.admin.controller;

import com.myisland.api.modules.admin.service.AdminSubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/subscriptions")
public class AdminSubscriptionController {

    private final AdminSubscriptionService subscriptionService;

    public AdminSubscriptionController(AdminSubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverview() {
        return ResponseEntity.ok(subscriptionService.getOverview());
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listSubscriptions(
            @RequestParam(required = false) String entityType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(subscriptionService.listSubscriptions(entityType, page, size));
    }
}
