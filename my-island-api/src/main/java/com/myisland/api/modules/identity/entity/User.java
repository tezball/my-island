package com.myisland.api.modules.identity.entity;

import com.myisland.api.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.GUEST;

    @Column(name = "is_owner", nullable = false)
    private boolean isOwner = false;

    @Column(name = "is_supplier", nullable = false)
    private boolean isSupplier = false;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;

    @Column(name = "email_verification_token")
    private String emailVerificationToken;

    @Column(name = "email_verification_token_expiry")
    private LocalDateTime emailVerificationTokenExpiry;

    @Column(name = "password_reset_token")
    private String passwordResetToken;

    @Column(name = "password_reset_token_expiry")
    private LocalDateTime passwordResetTokenExpiry;

    public enum UserRole {
        GUEST, OWNER, SUPPLIER
    }

    public User() {}

    public User(String email, String passwordHash, String name, UserRole role, boolean isOwner, boolean isSupplier) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.name = name;
        this.role = role;
        this.isOwner = isOwner;
        this.isSupplier = isSupplier;
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String email;
        private String passwordHash;
        private String name;
        private UserRole role = UserRole.GUEST;
        private boolean isOwner = false;
        private boolean isSupplier = false;

        public Builder email(String email) { this.email = email; return this; }
        public Builder passwordHash(String passwordHash) { this.passwordHash = passwordHash; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder role(UserRole role) { this.role = role; return this; }
        public Builder isOwner(boolean isOwner) { this.isOwner = isOwner; return this; }
        public Builder isSupplier(boolean isSupplier) { this.isSupplier = isSupplier; return this; }

        public User build() {
            return new User(email, passwordHash, name, role, isOwner, isSupplier);
        }
    }

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public boolean isOwner() { return isOwner; }
    public void setOwner(boolean owner) { isOwner = owner; }

    public boolean isSupplier() { return isSupplier; }
    public void setSupplier(boolean supplier) { isSupplier = supplier; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public String getEmailVerificationToken() { return emailVerificationToken; }
    public void setEmailVerificationToken(String emailVerificationToken) { this.emailVerificationToken = emailVerificationToken; }

    public LocalDateTime getEmailVerificationTokenExpiry() { return emailVerificationTokenExpiry; }
    public void setEmailVerificationTokenExpiry(LocalDateTime emailVerificationTokenExpiry) { this.emailVerificationTokenExpiry = emailVerificationTokenExpiry; }

    public String getPasswordResetToken() { return passwordResetToken; }
    public void setPasswordResetToken(String passwordResetToken) { this.passwordResetToken = passwordResetToken; }

    public LocalDateTime getPasswordResetTokenExpiry() { return passwordResetTokenExpiry; }
    public void setPasswordResetTokenExpiry(LocalDateTime passwordResetTokenExpiry) { this.passwordResetTokenExpiry = passwordResetTokenExpiry; }
}
