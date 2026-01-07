package com.example.myislandapi.service;

import com.example.myislandapi.dto.request.CreateTicketRequest;
import com.example.myislandapi.dto.response.FAQResponse;
import com.example.myislandapi.dto.response.SupportTicketResponse;
import com.example.myislandapi.enums.TicketStatus;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.model.SupportTicketModel;
import com.example.myislandapi.model.TicketMessageModel;
import com.example.myislandapi.model.UserModel;
import com.example.myislandapi.repository.jdbc.JdbcFaqRepository;
import com.example.myislandapi.repository.jdbc.JdbcSupportTicketRepository;
import com.example.myislandapi.repository.jdbc.JdbcUserRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class SupportService {

    private final JdbcFaqRepository faqRepository;
    private final JdbcSupportTicketRepository ticketRepository;
    private final JdbcUserRepository userRepository;

    public SupportService(JdbcFaqRepository faqRepository,
                         JdbcSupportTicketRepository ticketRepository,
                         JdbcUserRepository userRepository) {
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
        SupportTicketModel ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + ticketId));

        if (!ticket.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Ticket not found: " + ticketId);
        }

        return toTicketResponse(ticket);
    }

    @Transactional
    public SupportTicketResponse createTicket(UUID userId, CreateTicketRequest request) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        SupportTicketModel ticket = new SupportTicketModel();
        ticket.setUserId(userId);
        ticket.setSubject(request.subject());
        ticket.setStatus(TicketStatus.OPEN);

        TicketMessageModel message = new TicketMessageModel();
        message.setSenderId(userId);
        message.setContent(request.message());
        message.setStaffReply(false);

        List<TicketMessageModel> messages = new ArrayList<>();
        messages.add(message);
        ticket.setMessages(messages);

        ticket = ticketRepository.save(ticket);
        return toTicketResponse(ticket);
    }

    @Transactional
    public SupportTicketResponse addMessage(UUID ticketId, UUID userId, String messageText) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        SupportTicketModel ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + ticketId));

        if (!ticket.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Ticket not found: " + ticketId);
        }

        TicketMessageModel message = new TicketMessageModel();
        message.setSenderId(userId);
        message.setContent(messageText);
        message.setStaffReply(false);

        List<TicketMessageModel> messages = new ArrayList<>(ticket.getMessages());
        messages.add(message);
        ticket.setMessages(messages);

        // Reopen ticket if it was closed
        if (ticket.getStatus() == TicketStatus.CLOSED || ticket.getStatus() == TicketStatus.RESOLVED) {
            ticket.setStatus(TicketStatus.OPEN);
        }

        ticket = ticketRepository.save(ticket);
        return toTicketResponse(ticket);
    }

    private SupportTicketResponse toTicketResponse(SupportTicketModel ticket) {
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
