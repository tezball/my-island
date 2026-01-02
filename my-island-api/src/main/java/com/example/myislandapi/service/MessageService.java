package com.example.myislandapi.service;

import com.example.myislandapi.dto.request.SendMessageRequest;
import com.example.myislandapi.dto.response.MessageResponse;
import com.example.myislandapi.entity.Booking;
import com.example.myislandapi.entity.Message;
import com.example.myislandapi.entity.User;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.repository.BookingRepository;
import com.example.myislandapi.repository.MessageRepository;
import com.example.myislandapi.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class MessageService {

    private final MessageRepository messageRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository,
                         BookingRepository bookingRepository,
                         UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    public List<MessageResponse> getMessagesForBooking(UUID bookingId, UUID userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Verify user has access
        boolean isGuest = booking.getUser().getId().equals(userId);
        boolean isOwner = booking.getLot().getCampsite().getOwner().getId().equals(userId);

        if (!isGuest && !isOwner) {
            throw new ResourceNotFoundException("Booking not found");
        }

        List<Message> messages = messageRepository.findByBookingIdOrderByCreatedAtAsc(bookingId);
        return messages.stream().map(this::toResponse).toList();
    }

    @Transactional
    public MessageResponse sendMessage(UUID bookingId, UUID userId, SendMessageRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Verify user has access
        boolean isGuest = booking.getUser().getId().equals(userId);
        boolean isOwner = booking.getLot().getCampsite().getOwner().getId().equals(userId);

        if (!isGuest && !isOwner) {
            throw new ResourceNotFoundException("Booking not found");
        }

        User sender = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Message message = new Message();
        message.setBooking(booking);
        message.setSender(sender);
        message.setContent(request.content());

        message = messageRepository.save(message);
        return toResponse(message);
    }

    private MessageResponse toResponse(Message message) {
        User sender = message.getSender();
        return new MessageResponse(
                message.getId(),
                message.getBooking().getId(),
                sender.getId(),
                sender.getName(),
                sender.getAvatar(),
                message.getContent(),
                message.isRead(),
                message.getCreatedAt()
        );
    }
}
