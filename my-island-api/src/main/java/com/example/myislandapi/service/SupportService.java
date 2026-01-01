package com.example.myislandapi.service;

import com.example.myislandapi.dto.request.CreateTicketRequest;
import com.example.myislandapi.dto.response.FAQResponse;
import com.example.myislandapi.dto.response.SupportTicketResponse;
import com.example.myislandapi.entity.SupportTicket;
import com.example.myislandapi.entity.TicketMessage;
import com.example.myislandapi.entity.User;
import com.example.myislandapi.enums.TicketStatus;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.repository.FAQRepository;
import com.example.myislandapi.repository.SupportTicketRepository;
import com.example.myislandapi.repository.UserRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class SupportService {

    private final FAQRepository faqRepository;
    private final SupportTicketRepository ticketRepository;
    private final UserRepository userRepository;

    public SupportService(FAQRepository faqRepository,
                         SupportTicketRepository ticketRepository,
                         UserRepository userRepository) {
        this.faqRepository = faqRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public List<FAQResponse> getFAQs() {
        return faqRepository.findByActiveTrueOrderBySortOrderAsc().stream()
                .map(faq -> new FAQResponse(
                        faq.getId(),
                        faq.getQuestion(),
                        faq.getAnswer(),
                        faq.getCategory(),
                        faq.getSortOrder()
                ))
                .toList();
    }

    public List<SupportTicketResponse> getUserTickets(UUID userId) {
        return ticketRepository.findByUserIdOrderByCreatedAtDesc(userId, Pageable.unpaged())
                .getContent().stream()
                .map(this::toTicketResponse)
                .toList();
    }

    public SupportTicketResponse getTicket(UUID ticketId, UUID userId) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + ticketId));

        if (!ticket.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Ticket not found: " + ticketId);
        }

        return toTicketResponse(ticket);
    }

    @Transactional
    public SupportTicketResponse createTicket(UUID userId, CreateTicketRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        SupportTicket ticket = new SupportTicket();
        ticket.setUser(user);
        ticket.setSubject(request.subject());
        ticket.setDescription(request.message());
        ticket.setCategory("general");
        ticket.setStatus(TicketStatus.OPEN);

        TicketMessage message = new TicketMessage();
        message.setTicket(ticket);
        message.setSender(user);
        message.setContent(request.message());
        message.setStaffReply(false);
        ticket.getMessages().add(message);

        ticket = ticketRepository.save(ticket);
        return toTicketResponse(ticket);
    }

    @Transactional
    public SupportTicketResponse addMessage(UUID ticketId, UUID userId, String messageText) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + ticketId));

        if (!ticket.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Ticket not found: " + ticketId);
        }

        TicketMessage message = new TicketMessage();
        message.setTicket(ticket);
        message.setSender(user);
        message.setContent(messageText);
        message.setStaffReply(false);
        ticket.getMessages().add(message);

        // Reopen ticket if it was closed
        if (ticket.getStatus() == TicketStatus.CLOSED || ticket.getStatus() == TicketStatus.RESOLVED) {
            ticket.setStatus(TicketStatus.OPEN);
        }

        ticket = ticketRepository.save(ticket);
        return toTicketResponse(ticket);
    }

    private SupportTicketResponse toTicketResponse(SupportTicket ticket) {
        List<SupportTicketResponse.TicketMessageResponse> messages = ticket.getMessages().stream()
                .map(msg -> new SupportTicketResponse.TicketMessageResponse(
                        msg.getId(),
                        msg.getContent(),
                        msg.isStaffReply(),
                        msg.getCreatedAt()
                ))
                .toList();

        return new SupportTicketResponse(
                ticket.getId(),
                ticket.getSubject(),
                ticket.getStatus(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt(),
                messages
        );
    }
}
