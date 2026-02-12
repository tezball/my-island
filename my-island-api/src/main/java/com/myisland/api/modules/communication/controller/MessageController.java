package com.myisland.api.modules.communication.controller;

import com.myisland.api.modules.communication.dto.ConversationSummaryDto;
import com.myisland.api.modules.communication.dto.MessageDto;
import com.myisland.api.modules.communication.dto.SendMessageRequest;
import com.myisland.api.modules.communication.service.MessageService;
import com.myisland.api.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/messages")
@Tag(name = "Messages", description = "In-app messaging endpoints")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "Get conversation messages for a booking (marks received as read)")
    public ResponseEntity<List<MessageDto>> getConversation(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(messageService.getConversation(bookingId, userDetails.getUserId()));
    }

    @PostMapping("/booking/{bookingId}")
    @Operation(summary = "Send a message in a booking conversation")
    public ResponseEntity<MessageDto> sendMessage(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody SendMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(messageService.sendMessage(bookingId, userDetails.getUserId(), request.content()));
    }

    @GetMapping("/unread")
    @Operation(summary = "Get unread message counts per booking")
    public ResponseEntity<Map<Long, Long>> getUnreadCounts(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(messageService.getUnreadCounts(userDetails.getUserId()));
    }

    @GetMapping("/owner/conversations")
    @Operation(summary = "Get all conversations for the owner (with latest message)")
    public ResponseEntity<List<ConversationSummaryDto>> getOwnerConversations(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(messageService.getOwnerConversations(userDetails.getUserId()));
    }
}
