package com.myisland.api.modules.support.controller;

import com.myisland.api.modules.support.dto.*;
import com.myisland.api.modules.support.service.SupportTicketService;
import com.myisland.api.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/support")
@Tag(name = "Support", description = "Support ticket endpoints for authenticated users")
public class SupportController {

    private final SupportTicketService ticketService;

    public SupportController(SupportTicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping("/tickets")
    @Operation(summary = "Create a new support ticket")
    public ResponseEntity<SupportTicketDto> createTicket(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateTicketRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.createTicket(userDetails.getUserId(), request));
    }

    @GetMapping("/tickets")
    @Operation(summary = "Get current user's support tickets")
    public ResponseEntity<Page<SupportTicketDto>> getMyTickets(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ticketService.getUserTickets(userDetails.getUserId(), page, size));
    }

    @GetMapping("/tickets/{ticketId}")
    @Operation(summary = "Get a specific support ticket (must be owner)")
    public ResponseEntity<SupportTicketDto> getTicket(
            @PathVariable Long ticketId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ticketService.getTicket(ticketId, userDetails.getUserId()));
    }

    @GetMapping("/tickets/{ticketId}/messages")
    @Operation(summary = "Get messages for a support ticket")
    public ResponseEntity<List<SupportTicketMessageDto>> getTicketMessages(
            @PathVariable Long ticketId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ticketService.getTicketMessages(ticketId, userDetails.getUserId()));
    }

    @PostMapping("/tickets/{ticketId}/messages")
    @Operation(summary = "Send a message on a support ticket")
    public ResponseEntity<SupportTicketMessageDto> sendMessage(
            @PathVariable Long ticketId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody SendTicketMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.addMessage(ticketId, userDetails.getUserId(), request.content()));
    }
}
