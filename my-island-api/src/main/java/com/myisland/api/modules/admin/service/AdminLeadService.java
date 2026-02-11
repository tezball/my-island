package com.myisland.api.modules.admin.service;

import com.myisland.api.modules.admin.entity.Lead;
import com.myisland.api.modules.admin.entity.LeadInteraction;
import com.myisland.api.modules.admin.repository.LeadInteractionRepository;
import com.myisland.api.modules.admin.repository.LeadRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminLeadService {

    private final LeadRepository leadRepository;
    private final LeadInteractionRepository leadInteractionRepository;
    private final AdminAuditService adminAuditService;

    public AdminLeadService(
            LeadRepository leadRepository,
            LeadInteractionRepository leadInteractionRepository,
            AdminAuditService adminAuditService) {
        this.leadRepository = leadRepository;
        this.leadInteractionRepository = leadInteractionRepository;
        this.adminAuditService = adminAuditService;
    }

    public Page<Lead> listLeads(String status, String businessType, Long assignedTo, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Lead.LeadStatus leadStatus = (status != null && !status.isBlank()) ? Lead.LeadStatus.valueOf(status) : null;
        Lead.BusinessType leadBusinessType = (businessType != null && !businessType.isBlank()) ? Lead.BusinessType.valueOf(businessType) : null;
        return leadRepository.findFiltered(leadStatus, leadBusinessType, assignedTo, pageRequest);
    }

    public Lead getLead(Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found with id: " + id));
    }

    @Transactional
    public Lead createLead(Long adminUserId, Lead lead) {
        lead.setCreatedAt(LocalDateTime.now());
        Lead saved = leadRepository.save(lead);

        // Calculate and set score
        int score = calculateScore(saved);
        saved.setScore(score);
        saved = leadRepository.save(saved);

        adminAuditService.log(
                adminUserId,
                "CREATE_LEAD",
                "LEAD",
                saved.getId(),
                "Created lead: " + lead.getName(),
                null,
                String.format("name=%s, email=%s, businessType=%s", saved.getName(), saved.getEmail(), saved.getBusinessType())
        );

        return saved;
    }

    @Transactional
    public Lead updateLead(Long adminUserId, Long leadId, Lead updates) {
        Lead lead = getLead(leadId);

        String previousValue = String.format("name=%s, email=%s, phone=%s, status=%s, businessType=%s",
                lead.getName(), lead.getEmail(), lead.getPhone(), lead.getStatus(), lead.getBusinessType());

        if (updates.getName() != null) {
            lead.setName(updates.getName());
        }
        if (updates.getEmail() != null) {
            lead.setEmail(updates.getEmail());
        }
        if (updates.getPhone() != null) {
            lead.setPhone(updates.getPhone());
        }
        if (updates.getBusinessType() != null) {
            lead.setBusinessType(updates.getBusinessType());
        }
        if (updates.getStatus() != null) {
            lead.setStatus(updates.getStatus());
        }
        if (updates.getSource() != null) {
            lead.setSource(updates.getSource());
        }
        if (updates.getNotes() != null) {
            lead.setNotes(updates.getNotes());
        }
        if (updates.getAssignedTo() != null) {
            lead.setAssignedTo(updates.getAssignedTo());
        }
        if (updates.getTags() != null) {
            lead.setTags(updates.getTags());
        }
        if (updates.getScheduledFollowUp() != null) {
            lead.setScheduledFollowUp(updates.getScheduledFollowUp());
        }
        if (updates.getConvertedUserId() != null) {
            lead.setConvertedUserId(updates.getConvertedUserId());
        }

        // Recalculate score
        int score = calculateScore(lead);
        lead.setScore(score);

        Lead saved = leadRepository.save(lead);

        String newValue = String.format("name=%s, email=%s, phone=%s, status=%s, businessType=%s",
                saved.getName(), saved.getEmail(), saved.getPhone(), saved.getStatus(), saved.getBusinessType());

        adminAuditService.log(
                adminUserId,
                "UPDATE_LEAD",
                "LEAD",
                leadId,
                "Updated lead: " + lead.getName(),
                previousValue,
                newValue
        );

        return saved;
    }

    @Transactional
    public void deleteLead(Long adminUserId, Long leadId) {
        Lead lead = getLead(leadId);

        leadRepository.delete(lead);

        adminAuditService.log(
                adminUserId,
                "DELETE_LEAD",
                "LEAD",
                leadId,
                "Deleted lead: " + lead.getName(),
                String.format("lead_id=%s, name=%s", leadId, lead.getName()),
                null
        );
    }

    @Transactional
    public LeadInteraction addInteraction(Long adminUserId, Long leadId, LeadInteraction interaction) {
        Lead lead = getLead(leadId);

        interaction.setLeadId(leadId);
        interaction.setCreatedBy(adminUserId);
        interaction.setCreatedAt(LocalDateTime.now());

        LeadInteraction saved = leadInteractionRepository.save(interaction);

        // Recalculate lead score
        int score = calculateScore(lead);
        lead.setScore(score);
        leadRepository.save(lead);

        adminAuditService.log(
                adminUserId,
                "ADD_LEAD_INTERACTION",
                "LEAD_INTERACTION",
                saved.getId(),
                "Added interaction to lead: " + lead.getName(),
                null,
                String.format("type=%s, leadId=%s", interaction.getType(), leadId)
        );

        return saved;
    }

    public List<LeadInteraction> getInteractions(Long leadId) {
        return leadInteractionRepository.findByLeadIdOrderByCreatedAtDesc(leadId);
    }

    public List<Lead> getOverdueLeads() {
        return leadRepository.findOverdue(LocalDateTime.now());
    }

    public int calculateScore(Lead lead) {
        int score = 0;

        // Email presence: +15
        if (lead.getEmail() != null && !lead.getEmail().isBlank()) {
            score += 15;
        }

        // Phone presence: +10
        if (lead.getPhone() != null && !lead.getPhone().isBlank()) {
            score += 10;
        }

        // Interaction count: +5 each, max 25
        long interactionCount = leadInteractionRepository.countByLeadId(lead.getId());
        score += Math.min(interactionCount * 5, 25);

        // Scheduled follow-up: +10
        if (lead.getScheduledFollowUp() != null) {
            score += 10;
        }

        // Has tags: +5
        if (lead.getTags() != null && !lead.getTags().isBlank()) {
            score += 5;
        }

        // Status bonus
        if (lead.getStatus() != null) {
            switch (lead.getStatus()) {
                case CONTACTED:
                    score += 5;
                    break;
                case QUALIFIED:
                    score += 10;
                    break;
                case CONVERTED:
                    score += 20;
                    break;
                default:
                    break;
            }
        }

        return Math.min(score, 100);
    }

    @Transactional
    public void importLeads(Long adminUserId, List<Lead> leads) {
        leads.forEach(lead -> {
            lead.setCreatedAt(LocalDateTime.now());
            Lead saved = leadRepository.save(lead);

            int score = calculateScore(saved);
            saved.setScore(score);
            leadRepository.save(saved);
        });

        adminAuditService.log(
                adminUserId,
                "IMPORT_LEADS",
                "LEAD",
                null,
                "Imported " + leads.size() + " leads",
                null,
                "count=" + leads.size()
        );
    }

    public String exportLeadsCsv() {
        List<Lead> leads = leadRepository.findAll();

        StringBuilder csv = new StringBuilder();
        csv.append("ID,Name,Email,Phone,Business Type,Status,Source,Score,Assigned To,Tags,Scheduled Follow Up,Created At\n");

        leads.forEach(lead -> {
            csv.append(lead.getId()).append(",")
                    .append(lead.getName()).append(",")
                    .append(lead.getEmail() != null ? lead.getEmail() : "").append(",")
                    .append(lead.getPhone() != null ? lead.getPhone() : "").append(",")
                    .append(lead.getBusinessType()).append(",")
                    .append(lead.getStatus()).append(",")
                    .append(lead.getSource() != null ? lead.getSource() : "").append(",")
                    .append(lead.getScore()).append(",")
                    .append(lead.getAssignedTo() != null ? lead.getAssignedTo() : "").append(",")
                    .append(lead.getTags() != null ? lead.getTags() : "").append(",")
                    .append(lead.getScheduledFollowUp() != null ? lead.getScheduledFollowUp() : "").append(",")
                    .append(lead.getCreatedAt()).append("\n");
        });

        return csv.toString();
    }
}
