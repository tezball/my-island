package com.myisland.api.modules.accommodation.entity;

import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.shared.domain.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "saved_lots", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "lot_id"})
})
public class SavedLot extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lot_id", nullable = false)
    private Lot lot;

    public SavedLot() {}

    public SavedLot(User user, Lot lot) {
        this.user = user;
        this.lot = lot;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Lot getLot() {
        return lot;
    }

    public void setLot(Lot lot) {
        this.lot = lot;
    }
}
