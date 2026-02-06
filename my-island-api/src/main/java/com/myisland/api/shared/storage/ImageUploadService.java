package com.myisland.api.shared.storage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.IOException;
import java.time.Duration;
import java.util.Set;
import java.util.UUID;

@Service
public class ImageUploadService {

    private static final Logger log = LoggerFactory.getLogger(ImageUploadService.class);

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp"
    );
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket:myisland-images}")
    private String bucketName;

    @Value("${aws.s3.endpoint:}")
    private String s3Endpoint;

    public ImageUploadService(S3Client s3Client, S3Presigner s3Presigner) {
        this.s3Client = s3Client;
        this.s3Presigner = s3Presigner;
    }

    public ImageUploadResult uploadImage(MultipartFile file, String folder) throws IOException {
        validateFile(file);

        String originalFilename = file.getOriginalFilename();
        String extension = getExtension(originalFilename);
        String key = folder + "/" + UUID.randomUUID() + extension;

        log.info("Uploading image: {} ({} bytes, type={}) to bucket={}, key={}",
                originalFilename, file.getSize(), file.getContentType(), bucketName, key);

        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .build();

        try {
            s3Client.putObject(putRequest, RequestBody.fromBytes(file.getBytes()));
        } catch (Exception e) {
            log.error("S3 upload failed for key={} bucket={} endpoint={}: {}",
                    key, bucketName, s3Endpoint, e.getMessage(), e);
            throw e;
        }

        log.info("Uploaded image: {} to {}", originalFilename, key);

        String url = getPublicUrl(key);

        return new ImageUploadResult(key, url, file.getContentType(), file.getSize());
    }

    public String getPresignedUrl(String key, Duration duration) {
        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(duration)
                .getObjectRequest(b -> b.bucket(bucketName).key(key))
                .build();

        return s3Presigner.presignGetObject(presignRequest).url().toString();
    }

    public void deleteImage(String key) {
        log.info("Deleting image from S3: bucket={}, key={}", bucketName, key);
        DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        try {
            s3Client.deleteObject(deleteRequest);
            log.info("Deleted image: {}", key);
        } catch (Exception e) {
            log.error("S3 delete failed for key={} bucket={}: {}", key, bucketName, e.getMessage(), e);
            throw e;
        }
    }

    public String getPublicUrl(String key) {
        if (s3Endpoint != null && !s3Endpoint.isBlank()) {
            // LocalStack - return localhost URL for browser access
            return "http://localhost:4566/" + bucketName + "/" + key;
        }
        // Production S3
        return "https://" + bucketName + ".s3.amazonaws.com/" + key;
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum limit of 10MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Invalid file type. Allowed: JPEG, PNG, GIF, WebP");
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }

    public record ImageUploadResult(
            String key,
            String url,
            String contentType,
            long size
    ) {}
}
