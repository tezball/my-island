package com.myisland.api.modules.communication.service;

import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.modules.communication.dto.ConversationSummaryDto;
import com.myisland.api.modules.communication.dto.MessageDto;
import com.myisland.api.modules.communication.entity.Message;
import com.myisland.api.modules.communication.repository.MessageRepository;
import com.myisland.api.modules.identity.entity.StaffMember;
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

    private static final Set<Booking.BookingStatus> MESSAGEABLE_STATUSES = Set.of(
            Booking.BookingStatus.CONFIRMED,
            Booking.BookingStatus.CHECKED_IN,
            Booking.BookingStatus.COMPLETED
    );

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

        validateBookingStatus(booking);

        User sender = userRepository.findById(senderUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", senderUserId));

        validateParticipant(booking, senderUserId);

        Message message = new Message(booking, sender, content.trim());
        messageRepository.save(message);

        createMessageNotification(booking, sender);

        // Resolve display name: staff members show the campsite name
        String displayName = resolveDisplayName(sender, booking, senderUserId);
        return MessageDto.from(message, displayName);
    }

    @Transactional
    public List<MessageDto> getConversation(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        validateParticipant(booking, userId);

        // Mark received messages as read
        messageRepository.markReadByBookingIdAndNotSender(bookingId, userId);

        List<Message> messages = messageRepository.findByBookingIdOrderByCreatedAtAsc(bookingId);

        // Pre-compute owner/staff context for display name resolution
        Long ownerUserId = booking.getLot().getOwner().getUser().getId();
        Long ownerId = booking.getLot().getOwner().getId();
        String campsiteName = booking.getLot().getOwner().getPropertyName();
        Set<Long> staffUserIds = staffMemberRepository.findByOwnerId(ownerId).stream()
                .map(sm -> sm.getUser().getId())
                .collect(Collectors.toSet());

        return messages.stream().map(msg -> {
            Long senderId = msg.getSender().getId();
            String displayName;
            if (staffUserIds.contains(senderId) && !senderId.equals(ownerUserId)) {
                displayName = campsiteName != null ? campsiteName : msg.getSender().getName();
            } else {
                displayName = msg.getSender().getName();
            }
            return MessageDto.from(msg, displayName);
        }).toList();
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

        List<Long> uniqueBookingIds = bookingIds.stream().distinct().toList();

        List<Object[]> counts = messageRepository.countUnreadByBookingIds(uniqueBookingIds, userId);
        Map<Long, Long> result = new HashMap<>();
        for (Object[] row : counts) {
            result.put((Long) row[0], (Long) row[1]);
        }
        return result;
    }

    @Transactional(readOnly = true)
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

        // Get all bookings for this owner that have messages
        List<Booking> ownerBookings = bookingRepository.findByOwnerId(ownerId);
        List<Long> bookingIds = ownerBookings.stream().map(Booking::getId).toList();

        if (bookingIds.isEmpty()) {
            return List.of();
        }

        // Batch fetch: last message per booking and unread counts
        List<Object[]> lastMessages = messageRepository.findLastMessagePerBooking(bookingIds);
        Map<Long, Long> unreadCounts = new HashMap<>();
        for (Object[] row : messageRepository.countUnreadByBookingIds(bookingIds, userId)) {
            unreadCounts.put((Long) row[0], (Long) row[1]);
        }

        // Build lookup for bookings
        Map<Long, Booking> bookingMap = ownerBookings.stream()
                .collect(Collectors.toMap(Booking::getId, b -> b));

        List<ConversationSummaryDto> conversations = new ArrayList<>();
        for (Object[] row : lastMessages) {
            Long bookingId = (Long) row[0];
            String lastContent = (String) row[1];
            String lastSenderName = (String) row[2];
            java.time.LocalDateTime lastAt = (java.time.LocalDateTime) row[3];

            Booking booking = bookingMap.get(bookingId);
            if (booking == null) continue;

            String guestName = booking.getUser() != null ? booking.getUser().getName() : booking.getGuestName();
            String preview = lastContent.length() > 100
                    ? lastContent.substring(0, 100) + "..."
                    : lastContent;
            long unread = unreadCounts.getOrDefault(bookingId, 0L);

            conversations.add(new ConversationSummaryDto(
                    bookingId,
                    booking.getLot().getName(),
                    guestName,
                    booking.getCheckInDate().toString(),
                    booking.getCheckOutDate().toString(),
                    preview,
                    lastSenderName,
                    lastAt,
                    unread
            ));
        }

        // Sort by last message time descending
        conversations.sort((a, b) -> b.lastMessageAt().compareTo(a.lastMessageAt()));
        return conversations;
    }

    private void validateBookingStatus(Booking booking) {
        if (!MESSAGEABLE_STATUSES.contains(booking.getStatus())) {
            throw new BadRequestException(
                    "Messaging is not available for bookings with status: " + booking.getStatus());
        }
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

    private String resolveDisplayName(User sender, Booking booking, Long senderUserId) {
        Long ownerUserId = booking.getLot().getOwner().getUser().getId();
        // If the sender is the owner themselves, use their name
        if (ownerUserId.equals(senderUserId)) {
            return sender.getName();
        }
        // If the sender is staff of the owner, show the campsite name
        Long ownerId = booking.getLot().getOwner().getId();
        boolean isStaff = staffMemberRepository.findByOwnerIdAndUserId(ownerId, senderUserId).isPresent();
        if (isStaff) {
            String propertyName = booking.getLot().getOwner().getPropertyName();
            return propertyName != null ? propertyName : sender.getName();
        }
        return sender.getName();
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
                    .type(Notification.NotificationType.MESSAGE_RECEIVED)
                    .title("New Message")
                    .message(preview)
                    .link(link)
                    .build();
            notificationRepository.save(notification);
        }
    }
}
