package com.myisland.api.shared.storage;

import com.myisland.api.modules.accommodation.entity.Lot;
import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.LotRepository;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.identity.service.AccessLevel;
import com.myisland.api.modules.identity.service.PermissionGroup;
import com.myisland.api.modules.identity.service.StaffPermissionChecker;
import com.myisland.api.modules.marketplace.entity.Offer;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.marketplace.repository.OfferRepository;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
import com.myisland.api.security.CustomUserDetails;
import com.myisland.api.shared.exceptions.ForbiddenException;
import com.myisland.api.shared.exceptions.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/images")
@Tag(name = "Images", description = "Image upload and management")
public class ImageUploadController {

    private static final Logger log = LoggerFactory.getLogger(ImageUploadController.class);

    private final EntityImageService entityImageService;
    private final EntityImageRepository entityImageRepository;
    private final StaffPermissionChecker staffPermissionChecker;
    private final LotRepository lotRepository;
    private final OfferRepository offerRepository;
    private final OwnerRepository ownerRepository;
    private final SupplierRepository supplierRepository;

    public ImageUploadController(EntityImageService entityImageService,
                                 EntityImageRepository entityImageRepository,
                                 StaffPermissionChecker staffPermissionChecker,
                                 LotRepository lotRepository,
                                 OfferRepository offerRepository,
                                 OwnerRepository ownerRepository,
                                 SupplierRepository supplierRepository) {
        this.entityImageService = entityImageService;
        this.entityImageRepository = entityImageRepository;
        this.staffPermissionChecker = staffPermissionChecker;
        this.lotRepository = lotRepository;
        this.offerRepository = offerRepository;
        this.ownerRepository = ownerRepository;
        this.supplierRepository = supplierRepository;
    }

    @PostMapping(value = "/{entityType}/{entityId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload image for entity", description = "Upload an image and attach it to an entity (lot, offer, supplier, etc.)")
    public ResponseEntity<EntityImageDto> uploadImage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String entityType,
            @PathVariable Long entityId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "primary", defaultValue = "false") boolean setAsPrimary,
            @RequestParam(value = "altText", required = false) String altText
    ) throws IOException {
        log.debug("Upload request: entityType={}, entityId={}, file={}, size={}, contentType={}, primary={}",
                entityType, entityId, file.getOriginalFilename(), file.getSize(), file.getContentType(), setAsPrimary);

        EntityImage.EntityType type = parseEntityType(entityType);
        verifyOwnership(userDetails, type, entityId);
        EntityImage image = entityImageService.uploadImage(type, entityId, file, setAsPrimary, altText);

        log.debug("Upload complete: imageId={}, url={}", image.getId(), image.getUrl());
        return ResponseEntity.ok(toDto(image));
    }

    @GetMapping("/{entityType}/{entityId}")
    @Operation(summary = "Get images for entity", description = "Get all images for an entity, ordered by display order")
    public ResponseEntity<List<EntityImageDto>> getImages(
            @PathVariable String entityType,
            @PathVariable Long entityId
    ) {
        EntityImage.EntityType type = parseEntityType(entityType);
        List<EntityImage> images = entityImageService.getImages(type, entityId);

        return ResponseEntity.ok(images.stream().map(this::toDto).toList());
    }

    @GetMapping("/{entityType}/{entityId}/primary")
    @Operation(summary = "Get primary image", description = "Get the primary/hero image for an entity")
    public ResponseEntity<EntityImageDto> getPrimaryImage(
            @PathVariable String entityType,
            @PathVariable Long entityId
    ) {
        EntityImage.EntityType type = parseEntityType(entityType);
        EntityImage image = entityImageService.getPrimaryImage(type, entityId);

        if (image == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(toDto(image));
    }

    @PatchMapping("/{imageId}/primary")
    @Operation(summary = "Set as primary", description = "Set an image as the primary/hero image for its entity")
    public ResponseEntity<EntityImageDto> setPrimaryImage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long imageId
    ) {
        verifyImageOwnership(userDetails, imageId);
        EntityImage image = entityImageService.setPrimaryImage(imageId);
        return ResponseEntity.ok(toDto(image));
    }

    @PatchMapping("/{imageId}/order")
    @Operation(summary = "Update display order", description = "Update the display order of an image")
    public ResponseEntity<Map<String, String>> updateOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long imageId,
            @RequestBody UpdateOrderRequest request
    ) {
        verifyImageOwnership(userDetails, imageId);
        entityImageService.updateImageOrder(imageId, request.order());
        return ResponseEntity.ok(Map.of("message", "Order updated"));
    }

    @PatchMapping("/{imageId}/alt")
    @Operation(summary = "Update alt text", description = "Update the alt text of an image")
    public ResponseEntity<EntityImageDto> updateAltText(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long imageId,
            @RequestBody UpdateAltTextRequest request
    ) {
        verifyImageOwnership(userDetails, imageId);
        EntityImage image = entityImageService.updateAltText(imageId, request.altText());
        return ResponseEntity.ok(toDto(image));
    }

    @DeleteMapping("/{imageId}")
    @Operation(summary = "Delete image", description = "Delete an image from S3 and the database")
    public ResponseEntity<Map<String, String>> deleteImage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long imageId
    ) {
        verifyImageOwnership(userDetails, imageId);
        log.debug("Deleting image {}", imageId);
        entityImageService.deleteImage(imageId);
        return ResponseEntity.ok(Map.of("message", "Image deleted"));
    }

    private void verifyImageOwnership(CustomUserDetails userDetails, Long imageId) {
        EntityImage image = entityImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image", imageId));
        verifyOwnership(userDetails, image.getEntityType(), image.getEntityId());
    }

    private void verifyOwnership(CustomUserDetails userDetails, EntityImage.EntityType entityType, Long entityId) {
        // Admins bypass all ownership checks
        if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            return;
        }

        Long userId = userDetails.getUserId();

        switch (entityType) {
            case LOT -> {
                Lot lot = lotRepository.findById(entityId)
                        .orElseThrow(() -> new ResourceNotFoundException("Lot", entityId));
                staffPermissionChecker.checkOwnerPermission(userId, lot.getOwner(),
                        PermissionGroup.LOTS, AccessLevel.FULL);
            }
            case OFFER -> {
                Offer offer = offerRepository.findById(entityId)
                        .orElseThrow(() -> new ResourceNotFoundException("Offer", entityId));
                staffPermissionChecker.checkSupplierPermission(userId, offer.getSupplier(),
                        PermissionGroup.OFFERS, AccessLevel.FULL);
            }
            case OWNER -> {
                Owner owner = ownerRepository.findById(entityId)
                        .orElseThrow(() -> new ResourceNotFoundException("Owner", entityId));
                staffPermissionChecker.checkOwnerPermission(userId, owner,
                        PermissionGroup.PROPERTY, AccessLevel.FULL);
            }
            case SUPPLIER -> {
                Supplier supplier = supplierRepository.findById(entityId)
                        .orElseThrow(() -> new ResourceNotFoundException("Supplier", entityId));
                staffPermissionChecker.checkSupplierPermission(userId, supplier,
                        PermissionGroup.PROFILE, AccessLevel.FULL);
            }
            case USER -> {
                if (!userId.equals(entityId)) {
                    throw new ForbiddenException("You can only manage your own images");
                }
            }
        }
    }

    private EntityImage.EntityType parseEntityType(String entityType) {
        try {
            return EntityImage.EntityType.valueOf(entityType.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid entity type: " + entityType +
                    ". Valid types: LOT, OFFER, SUPPLIER, OWNER, USER");
        }
    }

    private EntityImageDto toDto(EntityImage image) {
        return new EntityImageDto(
                image.getId(),
                image.getEntityType().name(),
                image.getEntityId(),
                image.getS3Key(),
                image.getUrl(),
                image.getFilename(),
                image.getContentType(),
                image.getFileSize(),
                image.getDisplayOrder(),
                image.isPrimary(),
                image.getAltText()
        );
    }

    public record EntityImageDto(
            Long id,
            String entityType,
            Long entityId,
            String s3Key,
            String url,
            String filename,
            String contentType,
            Long fileSize,
            Integer displayOrder,
            boolean isPrimary,
            String altText
    ) {}

    public record UpdateOrderRequest(int order) {}
    public record UpdateAltTextRequest(String altText) {}
}
