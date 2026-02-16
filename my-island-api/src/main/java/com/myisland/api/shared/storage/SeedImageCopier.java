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

@Component
@Profile("dev")
public class SeedImageCopier implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(SeedImageCopier.class);

    private final ImageUploadService imageUploadService;

    public SeedImageCopier(ImageUploadService imageUploadService) {
        this.imageUploadService = imageUploadService;
    }

    @Override
    public void run(String... args) throws Exception {
        Path uploadDir = imageUploadService.getUploadDir();
        // Seed images belong to Owner ID 1 (Nore Valley Park)
        Path ownersDir = uploadDir.resolve("owners/1");
        Files.createDirectories(ownersDir);

        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] resources;
        try {
            resources = resolver.getResources("classpath:seed-images/*.jpg");
        } catch (IOException e) {
            log.warn("No seed images found on classpath: {}", e.getMessage());
            return;
        }

        int copied = 0;
        for (Resource resource : resources) {
            String filename = resource.getFilename();
            if (filename == null) continue;

            Path target = ownersDir.resolve("seed-" + filename);
            if (Files.exists(target)) {
                log.debug("Seed image already exists, skipping: {}", target);
                continue;
            }

            Files.copy(resource.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            copied++;
            log.debug("Copied seed image: {}", target);
        }

        if (copied > 0) {
            log.info("Copied {} seed images to {}", copied, ownersDir);
        } else {
            log.info("All seed images already present in {}", ownersDir);
        }
    }
}
