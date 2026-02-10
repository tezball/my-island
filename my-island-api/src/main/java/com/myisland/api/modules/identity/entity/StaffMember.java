package com.myisland.api.modules.identity.entity;

import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.shared.domain.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "staff_members")
public class StaffMember extends BaseEntity {

    @Column(nullable = false)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private Owner owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StaffStatus status = StaffStatus.INVITED;

    public enum StaffStatus {
        INVITED, ACTIVE
    }

    public StaffMember() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Owner getOwner() { return owner; }
    public void setOwner(Owner owner) { this.owner = owner; }

    public Supplier getSupplier() { return supplier; }
    public void setSupplier(Supplier supplier) { this.supplier = supplier; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public StaffStatus getStatus() { return status; }
    public void setStatus(StaffStatus status) { this.status = status; }
}
