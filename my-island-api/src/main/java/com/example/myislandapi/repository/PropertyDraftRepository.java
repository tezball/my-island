package com.example.myislandapi.repository;

import com.example.myislandapi.entity.PropertyDraft;
import com.example.myislandapi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PropertyDraftRepository extends JpaRepository<PropertyDraft, UUID> {

    /**
     * Find the draft for a specific owner.
     * Each owner can have at most one active draft.
     */
    Optional<PropertyDraft> findByOwner(User owner);

    /**
     * Find draft by owner ID.
     */
    Optional<PropertyDraft> findByOwnerId(UUID ownerId);

    /**
     * Delete all drafts for an owner.
     */
    void deleteByOwner(User owner);

    /**
     * Delete draft by owner ID.
     */
    void deleteByOwnerId(UUID ownerId);

    /**
     * Check if an owner has an existing draft.
     */
    boolean existsByOwnerId(UUID ownerId);
}
