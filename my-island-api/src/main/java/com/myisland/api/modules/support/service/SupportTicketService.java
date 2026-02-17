package com.myisland.api.modules.support.service;

import com.myisland.api.modules.admin.service.AdminAuditService;
import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.repository.UserRepository;
import com.myisland.api.modules.support.dto.*;
import com.myisland.api.modules.support.entity.SupportTicket;
import com.myisland.api.modules.support.entity.SupportTicket.TicketCategory;
import com.myisland.api.modules.support.entity.SupportTicket.TicketPriority;
import com.myisland.api.modules.support.entity.SupportTicket.TicketStatus;
import com.myisland.api.modules.support.entity.SupportTicketMessage;
import com.myisland.api.modules.support.repository.SupportTicketMessageRepository;
import com.myisland.api.modules.support.repository.SupportTicketRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class SupportTicketService {

    private final SupportTicketRepository ticketRepository;
    private final SupportTicketMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final AdminAuditService auditService;

    public SupportTicketService(SupportTicketRepository ticketRepository,
                                SupportTicketMessageRepository messageRepository,
                                UserRepository userRepository,
                                BookingRepository bookingRepository,
                                AdminAuditService auditService) {
        this.ticketRepository = ticketRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.auditService = auditService;
    }

    @Transactional
    public SupportTicketDto createTicket(Long userId, CreateTicketRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SupportTicket ticket = new SupportTicket();
        ticket.setUser(user);
        ticket.setSubject(request.subject());
        ticket.setDescription(request.description());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setPriority(TicketPriority.NORMAL);

        if (request.category() != null && !request.category().isBlank()) {
            ticket.setCategory(TicketCategory.valueOf(request.category()));
        }

        if (request.relatedBookingId() != null) {
            Booking booking = bookingRepository.findById(request.relatedBookingId())
                    .orElse(null);
            ticket.setRelatedBooking(booking);
        }

        ticket = ticketRepository.save(ticket);

        // Create initial message from description
        SupportTicketMessage message = new SupportTicketMessage(ticket, user, request.description());
        messageRepository.save(message);

        return toDto(ticket);
    }

    public Page<SupportTicketDto> getUserTickets(Long userId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));
        return ticketRepository.findByUserId(userId, pageRequest).map(this::toDto);
    }

    public SupportTicketDto getTicket(Long ticketId, Long userId) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // If userId is provided, verify ownership
        if (userId != null && !ticket.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        return toDto(ticket);
    }

    public List<SupportTicketMessageDto> getTicketMessages(Long ticketId, Long userId) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // If userId is provided, verify ownership
        if (userId != null && !ticket.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        return messageRepository.findByTicketIdOrderByCreatedAtAsc(ticketId)
                .stream()
                .map(this::toMessageDto)
                .toList();
    }

    @Transactional
    public SupportTicketMessageDto addMessage(Long ticketId, Long userId, String content) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        User sender = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Non-admin users can only message their own tickets
        if (!sender.isAdmin() && !ticket.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        // If a user (non-admin) replies to a RESOLVED ticket, reopen it
        if (!sender.isAdmin() && ticket.getStatus() == TicketStatus.RESOLVED) {
            ticket.setStatus(TicketStatus.OPEN);
            ticket.setClosedAt(null);
            ticketRepository.save(ticket);
        }

        SupportTicketMessage message = new SupportTicketMessage(ticket, sender, content);
        message = messageRepository.save(message);

        // Touch the ticket's updatedAt
        ticketRepository.save(ticket);

        return toMessageDto(message);
    }

    public Page<SupportTicketDto> listAllTickets(String status, String category, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));

        TicketStatus ticketStatus = (status != null && !status.isBlank()) ? TicketStatus.valueOf(status) : null;
        TicketCategory ticketCategory = (category != null && !category.isBlank()) ? TicketCategory.valueOf(category) : null;

        return ticketRepository.findFiltered(ticketStatus, ticketCategory, pageRequest).map(this::toDto);
    }

    @Transactional
    public SupportTicketDto updateTicketStatus(Long adminUserId, Long ticketId, UpdateTicketStatusRequest request) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        String previousStatus = ticket.getStatus().name();
        TicketStatus newStatus = TicketStatus.valueOf(request.status());
        ticket.setStatus(newStatus);

        if (request.priority() != null && !request.priority().isBlank()) {
            ticket.setPriority(TicketPriority.valueOf(request.priority()));
        }

        if (request.assignedAdminId() != null) {
            User admin = userRepository.findById(request.assignedAdminId())
                    .orElseThrow(() -> new RuntimeException("Admin user not found"));
            ticket.setAssignedAdmin(admin);
        }

        if (newStatus == TicketStatus.RESOLVED || newStatus == TicketStatus.CLOSED) {
            ticket.setClosedAt(LocalDateTime.now());
        } else {
            ticket.setClosedAt(null);
        }

        ticket = ticketRepository.save(ticket);

        auditService.log(adminUserId, "UPDATE_TICKET_STATUS", "SUPPORT_TICKET", ticketId,
                "Changed ticket status from " + previousStatus + " to " + newStatus.name(),
                "{\"status\":\"" + previousStatus + "\"}",
                "{\"status\":\"" + newStatus.name() + "\"}");

        return toDto(ticket);
    }

    public Map<String, Long> getTicketStats() {
        return Map.of(
                "OPEN", ticketRepository.countByStatus(TicketStatus.OPEN),
                "IN_PROGRESS", ticketRepository.countByStatus(TicketStatus.IN_PROGRESS),
                "RESOLVED", ticketRepository.countByStatus(TicketStatus.RESOLVED),
                "CLOSED", ticketRepository.countByStatus(TicketStatus.CLOSED)
        );
    }

    // --- Mappers ---

    private SupportTicketDto toDto(SupportTicket ticket) {
        long msgCount = messageRepository.countByTicketId(ticket.getId());
        List<SupportTicketMessage> messages = messageRepository.findByTicketIdOrderByCreatedAtAsc(ticket.getId());
        LocalDateTime lastMessageAt = messages.isEmpty() ? ticket.getCreatedAt()
                : messages.get(messages.size() - 1).getCreatedAt();

        return new SupportTicketDto(
                ticket.getId(),
                ticket.getUser().getId(),
                ticket.getUser().getName(),
                ticket.getSubject(),
                ticket.getDescription(),
                ticket.getCategory().name(),
                ticket.getStatus().name(),
                ticket.getPriority().name(),
                ticket.getRelatedBooking() != null ? ticket.getRelatedBooking().getId() : null,
                ticket.getAssignedAdmin() != null ? ticket.getAssignedAdmin().getId() : null,
                ticket.getAssignedAdmin() != null ? ticket.getAssignedAdmin().getName() : null,
                msgCount,
                lastMessageAt,
                ticket.getClosedAt(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt()
        );
    }

    private SupportTicketMessageDto toMessageDto(SupportTicketMessage message) {
        return new SupportTicketMessageDto(
                message.getId(),
                message.getTicket().getId(),
                message.getSender().getId(),
                message.getSender().getName(),
                message.getSender().isAdmin(),
                message.getContent(),
                message.getCreatedAt()
        );
    }
}
