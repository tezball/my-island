package com.example.myislandapi.controller;

import com.example.myislandapi.dto.request.PresignedUrlRequest;
import com.example.myislandapi.dto.response.ImageUploadResponse;
import com.example.myislandapi.dto.response.PresignedUrlResponse;
import com.example.myislandapi.service.ImageService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageUploadResponse> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().build();
        }

        String url = imageService.uploadImage(file, folder);
        return ResponseEntity.ok(new ImageUploadResponse(url, file.getOriginalFilename(), file.getSize()));
    }

    @PostMapping("/presigned-url")
    public ResponseEntity<PresignedUrlResponse> getPresignedUploadUrl(
            @RequestBody PresignedUrlRequest request) {

        String uploadUrl = imageService.generateUploadUrl(
                request.folder(),
                request.fileName(),
                request.contentType()
        );

        return ResponseEntity.ok(new PresignedUrlResponse(uploadUrl, request.fileName()));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteImage(@RequestParam String url) {
        imageService.deleteImage(url);
        return ResponseEntity.noContent().build();
    }
}
