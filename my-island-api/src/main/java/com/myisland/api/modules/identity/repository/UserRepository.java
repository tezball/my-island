package com.myisland.api.modules.identity.repository;

import com.myisland.api.modules.identity.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByEmailVerificationToken(String token);
    Optional<User> findByPasswordResetToken(String token);

    long countByCreatedAtAfter(LocalDateTime date);

    Page<User> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("""
            SELECT u FROM User u
            WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))
            ORDER BY u.createdAt DESC
            """)
    Page<User> searchByNameOrEmail(String search, Pageable pageable);

    long countByIsOwnerTrue();
    long countByIsSupplierTrue();
    long countByIsActiveTrue();
}
