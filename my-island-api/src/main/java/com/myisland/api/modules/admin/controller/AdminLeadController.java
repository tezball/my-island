package com.myisland.api.modules.admin.controller;

import com.myisland.api.modules.admin.entity.Lead;
import com.myisland.api.modules.admin.entity.LeadInteraction;
import com.myisland.api.modules.admin.service.AdminLeadService;
import com.myisland.api.security.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/leads")
public class AdminLeadController {

    private final AdminLeadService leadService;

    public AdminLeadController(AdminLeadService leadService) {
        this.leadService = leadService;
    }

    @GetMapping
    public ResponseEntity<Page<Lead>> listLeads(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String businessType,
            @RequestParam(required = false) Long assignedTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(leadService.listLeads(status, businessType, assignedTo, page, size));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<Lead>> getOverdueLeads() {
        return ResponseEntity.ok(leadService.getOverdueLeads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getLead(@PathVariable Long id) {
        Lead lead = leadService.getLead(id);
        List<LeadInteraction> interactions = leadService.getInteractions(id);
        return ResponseEntity.ok(Map.of("lead", lead, "interactions", interactions));
    }

    @PostMapping
    public ResponseEntity<Lead> createLead(
            @RequestBody CreateLeadRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Lead lead = Lead.builder()
                .name(request.name())
                .email(request.email())
                .phone(request.phone())
                .businessType(Lead.BusinessType.valueOf(request.businessType()))
                .source(request.source())
                .notes(request.notes())
                .build();
        return ResponseEntity.ok(leadService.createLead(userDetails.getUserId(), lead));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lead> updateLead(
            @PathVariable Long id,
            @RequestBody UpdateLeadRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Lead updates = new Lead();
        if (request.status() != null) updates.setStatus(Lead.LeadStatus.valueOf(request.status()));
        if (request.notes() != null) updates.setNotes(request.notes());
        if (request.tags() != null) updates.setTags(request.tags());
        if (request.scheduledFollowUp() != null) updates.setScheduledFollowUp(LocalDateTime.parse(request.scheduledFollowUp()));
        return ResponseEntity.ok(leadService.updateLead(userDetails.getUserId(), id, updates));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        leadService.deleteLead(userDetails.getUserId(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/interactions")
    public ResponseEntity<LeadInteraction> addInteraction(
            @PathVariable Long id,
            @RequestBody AddInteractionRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        LeadInteraction interaction = new LeadInteraction();
        interaction.setType(LeadInteraction.InteractionType.valueOf(request.type()));
        interaction.setContent(request.content());
        return ResponseEntity.ok(leadService.addInteraction(userDetails.getUserId(), id, interaction));
    }

    @GetMapping("/export")
    public ResponseEntity<String> exportLeadsCsv() {
        String csv = leadService.exportLeadsCsv();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "leads-export.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csv);
    }

    public record CreateLeadRequest(String name, String email, String phone, String businessType, String source, String notes) {}
    public record UpdateLeadRequest(String status, String notes, String scheduledFollowUp, String tags) {}
    public record AddInteractionRequest(String type, String content) {}
}
