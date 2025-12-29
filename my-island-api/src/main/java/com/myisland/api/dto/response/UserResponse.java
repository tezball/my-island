package com.myisland.api.dto.response;

import com.myisland.api.entity.User;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class UserResponse {
    private String id;
    private String email;
    private String name;
    private String avatar;
    private List<String> savedCampsites;

    public static UserResponse from(User user) {
        return UserResponse.builder()
            .id(user.getId().toString())
            .email(user.getEmail())
            .name(user.getName())
            .avatar(user.getAvatarUrl())
            .savedCampsites(user.getFavorites().stream()
                .map(c -> c.getId().toString())
                .collect(Collectors.toList()))
            .build();
    }
}
