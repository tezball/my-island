package com.myisland.api.shared.storage;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpServletRequest;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.Map;

@RestController
public class UploadedFileController {

    private static final Map<String, MediaType> EXT_MEDIA_TYPES = Map.of(
            ".jpg", MediaType.IMAGE_JPEG,
            ".jpeg", MediaType.IMAGE_JPEG,
            ".png", MediaType.IMAGE_PNG,
            ".gif", MediaType.IMAGE_GIF,
            ".webp", MediaType.parseMediaType("image/webp")
    );

    private final Path uploadDir;

    public UploadedFileController(ImageUploadService imageUploadService) {
        this.uploadDir = imageUploadService.getUploadDir();
    }

    @GetMapping("/uploads/**")
    public ResponseEntity<Resource> serveFile(HttpServletRequest request) throws MalformedURLException {
        // Extract the subpath after /uploads/
        String fullPath = request.getRequestURI();
        String contextPath = request.getContextPath();
        String subPath = fullPath.substring(contextPath.length() + "/uploads/".length());

        if (subPath.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Path file = uploadDir.resolve(subPath).normalize();

        // Path traversal protection
        if (!file.startsWith(uploadDir)) {
            return ResponseEntity.badRequest().build();
        }

        Resource resource = new UrlResource(file.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        MediaType mediaType = resolveMediaType(subPath);

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .body(resource);
    }

    private MediaType resolveMediaType(String path) {
        String lower = path.toLowerCase();
        for (var entry : EXT_MEDIA_TYPES.entrySet()) {
            if (lower.endsWith(entry.getKey())) {
                return entry.getValue();
            }
        }
        return MediaType.APPLICATION_OCTET_STREAM;
    }
}
