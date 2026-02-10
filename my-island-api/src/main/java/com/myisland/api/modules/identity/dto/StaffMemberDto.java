package com.myisland.api.modules.identity.dto;

import com.myisland.api.modules.identity.entity.StaffMember;

public record StaffMemberDto(
        Long id,
        String email,
        String status,
        String userName,
        String role
) {
    public static StaffMemberDto from(StaffMember staffMember) {
        return new StaffMemberDto(
                staffMember.getId(),
                staffMember.getEmail(),
                staffMember.getStatus().name(),
                staffMember.getUser() != null ? staffMember.getUser().getName() : null,
                staffMember.getRole().name()
        );
    }
}
