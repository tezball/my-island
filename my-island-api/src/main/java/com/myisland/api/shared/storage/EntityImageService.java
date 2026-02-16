package com.myisland.api.shared.storage;

import com.myisland.api.shared.exceptions.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EntityImageService {

    private static final Logger log = LoggerFactory.getLogger(EntityImageService.class);

    private final EntityImageRepository imageRepository;
    private final ImageUploadService uploadService;

    public EntityImageService(EntityImageRepository imageRepository, ImageUploadService uploadService) {
        this.imageRepository = imageRepository;
        this.uploadService = uploadService;
    }

    /**
     * Upload and attach an image to an entity
     */
    @Transactional
    public EntityImage uploadImage(
            EntityImage.EntityType entityType,
            Long entityId,
            MultipartFile file,
            boolean setAsPrimary,
            String altText
    ) throws IOException {
        log.debug("Starting image upload for {} {} (file={}, size={}, primary={})",
                entityType, entityId, file.getOriginalFilename(), file.getSize(), setAsPrimary);

        // Determine folder based on entity type
        String folder = entityType.name().toLowerCase() + "s";

        // Upload to S3
        ImageUploadService.ImageUploadResult result = uploadService.uploadImage(file, folder);

        // Get next display order
        int displayOrder = imageRepository.findMaxDisplayOrder(entityType, entityId)
                .map(max -> max + 1)
                .orElse(0);

        // If this is the first image or setAsPrimary, clear existing primary
        boolean isPrimary = setAsPrimary || displayOrder == 0;
        if (isPrimary) {
            imageRepository.clearPrimaryForEntity(entityType, entityId);
        }

        // Create and save entity image record
        EntityImage image = EntityImage.builder()
                .entityType(entityType)
                .entityId(entityId)
                .s3Key(result.key())
                .url(result.url())
                .filename(file.getOriginalFilename())
                .contentType(result.contentType())
                .fileSize(result.size())
                .displayOrder(displayOrder)
                .isPrimary(isPrimary)
                .altText(altText)
                .build();

        image = imageRepository.save(image);
        log.debug("Uploaded image {} for {} {}", image.getId(), entityType, entityId);

        return image;
    }

    /**
     * Get all images for an entity
     */
    public List<EntityImage> getImages(EntityImage.EntityType entityType, Long entityId) {
        return imageRepository.findByEntityTypeAndEntityIdOrderByDisplayOrderAsc(entityType, entityId);
    }

    /**
     * Get primary image for an entity
     */
    public EntityImage getPrimaryImage(EntityImage.EntityType entityType, Long entityId) {
        return imageRepository.findByEntityTypeAndEntityIdAndIsPrimaryTrue(entityType, entityId)
                .orElse(null);
    }

    /**
     * Get images for multiple entities (batch load for listings)
     */
    public Map<Long, List<EntityImage>> getImagesForEntities(
            EntityImage.EntityType entityType,
            List<Long> entityIds
    ) {
        return imageRepository.findByEntityTypeAndEntityIdIn(entityType, entityIds)
                .stream()
                .collect(Collectors.groupingBy(EntityImage::getEntityId));
    }

    /**
     * Set an image as primary
     */
    @Transactional
    public EntityImage setPrimaryImage(Long imageId) {
        EntityImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found: " + imageId));

        // Clear existing primary for this entity
        imageRepository.clearPrimaryForEntity(image.getEntityType(), image.getEntityId());

        // Set this one as primary
        image.setPrimary(true);
        image = imageRepository.save(image);

        log.debug("Set image {} as primary for {} {}", imageId, image.getEntityType(), image.getEntityId());
        return image;
    }

    /**
     * Update image order
     */
    @Transactional
    public void updateImageOrder(Long imageId, int newOrder) {
        EntityImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found: " + imageId));

        image.setDisplayOrder(newOrder);
        imageRepository.save(image);

        log.debug("Updated image {} order to {}", imageId, newOrder);
    }

    /**
     * Update image alt text
     */
    @Transactional
    public EntityImage updateAltText(Long imageId, String altText) {
        EntityImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found: " + imageId));

        image.setAltText(altText);
        return imageRepository.save(image);
    }

    /**
     * Delete an image
     */
    @Transactional
    public void deleteImage(Long imageId) {
        EntityImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found: " + imageId));

        // Delete from S3
        uploadService.deleteImage(image.getS3Key());

        // If this was primary, set next image as primary
        if (image.isPrimary()) {
            List<EntityImage> remaining = imageRepository
                    .findByEntityTypeAndEntityIdOrderByDisplayOrderAsc(image.getEntityType(), image.getEntityId())
                    .stream()
                    .filter(i -> !i.getId().equals(imageId))
                    .toList();

            if (!remaining.isEmpty()) {
                remaining.get(0).setPrimary(true);
                imageRepository.save(remaining.get(0));
            }
        }

        // Delete record
        imageRepository.delete(image);
        log.debug("Deleted image {} for {} {}", imageId, image.getEntityType(), image.getEntityId());
    }

    /**
     * Delete all images for an entity
     */
    @Transactional
    public void deleteAllImages(EntityImage.EntityType entityType, Long entityId) {
        List<EntityImage> images = imageRepository
                .findByEntityTypeAndEntityIdOrderByDisplayOrderAsc(entityType, entityId);

        // Delete from S3
        for (EntityImage image : images) {
            try {
                uploadService.deleteImage(image.getS3Key());
            } catch (Exception e) {
                log.warn("Failed to delete S3 object {}: {}", image.getS3Key(), e.getMessage());
            }
        }

        // Delete all records
        imageRepository.deleteAllByEntity(entityType, entityId);
        log.debug("Deleted all {} images for {} {}", images.size(), entityType, entityId);
    }
}
