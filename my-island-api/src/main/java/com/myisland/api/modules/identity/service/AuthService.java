package com.myisland.api.modules.identity.service;

import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.identity.dto.*;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.repository.UserRepository;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
import com.myisland.api.security.JwtProvider;
import com.myisland.api.shared.email.EmailService;
import com.myisland.api.shared.exceptions.BadRequestException;
import com.myisland.api.shared.exceptions.ConflictException;
import com.myisland.api.shared.exceptions.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final OwnerRepository ownerRepository;
    private final SupplierRepository supplierRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository, OwnerRepository ownerRepository,
                       SupplierRepository supplierRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtProvider jwtProvider,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.ownerRepository = ownerRepository;
        this.supplierRepository = supplierRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
        this.emailService = emailService;
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ConflictException("Email already registered");
        }

        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .name(request.name())
                .role(User.UserRole.GUEST)
                .build();

        user = userRepository.save(user);
        log.info("New user registered: {}", user.getEmail());

        sendEmailVerification(user);

        String token = jwtProvider.generateToken(user.getEmail());
        return new AuthResponse(token, jwtProvider.getExpirationMs(), AuthResponse.UserDto.from(user));
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String token = jwtProvider.generateToken(authentication);
        log.info("User logged in: {}", user.getEmail());

        return new AuthResponse(token, jwtProvider.getExpirationMs(), AuthResponse.UserDto.from(user));
    }

    @Transactional
    public AuthResponse upgradeToOwner(Long userId, UpgradeToOwnerRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (user.isOwner()) {
            throw new BadRequestException("User is already an owner");
        }

        Owner owner = Owner.builder()
                .user(user)
                .propertyName(request.propertyName())
                .county(request.county())
                .town(request.town())
                .propertyType(Owner.PropertyType.valueOf(request.propertyType()))
                .description(request.description())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .phone(request.phone())
                .website(request.website())
                .build();

        ownerRepository.save(owner);

        user.setOwner(true);
        if (user.getRole() == User.UserRole.GUEST) {
            user.setRole(User.UserRole.OWNER);
        }
        user = userRepository.save(user);

        log.info("User upgraded to owner: {}", user.getEmail());

        String token = jwtProvider.generateToken(user.getEmail());
        return new AuthResponse(token, jwtProvider.getExpirationMs(), AuthResponse.UserDto.from(user));
    }

    @Transactional
    public AuthResponse upgradeToSupplier(Long userId, UpgradeToSupplierRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (user.isSupplier()) {
            throw new BadRequestException("User is already a supplier");
        }

        Supplier supplier = Supplier.builder()
                .user(user)
                .businessName(request.businessName())
                .category(Supplier.SupplierCategory.valueOf(request.category()))
                .description(request.description())
                .county(request.county())
                .town(request.town())
                .address(request.address())
                .phone(request.phone())
                .website(request.website())
                .logoUrl(request.logoUrl())
                .build();

        supplierRepository.save(supplier);

        user.setSupplier(true);
        if (user.getRole() == User.UserRole.GUEST) {
            user.setRole(User.UserRole.SUPPLIER);
        }
        user = userRepository.save(user);

        log.info("User upgraded to supplier: {}", user.getEmail());

        String token = jwtProvider.generateToken(user.getEmail());
        return new AuthResponse(token, jwtProvider.getExpirationMs(), AuthResponse.UserDto.from(user));
    }

    public void requestPasswordReset(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setPasswordResetToken(token);
            user.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(1));
            userRepository.save(user);
            emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), token);
            log.info("Password reset email sent to: {}", user.getEmail());
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByPasswordResetToken(request.token())
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset link"));

        if (user.getPasswordResetTokenExpiry() == null || user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Invalid or expired reset link");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        userRepository.save(user);
        log.info("Password reset successful for: {}", user.getEmail());
    }

    public void sendEmailVerification(User user) {
        String token = UUID.randomUUID().toString();
        user.setEmailVerificationToken(token);
        user.setEmailVerificationTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);
        emailService.sendEmailVerificationEmail(user.getEmail(), user.getName(), token);
        log.info("Email verification sent to: {}", user.getEmail());
    }

    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid or expired verification link"));

        if (user.getEmailVerificationTokenExpiry() == null || user.getEmailVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Invalid or expired verification link");
        }

        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationTokenExpiry(null);
        userRepository.save(user);
        log.info("Email verified for: {}", user.getEmail());
    }

    public User getCurrentUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
    }
}
