package com.myisland.api.modules.admin.controller;

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
import java.util.Map;

@RestController
@RequestMapping("/admin/support")
@Tag(name = "Admin Support", description = "Admin support ticket management endpoints")
public class AdminSupportController {

    private final SupportTicketService ticketService;

    public AdminSupportController(SupportTicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping("/tickets")
    @Operation(summary = "List all support tickets with optional filters")
    public ResponseEntity<Page<SupportTicketDto>> listTickets(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ticketService.listAllTickets(status, category, page, size));
    }

    @GetMapping("/tickets/{ticketId}")
    @Operation(summary = "Get a specific support ticket (admin)")
    public ResponseEntity<SupportTicketDto> getTicket(@PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketService.getTicket(ticketId, null));
    }

    @GetMapping("/tickets/{ticketId}/messages")
    @Operation(summary = "Get messages for a support ticket (admin)")
    public ResponseEntity<List<SupportTicketMessageDto>> getTicketMessages(@PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketService.getTicketMessages(ticketId, null));
    }

    @PostMapping("/tickets/{ticketId}/messages")
    @Operation(summary = "Send a message on a support ticket (admin)")
    public ResponseEntity<SupportTicketMessageDto> sendMessage(
            @PathVariable Long ticketId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody SendTicketMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.addMessage(ticketId, userDetails.getUserId(), request.content()));
    }

    @PutMapping("/tickets/{ticketId}/status")
    @Operation(summary = "Update ticket status, priority, or assignment")
    public ResponseEntity<SupportTicketDto> updateTicketStatus(
            @PathVariable Long ticketId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UpdateTicketStatusRequest request) {
        return ResponseEntity.ok(ticketService.updateTicketStatus(userDetails.getUserId(), ticketId, request));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get ticket counts by status")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(ticketService.getTicketStats());
    }
}
