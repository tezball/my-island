package com.myisland.api.modules.identity;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myisland.api.modules.identity.dto.AuthRequest;
import com.myisland.api.modules.identity.dto.SignupRequest;
import com.myisland.api.support.BddTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@DisplayName("Auth API")
class AuthControllerTest extends BddTest {

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        resetScenario();
    }

    @Nested
    @DisplayName("POST /auth/signup")
    class Signup {

        @Test
        @DisplayName("Given valid signup request, When I submit, Then user is created and token returned")
        void shouldCreateUserAndReturnToken() throws Exception {
            // Given
            var request = new SignupRequest("newuser@example.com", "password123", "New User");

            // When
            result = mockMvc.perform(post("/auth/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));

            // Then
            result.andExpect(status().isCreated())
                    .andExpect(jsonPath("$.token").exists())
                    .andExpect(jsonPath("$.tokenType").value("Bearer"))
                    .andExpect(jsonPath("$.user.email").value("newuser@example.com"))
                    .andExpect(jsonPath("$.user.name").value("New User"))
                    .andExpect(jsonPath("$.user.role").value("GUEST"));
        }

        @Test
        @DisplayName("Given duplicate email, When I submit, Then conflict error returned")
        void shouldRejectDuplicateEmail() throws Exception {
            // Given - First create a user
            var firstRequest = new SignupRequest("duplicate@example.com", "password123", "First User");
            mockMvc.perform(post("/auth/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(firstRequest)));

            // When - Try to create another with same email
            var duplicateRequest = new SignupRequest("duplicate@example.com", "password456", "Second User");
            result = mockMvc.perform(post("/auth/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(duplicateRequest)));

            // Then
            result.andExpect(status().isConflict())
                    .andExpect(jsonPath("$.message").value(containsString("already registered")));
        }

        @Test
        @DisplayName("Given invalid email format, When I submit, Then validation error returned")
        void shouldRejectInvalidEmail() throws Exception {
            // Given
            var request = new SignupRequest("not-an-email", "password123", "Test User");

            // When
            result = mockMvc.perform(post("/auth/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));

            // Then
            result.andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.email").exists());
        }

        @Test
        @DisplayName("Given short password, When I submit, Then validation error returned")
        void shouldRejectShortPassword() throws Exception {
            // Given
            var request = new SignupRequest("test@example.com", "short", "Test User");

            // When
            result = mockMvc.perform(post("/auth/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));

            // Then
            result.andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.password").exists());
        }
    }

    @Nested
    @DisplayName("POST /auth/login")
    class Login {

        @Test
        @DisplayName("Given valid credentials, When I login, Then token is returned")
        void shouldReturnTokenForValidCredentials() throws Exception {
            // Given - Create a user first
            var signupRequest = new SignupRequest("login@example.com", "password123", "Login User");
            mockMvc.perform(post("/auth/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(signupRequest)));

            var loginRequest = new AuthRequest("login@example.com", "password123");

            // When
            result = mockMvc.perform(post("/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginRequest)));

            // Then
            result.andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").exists())
                    .andExpect(jsonPath("$.user.email").value("login@example.com"));
        }

        @Test
        @DisplayName("Given invalid password, When I login, Then unauthorized error returned")
        void shouldRejectInvalidPassword() throws Exception {
            // Given - Create a user first
            var signupRequest = new SignupRequest("wrongpass@example.com", "password123", "Test User");
            mockMvc.perform(post("/auth/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(signupRequest)));

            var loginRequest = new AuthRequest("wrongpass@example.com", "wrongpassword");

            // When
            result = mockMvc.perform(post("/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginRequest)));

            // Then
            result.andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Given non-existent user, When I login, Then unauthorized error returned")
        void shouldRejectNonExistentUser() throws Exception {
            // Given
            var loginRequest = new AuthRequest("nonexistent@example.com", "password123");

            // When
            result = mockMvc.perform(post("/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginRequest)));

            // Then
            result.andExpect(status().isUnauthorized());
        }
    }

    @Nested
    @DisplayName("GET /auth/me")
    class GetCurrentUser {

        @Test
        @DisplayName("Given valid token, When I get me, Then user profile returned")
        void shouldReturnUserProfile() throws Exception {
            // Given - Create and login
            var signupRequest = new SignupRequest("me@example.com", "password123", "Me User");
            var signupResult = mockMvc.perform(post("/auth/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(signupRequest)))
                    .andReturn();

            String response = signupResult.getResponse().getContentAsString();
            authToken = objectMapper.readTree(response).get("token").asText();

            // When
            result = mockMvc.perform(get("/auth/me")
                    .header("Authorization", "Bearer " + authToken));

            // Then
            result.andExpect(status().isOk())
                    .andExpect(jsonPath("$.email").value("me@example.com"))
                    .andExpect(jsonPath("$.name").value("Me User"));
        }

        @Test
        @DisplayName("Given no token, When I get me, Then unauthorized error returned")
        void shouldRejectWithoutToken() throws Exception {
            // When
            result = mockMvc.perform(get("/auth/me"));

            // Then
            result.andExpect(status().isUnauthorized());
        }
    }
}
