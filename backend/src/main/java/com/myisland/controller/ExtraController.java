package com.myisland.controller;

import com.myisland.model.Extra;
import com.myisland.repository.ExtraRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.Map;

@RestController
@RequestMapping("/api/extras")
public class ExtraController {
    private final ExtraRepository extraRepository;

    public ExtraController(ExtraRepository extraRepository) {
        this.extraRepository = extraRepository;
    }

    @GetMapping
    public ResponseEntity<?> getExtras() {
        Collection<Extra> extras = extraRepository.findAll();
        return ResponseEntity.ok(Map.of("extras", extras));
    }
}
