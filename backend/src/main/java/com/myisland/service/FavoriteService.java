package com.myisland.service;

import com.myisland.model.Campsite;
import com.myisland.model.User;
import com.myisland.repository.CampsiteRepository;
import com.myisland.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FavoriteService {
    private final UserRepository userRepository;
    private final CampsiteRepository campsiteRepository;

    public FavoriteService(UserRepository userRepository, CampsiteRepository campsiteRepository) {
        this.userRepository = userRepository;
        this.campsiteRepository = campsiteRepository;
    }

    public List<Campsite> getFavorites(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return List.of();
        }
        return campsiteRepository.findByIds(userOpt.get().getSavedCampsites());
    }

    public boolean toggleFavorite(String userId, String campsiteId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();
        List<String> savedCampsites = user.getSavedCampsites();

        if (savedCampsites.contains(campsiteId)) {
            savedCampsites.remove(campsiteId);
            userRepository.save(user);
            return false;
        } else {
            savedCampsites.add(campsiteId);
            userRepository.save(user);
            return true;
        }
    }
}
