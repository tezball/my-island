package com.example.myislandapi.fixture;

import com.example.myislandapi.model.UserModel;

/**
 * Fixtures for creating UserModel instances in tests.
 */
public class UserFixtures {

    public static UserModel createUser() {
        return createUser("test@example.com", "Test User", false, false);
    }

    public static UserModel createUser(String email) {
        return createUser(email, "Test User", false, false);
    }

    public static UserModel createOwner() {
        return createUser("owner@example.com", "Test Owner", true, false);
    }

    public static UserModel createOwner(String email) {
        return createUser(email, "Test Owner", true, false);
    }

    public static UserModel createSupplier() {
        return createUser("supplier@example.com", "Test Supplier", false, true);
    }

    public static UserModel createUser(String email, String name, boolean isOwner, boolean isSupplier) {
        UserModel user = new UserModel();
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

        public UserModel build() {
            UserModel user = new UserModel();
            user.setEmail(email);
            user.setPasswordHash(passwordHash);
            user.setName(name);
            user.setOwner(isOwner);
            user.setSupplier(isSupplier);
            return user;
        }
    }
}
