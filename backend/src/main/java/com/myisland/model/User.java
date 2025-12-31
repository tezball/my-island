package com.myisland.model;

import java.util.ArrayList;
import java.util.List;

public class User {
    private String id;
    private String email;
    private String name;
    private String avatar;
    private List<String> savedCampsites = new ArrayList<>();
    private UserRole role;

    public enum UserRole {
        visitor, owner, supplier
    }

    public User() {}

    public User(String id, String email, String name, String avatar, List<String> savedCampsites, UserRole role) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.avatar = avatar;
        this.savedCampsites = savedCampsites != null ? savedCampsites : new ArrayList<>();
        this.role = role;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public List<String> getSavedCampsites() { return savedCampsites; }
    public void setSavedCampsites(List<String> savedCampsites) { this.savedCampsites = savedCampsites; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public static class Builder {
        private String id;
        private String email;
        private String name;
        private String avatar;
        private List<String> savedCampsites = new ArrayList<>();
        private UserRole role;

        public Builder id(String id) { this.id = id; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder avatar(String avatar) { this.avatar = avatar; return this; }
        public Builder savedCampsites(List<String> savedCampsites) { this.savedCampsites = savedCampsites; return this; }
        public Builder role(UserRole role) { this.role = role; return this; }

        public User build() {
            return new User(id, email, name, avatar, savedCampsites, role);
        }
    }
}
