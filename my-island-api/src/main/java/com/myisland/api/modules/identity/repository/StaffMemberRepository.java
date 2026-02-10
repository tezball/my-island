package com.myisland.api.modules.identity.repository;

import com.myisland.api.modules.identity.entity.StaffMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffMemberRepository extends JpaRepository<StaffMember, Long> {

    List<StaffMember> findByOwnerId(Long ownerId);

    List<StaffMember> findBySupplierId(Long supplierId);

    List<StaffMember> findByEmail(String email);

    List<StaffMember> findByUserId(Long userId);

    Optional<StaffMember> findByOwnerIdAndEmail(Long ownerId, String email);

    Optional<StaffMember> findBySupplierIdAndEmail(Long supplierId, String email);
}
