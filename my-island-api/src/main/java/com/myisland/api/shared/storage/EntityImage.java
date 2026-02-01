package com.myisland.api.shared.storage;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "entity_images")
public class EntityImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", nullable = false, length = 50)
    private EntityType entityType;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(name = "s3_key", nullable = false, length = 500)
    private String s3Key;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(length = 255)
    private String filename;

    @Column(name = "content_type", length = 100)
    private String contentType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "is_primary")
    private boolean isPrimary = false;

    @Column(name = "alt_text", length = 255)
    private String altText;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum EntityType {
        LOT, OFFER, SUPPLIER, OWNER, USER
    }

    public EntityImage() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private EntityType entityType;
        private Long entityId;
        private String s3Key;
        private String url;
        private String filename;
        private String contentType;
        private Long fileSize;
        private Integer displayOrder = 0;
        private boolean isPrimary = false;
        private String altText;

        public Builder entityType(EntityType entityType) { this.entityType = entityType; return this; }
        public Builder entityId(Long entityId) { this.entityId = entityId; return this; }
        public Builder s3Key(String s3Key) { this.s3Key = s3Key; return this; }
        public Builder url(String url) { this.url = url; return this; }
        public Builder filename(String filename) { this.filename = filename; return this; }
        public Builder contentType(String contentType) { this.contentType = contentType; return this; }
        public Builder fileSize(Long fileSize) { this.fileSize = fileSize; return this; }
        public Builder displayOrder(Integer displayOrder) { this.displayOrder = displayOrder; return this; }
        public Builder isPrimary(boolean isPrimary) { this.isPrimary = isPrimary; return this; }
        public Builder altText(String altText) { this.altText = altText; return this; }

        public EntityImage build() {
            EntityImage image = new EntityImage();
            image.entityType = this.entityType;
            image.entityId = this.entityId;
            image.s3Key = this.s3Key;
            image.url = this.url;
            image.filename = this.filename;
            image.contentType = this.contentType;
            image.fileSize = this.fileSize;
            image.displayOrder = this.displayOrder;
            image.isPrimary = this.isPrimary;
            image.altText = this.altText;
            return image;
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public EntityType getEntityType() { return entityType; }
    public void setEntityType(EntityType entityType) { this.entityType = entityType; }

    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }

    public String getS3Key() { return s3Key; }
    public void setS3Key(String s3Key) { this.s3Key = s3Key; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public boolean isPrimary() { return isPrimary; }
    public void setPrimary(boolean primary) { isPrimary = primary; }

    public String getAltText() { return altText; }
    public void setAltText(String altText) { this.altText = altText; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
