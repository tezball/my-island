package com.example.myislandapi.service;

import com.example.myislandapi.dto.request.SendMessageRequest;
import com.example.myislandapi.dto.response.MessageResponse;
import com.example.myislandapi.model.BookingModel;
import com.example.myislandapi.model.LotModel;
import com.example.myislandapi.model.CampsiteModel;
import com.example.myislandapi.model.MessageModel;
import com.example.myislandapi.model.UserModel;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.repository.jdbc.JdbcBookingRepository;
import com.example.myislandapi.repository.jdbc.JdbcCampsiteRepository;
import com.example.myislandapi.repository.jdbc.JdbcLotRepository;
import com.example.myislandapi.repository.jdbc.JdbcMessageRepository;
import com.example.myislandapi.repository.jdbc.JdbcUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class MessageService {

    private final JdbcMessageRepository messageRepository;
    private final JdbcBookingRepository bookingRepository;
    private final JdbcUserRepository userRepository;
    private final JdbcLotRepository lotRepository;
    private final JdbcCampsiteRepository campsiteRepository;

    public MessageService(JdbcMessageRepository messageRepository,
                         JdbcBookingRepository bookingRepository,
                         JdbcUserRepository userRepository,
                         JdbcLotRepository lotRepository,
                         JdbcCampsiteRepository campsiteRepository) {
        this.messageRepository = messageRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.lotRepository = lotRepository;
        this.campsiteRepository = campsiteRepository;
    }

    public List<MessageResponse> getMessagesForBooking(UUID bookingId, UUID userId) {
        BookingModel booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Verify user has access
        boolean isGuest = booking.getUserId().equals(userId);

        LotModel lot = lotRepository.findById(booking.getLotId())
                .orElseThrow(() -> new ResourceNotFoundException("Lot not found"));
        CampsiteModel campsite = campsiteRepository.findById(lot.getCampsiteId())
                .orElseThrow(() -> new ResourceNotFoundException("Campsite not found"));
        boolean isOwner = campsite.getOwnerId().equals(userId);

        if (!isGuest && !isOwner) {
            throw new ResourceNotFoundException("Booking not found");
        }

        List<MessageModel> messages = messageRepository.findByBookingIdOrderByCreatedAtAsc(bookingId);
        return messages.stream().map(this::toResponse).toList();
    }

    @Transactional
    public MessageResponse sendMessage(UUID bookingId, UUID userId, SendMessageRequest request) {
        BookingModel booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Verify user has access
        boolean isGuest = booking.getUserId().equals(userId);

        LotModel lot = lotRepository.findById(booking.getLotId())
                .orElseThrow(() -> new ResourceNotFoundException("Lot not found"));
        CampsiteModel campsite = campsiteRepository.findById(lot.getCampsiteId())
                .orElseThrow(() -> new ResourceNotFoundException("Campsite not found"));
        boolean isOwner = campsite.getOwnerId().equals(userId);

        if (!isGuest && !isOwner) {
            throw new ResourceNotFoundException("Booking not found");
        }

        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }

        MessageModel message = new MessageModel();
        message.setBookingId(bookingId);
        message.setSenderId(userId);
        message.setContent(request.content());

        message = messageRepository.save(message);
        return toResponse(message);
    }

    private MessageResponse toResponse(MessageModel message) {
        UserModel sender = userRepository.findById(message.getSenderId())
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        return new MessageResponse(
                message.getId(),
                message.getBookingId(),
                sender.getId(),
                sender.getName(),
                sender.getAvatar(),
                message.getContent(),
                message.isRead(),
                message.getCreatedAt()
        );
    }
}
