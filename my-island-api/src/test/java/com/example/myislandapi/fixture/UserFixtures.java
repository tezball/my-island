package com.example.myislandapi.fixture;

import com.example.myislandapi.entity.User;

/**
 * Fixtures for creating User entities in tests.
 */
public class UserFixtures {

    public static User createUser() {
        return createUser("test@example.com", "Test User", false, false);
    }

    public static User createUser(String email) {
        return createUser(email, "Test User", false, false);
    }

    public static User createOwner() {
        return createUser("owner@example.com", "Test Owner", true, false);
    }

    public static User createOwner(String email) {
        return createUser(email, "Test Owner", true, false);
    }

    public static User createSupplier() {
        return createUser("supplier@example.com", "Test Supplier", false, true);
    }

    public static User createUser(String email, String name, boolean isOwner, boolean isSupplier) {
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash("$2a$10$dummyHashForTesting123456789012345678901234567890");
        user.setName(name);
        user.setOwner(isOwner);
        user.setSupplier(isSupplier);
        return user;
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private String email = "test@example.com";
        private String name = "Test User";
        private String passwordHash = "$2a$10$dummyHashForTesting";
        private boolean isOwner = false;
        private boolean isSupplier = false;

        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder name(String name) {
            this.name = name;
            return this;
        }

        public UserBuilder passwordHash(String passwordHash) {
            this.passwordHash = passwordHash;
            return this;
        }

        public UserBuilder isOwner(boolean isOwner) {
            this.isOwner = isOwner;
            return this;
        }

        public UserBuilder isSupplier(boolean isSupplier) {
            this.isSupplier = isSupplier;
            return this;
        }

        public User build() {
            User user = new User();
            user.setEmail(email);
            user.setPasswordHash(passwordHash);
            user.setName(name);
            user.setOwner(isOwner);
            user.setSupplier(isSupplier);
            return user;
        }
    }
}
