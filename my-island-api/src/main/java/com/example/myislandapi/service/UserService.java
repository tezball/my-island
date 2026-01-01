package com.example.myislandapi.service;

import com.example.myislandapi.dto.request.UpdateNotificationPreferencesRequest;
import com.example.myislandapi.dto.request.UpdateUserRequest;
import com.example.myislandapi.dto.response.UserResponse;
import com.example.myislandapi.entity.NotificationPreferences;
import com.example.myislandapi.entity.User;
import com.example.myislandapi.exception.BadRequestException;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateUser(UUID userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (request.name() != null) {
            user.setName(request.name());
        }
        if (request.avatar() != null) {
            user.setAvatar(request.avatar());
        }
        if (request.phone() != null) {
            user.setPhone(request.phone());
        }
        if (request.bio() != null) {
            user.setBio(request.bio());
        }

        user = userRepository.save(user);
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateNotificationPreferences(UUID userId, UpdateNotificationPreferencesRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        NotificationPreferences prefs = user.getNotificationPreferences();
        if (request.email() != null) {
            prefs.setEmail(request.email());
        }
        if (request.push() != null) {
            prefs.setPush(request.push());
        }
        if (request.sms() != null) {
            prefs.setSms(request.sms());
        }
        if (request.marketing() != null) {
            prefs.setMarketing(request.marketing());
        }

        user = userRepository.save(user);
        return mapToUserResponse(user);
    }

    @Transactional
    public void deleteUser(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        userRepository.deleteById(userId);
    }

    @Transactional
    public UserResponse becomeOwner(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (user.isOwner()) {
            throw new BadRequestException("User is already registered as an owner");
        }

        user.setOwner(true);
        user = userRepository.save(user);
        return mapToUserResponse(user);
    }

    private UserResponse mapToUserResponse(User user) {
        List<UserResponse.LinkedAccountResponse> linkedAccounts = user.getLinkedAccounts().stream()
                .map(la -> new UserResponse.LinkedAccountResponse(
                        la.getProvider().name().toLowerCase(),
                        la.getEmail(),
                        la.isConnected()
                ))
                .toList();

        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getAvatar(),
                user.getPhone(),
                user.getBio(),
                user.isOwner(),
                user.getCreatedAt(),
                UserResponse.NotificationPreferencesResponse.from(user.getNotificationPreferences()),
                linkedAccounts
        );
    }
}
