package com.myisland.api.modules.identity.dto;

import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.service.StaffService;

import java.util.Map;

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
            boolean isStaff,
            boolean isAdmin,
            boolean emailVerified,
            StaffPermissionsDto staffPermissions
    ) {
        public static UserDto from(User user) {
            return new UserDto(
                    user.getId(),
                    user.getEmail(),
                    user.getName(),
                    user.getRole().name(),
                    user.isOwner(),
                    user.isSupplier(),
                    user.isStaff(),
                    user.isAdmin(),
                    user.isEmailVerified(),
                    null
            );
        }

        public static UserDto from(User user, StaffService.StaffPermissionsPayload permissions) {
            StaffPermissionsDto dto = null;
            if (permissions != null) {
                dto = new StaffPermissionsDto(
                        permissions.owner() != null ? new StaffPermissionsDto.PortalPermissions(
                                permissions.owner().role(),
                                permissions.owner().permissions()
                        ) : null,
                        permissions.supplier() != null ? new StaffPermissionsDto.PortalPermissions(
                                permissions.supplier().role(),
                                permissions.supplier().permissions()
                        ) : null
                );
            }
            return new UserDto(
                    user.getId(),
                    user.getEmail(),
                    user.getName(),
                    user.getRole().name(),
                    user.isOwner(),
                    user.isSupplier(),
                    user.isStaff(),
                    user.isAdmin(),
                    user.isEmailVerified(),
                    dto
            );
        }
    }

    public record StaffPermissionsDto(
            PortalPermissions owner,
            PortalPermissions supplier
    ) {
        public record PortalPermissions(
                String role,
                Map<String, String> permissions
        ) {}
    }
}
