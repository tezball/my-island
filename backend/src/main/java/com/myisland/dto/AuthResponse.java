package com.myisland.dto;

import com.myisland.model.User;

public class AuthResponse {
    private User user;
    private String token;

    public AuthResponse() {}

    public AuthResponse(User user, String token) {
        this.user = user;
        this.token = token;
    }

    public static Builder builder() {
        return new Builder();
    }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public static class Builder {
        private User user;
        private String token;

        public Builder user(User user) { this.user = user; return this; }
        public Builder token(String token) { this.token = token; return this; }

        public AuthResponse build() {
            return new AuthResponse(user, token);
        }
    }
}
