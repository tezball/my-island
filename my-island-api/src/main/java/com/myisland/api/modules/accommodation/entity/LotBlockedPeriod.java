package com.myisland.api.modules.accommodation.entity;

import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.shared.domain.BaseEntity;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "lot_blocked_periods")
public class LotBlockedPeriod extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lot_id", nullable = false)
    private Lot lot;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "reason")
    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    public LotBlockedPeriod() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Lot lot;
        private LocalDate startDate;
        private LocalDate endDate;
        private String reason;
        private User createdBy;

        public Builder lot(Lot lot) { this.lot = lot; return this; }
        public Builder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public Builder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public Builder reason(String reason) { this.reason = reason; return this; }
        public Builder createdBy(User createdBy) { this.createdBy = createdBy; return this; }

        public LotBlockedPeriod build() {
            LotBlockedPeriod bp = new LotBlockedPeriod();
            bp.lot = lot;
            bp.startDate = startDate;
            bp.endDate = endDate;
            bp.reason = reason;
            bp.createdBy = createdBy;
            return bp;
        }
    }

    public Lot getLot() { return lot; }
    public void setLot(Lot lot) { this.lot = lot; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
}
