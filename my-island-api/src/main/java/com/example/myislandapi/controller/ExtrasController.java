package com.example.myislandapi.controller;

import com.example.myislandapi.dto.response.ExtraResponse;
import com.example.myislandapi.service.ExtrasService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/extras")
public class ExtrasController {

    private final ExtrasService extrasService;

    public ExtrasController(ExtrasService extrasService) {
        this.extrasService = extrasService;
    }

    @GetMapping
    public ResponseEntity<List<ExtraResponse>> getExtras(
            @RequestParam(required = false) UUID campsiteId) {
        if (campsiteId != null) {
            return ResponseEntity.ok(extrasService.getExtrasByCampsite(campsiteId));
        }
        return ResponseEntity.ok(extrasService.getAllAvailableExtras());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExtraResponse> getExtra(@PathVariable UUID id) {
        return ResponseEntity.ok(extrasService.getExtra(id));
    }
}
