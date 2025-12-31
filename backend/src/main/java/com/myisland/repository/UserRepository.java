package com.myisland.repository;

import com.myisland.model.User;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class UserRepository {
    private final Map<String, User> users = new ConcurrentHashMap<>();

    public Optional<User> findById(String id) {
        return Optional.ofNullable(users.get(id));
    }

    public Optional<User> findByEmail(String email) {
        return users.values().stream()
                .filter(user -> user.getEmail().equalsIgnoreCase(email))
                .findFirst();
    }

    public Collection<User> findAll() {
        return users.values();
    }

    public User save(User user) {
        users.put(user.getId(), user);
        return user;
    }

    public void deleteById(String id) {
        users.remove(id);
    }

    public boolean existsById(String id) {
        return users.containsKey(id);
    }
}
