package com.example.myislandapi.security;

import com.example.myislandapi.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public class UserDetailsImpl implements UserDetails {

    private final UUID id;
    private final String email;
    private final String password;
    private final boolean isOwner;
    private final boolean isSupplier;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(UUID id, String email, String password, boolean isOwner, boolean isSupplier,
                          Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.isOwner = isOwner;
        this.isSupplier = isSupplier;
        this.authorities = authorities;
    }

    public static UserDetailsImpl build(User user) {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        if (user.isOwner()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_OWNER"));
        }
        if (user.isSupplier()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_SUPPLIER"));
        }

        return new UserDetailsImpl(
                user.getId(),
                user.getEmail(),
                user.getPasswordHash(),
                user.isOwner(),
                user.isSupplier(),
                authorities
        );
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public boolean isOwner() {
        return isOwner;
    }

    public boolean isSupplier() {
        return isSupplier;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return id.toString();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
