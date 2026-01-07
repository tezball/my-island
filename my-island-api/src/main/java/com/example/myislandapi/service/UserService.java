package com.example.myislandapi.service;

import com.example.myislandapi.dto.request.BecomeSupplierRequest;
import com.example.myislandapi.dto.request.UpdateNotificationPreferencesRequest;
import com.example.myislandapi.dto.request.UpdateUserRequest;
import com.example.myislandapi.dto.response.UserResponse;
import com.example.myislandapi.model.NotificationPreferences;
import com.example.myislandapi.model.SupplierModel;
import com.example.myislandapi.model.UserModel;
import com.example.myislandapi.exception.BadRequestException;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.repository.jdbc.JdbcSupplierRepository;
import com.example.myislandapi.repository.jdbc.JdbcUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final JdbcUserRepository userRepository;
    private final JdbcSupplierRepository supplierRepository;

    public UserService(JdbcUserRepository userRepository, JdbcSupplierRepository supplierRepository) {
        this.userRepository = userRepository;
        this.supplierRepository = supplierRepository;
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(UUID userId) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateUser(UUID userId, UpdateUserRequest request) {
        UserModel user = userRepository.findById(userId)
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
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        NotificationPreferences prefs = user.getNotificationPreferences();
        if (prefs == null) {
            prefs = new NotificationPreferences();
            user.setNotificationPreferences(prefs);
        }
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
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (user.isOwner()) {
            throw new BadRequestException("User is already registered as an owner");
        }

        user.setOwner(true);
        user = userRepository.save(user);
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse becomeSupplier(UUID userId, BecomeSupplierRequest request) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (user.isSupplier()) {
            throw new BadRequestException("User is already registered as a supplier");
        }

        // Create supplier profile with all required fields
        SupplierModel supplier = new SupplierModel();
        supplier.setUserId(userId);
        supplier.setBusinessName(request.businessName());
        supplier.setDescription(request.description());
        supplier.setLocation(request.location());
        supplier.setContactEmail(request.contactEmail() != null ? request.contactEmail() : user.getEmail());
        supplier.setPhoneNumber(request.phoneNumber() != null ? request.phoneNumber() : user.getPhone());
        supplier.setCategory(request.category());
        supplier.setEircode(request.eircode());
        supplier.setLatitude(request.latitude());
        supplier.setLongitude(request.longitude());
        supplierRepository.save(supplier);

        // Update user's supplier flag
        user.setSupplier(true);
        user = userRepository.save(user);

        return mapToUserResponse(user);
    }

    private UserResponse mapToUserResponse(UserModel user) {
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
                user.isSupplier(),
                user.getCreatedAt(),
                UserResponse.NotificationPreferencesResponse.from(user.getNotificationPreferences()),
                linkedAccounts
        );
    }
}
