package com.myisland.api.controller;

import com.myisland.api.dto.response.ExtraResponse;
import com.myisland.api.repository.ExtraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/extras")
@RequiredArgsConstructor
public class ExtraController {

    private final ExtraRepository extraRepository;

    @GetMapping
    public ResponseEntity<Map<String, List<ExtraResponse>>> listExtras() {
        List<ExtraResponse> extras = extraRepository.findAll().stream()
            .map(ExtraResponse::from)
            .toList();

        return ResponseEntity.ok(Map.of("extras", extras));
    }
}
