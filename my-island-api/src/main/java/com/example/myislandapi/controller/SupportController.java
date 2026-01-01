package com.example.myislandapi.controller;

import com.example.myislandapi.dto.request.CreateTicketRequest;
import com.example.myislandapi.dto.response.FAQResponse;
import com.example.myislandapi.dto.response.SupportTicketResponse;
import com.example.myislandapi.security.UserDetailsImpl;
import com.example.myislandapi.service.SupportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/support")
public class SupportController {

    private final SupportService supportService;

    public SupportController(SupportService supportService) {
        this.supportService = supportService;
    }

    @GetMapping("/faqs")
    public ResponseEntity<List<FAQResponse>> getFAQs() {
        return ResponseEntity.ok(supportService.getFAQs());
    }

    @GetMapping("/tickets")
    public ResponseEntity<List<SupportTicketResponse>> getTickets(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(supportService.getUserTickets(userDetails.getId()));
    }

    @GetMapping("/tickets/{id}")
    public ResponseEntity<SupportTicketResponse> getTicket(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id) {
        return ResponseEntity.ok(supportService.getTicket(id, userDetails.getId()));
    }

    @PostMapping("/tickets")
    public ResponseEntity<SupportTicketResponse> createTicket(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CreateTicketRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(supportService.createTicket(userDetails.getId(), request));
    }

    @PostMapping("/tickets/{id}/messages")
    public ResponseEntity<SupportTicketResponse> addMessage(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        String message = body.get("message");
        return ResponseEntity.ok(supportService.addMessage(id, userDetails.getId(), message));
    }
}
