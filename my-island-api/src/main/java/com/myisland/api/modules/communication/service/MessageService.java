package com.myisland.api.modules.communication.service;

import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.modules.communication.dto.ConversationSummaryDto;
import com.myisland.api.modules.communication.dto.MessageDto;
import com.myisland.api.modules.communication.entity.Message;
import com.myisland.api.modules.communication.repository.MessageRepository;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.repository.StaffMemberRepository;
import com.myisland.api.modules.identity.repository.UserRepository;
import com.myisland.api.modules.notification.entity.Notification;
import com.myisland.api.modules.notification.repository.NotificationRepository;
import com.myisland.api.shared.exceptions.BadRequestException;
import com.myisland.api.shared.exceptions.ForbiddenException;
import com.myisland.api.shared.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final OwnerRepository ownerRepository;
    private final StaffMemberRepository staffMemberRepository;
    private final NotificationRepository notificationRepository;

    public MessageService(MessageRepository messageRepository,
                          BookingRepository bookingRepository,
                          UserRepository userRepository,
                          OwnerRepository ownerRepository,
                          StaffMemberRepository staffMemberRepository,
                          NotificationRepository notificationRepository) {
        this.messageRepository = messageRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.ownerRepository = ownerRepository;
        this.staffMemberRepository = staffMemberRepository;
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public MessageDto sendMessage(Long bookingId, Long senderUserId, String content) {
        if (content == null || content.isBlank()) {
            throw new BadRequestException("Message content is required");
        }

        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        User sender = userRepository.findById(senderUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", senderUserId));

        // Validate that the sender is a participant (guest, owner, or owner's staff)
        validateParticipant(booking, senderUserId);

        Message message = new Message(booking, sender, content.trim());
        messageRepository.save(message);

        // Create notification for the recipient
        createMessageNotification(booking, sender);

        return MessageDto.from(message);
    }

    @Transactional
    public List<MessageDto> getConversation(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        validateParticipant(booking, userId);

        // Mark received messages as read
        messageRepository.markReadByBookingIdAndNotSender(bookingId, userId);

        List<Message> messages = messageRepository.findByBookingIdOrderByCreatedAtAsc(bookingId);
        return messages.stream().map(MessageDto::from).toList();
    }

    public Map<Long, Long> getUnreadCounts(Long userId) {
        // Find all bookings where the user is guest
        List<Booking> guestBookings = bookingRepository.findByUserId(userId);
        List<Long> bookingIds = new ArrayList<>(guestBookings.stream().map(Booking::getId).toList());

        // Also find bookings where user is the owner
        ownerRepository.findByUserId(userId).ifPresent(owner -> {
            List<Booking> ownerBookings = bookingRepository.findByOwnerId(owner.getId());
            bookingIds.addAll(ownerBookings.stream().map(Booking::getId).toList());
        });

        // Also find bookings where user is staff of an owner
        staffMemberRepository.findByUserId(userId).stream()
                .filter(sm -> sm.getOwner() != null)
                .forEach(sm -> {
                    List<Booking> ownerBookings = bookingRepository.findByOwnerId(sm.getOwner().getId());
                    bookingIds.addAll(ownerBookings.stream().map(Booking::getId).toList());
                });

        if (bookingIds.isEmpty()) {
            return Map.of();
        }

        // Remove duplicates
        List<Long> uniqueBookingIds = bookingIds.stream().distinct().toList();

        List<Object[]> counts = messageRepository.countUnreadByBookingIds(uniqueBookingIds, userId);
        Map<Long, Long> result = new HashMap<>();
        for (Object[] row : counts) {
            result.put((Long) row[0], (Long) row[1]);
        }
        return result;
    }

    public List<ConversationSummaryDto> getOwnerConversations(Long userId) {
        // Find the owner for this user
        Owner owner = ownerRepository.findByUserId(userId).orElse(null);

        // Also check if user is staff of an owner
        Long ownerId = null;
        if (owner != null) {
            ownerId = owner.getId();
        } else {
            var staffMembers = staffMemberRepository.findByUserId(userId);
            for (var sm : staffMembers) {
                if (sm.getOwner() != null) {
                    ownerId = sm.getOwner().getId();
                    break;
                }
            }
        }

        if (ownerId == null) {
            throw new ForbiddenException("Not an owner or owner staff");
        }

        // Get all bookings for this owner
        List<Booking> ownerBookings = bookingRepository.findByOwnerId(ownerId);

        // For each booking, get the latest message and unread count
        List<ConversationSummaryDto> conversations = new ArrayList<>();
        for (Booking booking : ownerBookings) {
            List<Message> messages = messageRepository.findByBookingIdOrderByCreatedAtAsc(booking.getId());
            if (messages.isEmpty()) continue;

            Message lastMessage = messages.get(messages.size() - 1);
            long unread = messageRepository.countUnreadByBookingIdAndNotSender(booking.getId(), userId);

            String guestName = booking.getUser() != null ? booking.getUser().getName() : booking.getGuestName();
            conversations.add(new ConversationSummaryDto(
                    booking.getId(),
                    booking.getLot().getName(),
                    guestName,
                    booking.getCheckInDate().toString(),
                    booking.getCheckOutDate().toString(),
                    lastMessage.getContent().length() > 100
                            ? lastMessage.getContent().substring(0, 100) + "..."
                            : lastMessage.getContent(),
                    lastMessage.getSender().getName(),
                    lastMessage.getCreatedAt(),
                    unread
            ));
        }

        // Sort by last message time descending
        conversations.sort((a, b) -> b.lastMessageAt().compareTo(a.lastMessageAt()));
        return conversations;
    }

    private void validateParticipant(Booking booking, Long userId) {
        // Check if user is the guest
        if (booking.getUser() != null && booking.getUser().getId().equals(userId)) {
            return;
        }

        // Check if user is the owner
        Long ownerUserId = booking.getLot().getOwner().getUser().getId();
        if (ownerUserId.equals(userId)) {
            return;
        }

        // Check if user is staff of the owner
        Long ownerId = booking.getLot().getOwner().getId();
        boolean isStaff = staffMemberRepository.findByOwnerIdAndUserId(ownerId, userId).isPresent();
        if (isStaff) {
            return;
        }

        throw new ForbiddenException("You do not have access to this conversation");
    }

    private void createMessageNotification(Booking booking, User sender) {
        User recipient;
        String link;

        // If sender is the guest, notify the owner
        if (booking.getUser() != null && booking.getUser().getId().equals(sender.getId())) {
            recipient = booking.getLot().getOwner().getUser();
            link = "/owner/messages";
        } else {
            // Sender is owner or staff, notify the guest
            recipient = booking.getUser();
            link = "/trips/" + booking.getId() + "/messages";
        }

        if (recipient != null) {
            String preview = sender.getName() + ": " +
                    (sender.getId().equals(booking.getUser() != null ? booking.getUser().getId() : null)
                            ? "sent you a message"
                            : "replied to your message");

            Notification notification = Notification.builder()
                    .user(recipient)
                    .type(Notification.NotificationType.BOOKING_CREATED) // Reuse existing type
                    .title("New Message")
                    .message(preview)
                    .link(link)
                    .build();
            notificationRepository.save(notification);
        }
    }
}
