package com.myisland.api.shared.storage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;

@Component
@Profile("dev")
public class SeedImageCopier implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(SeedImageCopier.class);

    private final ImageUploadService imageUploadService;

    public SeedImageCopier(ImageUploadService imageUploadService) {
        this.imageUploadService = imageUploadService;
    }

    /**
     * Seed image assignments: maps a classpath source filename to its
     * target path(s) under the upload directory.
     * Format: "source-filename.jpg" -> List of "entityType/entityId/target-filename.jpg"
     */
    private static final Map<String, List<String>> IMAGE_ASSIGNMENTS = Map.ofEntries(
        // Owner 1: Nore Valley Park (4 images)
        Map.entry("nore-valley-hero.jpg",  List.of("owners/1/seed-nore-valley-hero.jpg")),
        Map.entry("nore-valley-woods.jpg", List.of("owners/1/seed-nore-valley-woods.jpg")),
        Map.entry("nore-valley-farm.jpg",  List.of("owners/1/seed-nore-valley-farm.jpg")),
        Map.entry("nore-valley-river.jpg", List.of("owners/1/seed-nore-valley-river.jpg")),

        // Owner 2: Wild Atlantic Glamping
        Map.entry("campsite-coast.jpg",   List.of("owners/2/seed-coast.jpg", "lots/9/seed-coast.jpg")),
        Map.entry("campsite-sunset.jpg",  List.of("owners/2/seed-sunset.jpg")),

        // Owner 3: Lakeside Retreat
        Map.entry("campsite-lake.jpg",    List.of("owners/3/seed-lake.jpg", "lots/15/seed-lake.jpg")),
        Map.entry("campsite-river.jpg",   List.of("owners/3/seed-river.jpg")),

        // Owner 4: Clifden Eco Camp
        Map.entry("campsite-green.jpg",   List.of("owners/4/seed-green.jpg")),
        Map.entry("campsite-mountain.jpg", List.of("owners/4/seed-mountain.jpg", "lots/20/seed-mountain.jpg")),

        // Owner 5: Dingle Peninsula Camping
        Map.entry("campsite-field.jpg",   List.of("owners/5/seed-field.jpg")),
        Map.entry("campsite-hills.jpg",   List.of("owners/5/seed-hills.jpg")),

        // Owner 6-8: additional campsites
        Map.entry("campsite-forest.jpg",  List.of("owners/6/seed-forest.jpg")),
        Map.entry("campsite-meadow.jpg",  List.of("owners/7/seed-meadow.jpg")),
        Map.entry("campsite-trees.jpg",   List.of("owners/8/seed-trees.jpg")),
        Map.entry("campsite-tents.jpg",   List.of("owners/9/seed-tents.jpg")),

        // Lot images (various lot types)
        Map.entry("lot-tent.jpg",     List.of("lots/1/seed-tent.jpg", "lots/2/seed-tent.jpg", "lots/3/seed-tent.jpg")),
        Map.entry("lot-touring.jpg",  List.of("lots/4/seed-touring.jpg", "lots/5/seed-touring.jpg")),
        Map.entry("lot-glamping.jpg", List.of("lots/7/seed-glamping.jpg", "lots/10/seed-glamping.jpg")),
        Map.entry("lot-cabin.jpg",    List.of("lots/8/seed-cabin.jpg")),
        Map.entry("lot-mobile.jpg",   List.of("lots/25/seed-mobile.jpg")),
        Map.entry("lot-pitch.jpg",    List.of("lots/6/seed-pitch.jpg")),

        // Supplier images
        Map.entry("supplier-food.jpg",     List.of("suppliers/1/seed-food.jpg", "suppliers/7/seed-food.jpg")),
        Map.entry("supplier-activity.jpg", List.of("suppliers/2/seed-activity.jpg", "suppliers/3/seed-activity.jpg", "suppliers/5/seed-activity.jpg")),
        Map.entry("supplier-shop.jpg",     List.of("suppliers/10/seed-shop.jpg")),

        // Offer images
        Map.entry("offer-deal.jpg",  List.of("offers/1/seed-deal.jpg", "offers/2/seed-deal.jpg", "offers/52/seed-deal.jpg"))
    );

    @Override
    public void run(String... args) throws Exception {
        Path uploadDir = imageUploadService.getUploadDir();
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();

        int copied = 0;
        for (var entry : IMAGE_ASSIGNMENTS.entrySet()) {
            String sourceFilename = entry.getKey();
            Resource resource;
            try {
                resource = resolver.getResource("classpath:seed-images/" + sourceFilename);
                if (!resource.exists()) {
                    log.warn("Seed image not found: {}", sourceFilename);
                    continue;
                }
            } catch (Exception e) {
                log.warn("Could not load seed image {}: {}", sourceFilename, e.getMessage());
                continue;
            }

            for (String targetPath : entry.getValue()) {
                Path target = uploadDir.resolve(targetPath);
                if (Files.exists(target)) {
                    continue;
                }
                Files.createDirectories(target.getParent());
                Files.copy(resource.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
                copied++;
            }
        }

        if (copied > 0) {
            log.info("Copied {} seed images to {}", copied, uploadDir);
        } else {
            log.info("All seed images already present in {}", uploadDir);
        }
    }
}
