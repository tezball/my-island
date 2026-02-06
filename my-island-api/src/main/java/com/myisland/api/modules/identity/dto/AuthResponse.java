package com.myisland.api.modules.identity.dto;

import com.myisland.api.modules.identity.entity.User;

public record AuthResponse(
        String token,
        String tokenType,
        Long expiresIn,
        UserDto user
) {
    public AuthResponse(String token, Long expiresIn, UserDto user) {
        this(token, "Bearer", expiresIn, user);
    }

    public record UserDto(
            Long id,
            String email,
            String name,
            String role,
            boolean isOwner,
            boolean isSupplier,
            boolean emailVerified
    ) {
        public static UserDto from(User user) {
            return new UserDto(
                    user.getId(),
                    user.getEmail(),
                    user.getName(),
                    user.getRole().name(),
                    user.isOwner(),
                    user.isSupplier(),
                    user.isEmailVerified()
            );
        }
    }
}
