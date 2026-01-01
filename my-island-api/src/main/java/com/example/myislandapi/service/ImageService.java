package com.example.myislandapi.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

@Service
public class ImageService {

    private static final Logger log = LoggerFactory.getLogger(ImageService.class);

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.endpoint:}")
    private String awsEndpoint;

    public ImageService(S3Client s3Client, S3Presigner s3Presigner) {
        this.s3Client = s3Client;
        this.s3Presigner = s3Presigner;
    }

    public String uploadImage(MultipartFile file, String folder) throws IOException {
        String fileName = folder + "/" + UUID.randomUUID() + "-" + sanitizeFileName(file.getOriginalFilename());

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));

        log.info("Uploaded image: {} to bucket: {}", fileName, bucketName);

        return getPublicUrl(fileName);
    }

    public String generateUploadUrl(String folder, String fileName, String contentType) {
        String key = folder + "/" + UUID.randomUUID() + "-" + sanitizeFileName(fileName);

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(15))
                .putObjectRequest(objectRequest)
                .build();

        String presignedUrl = s3Presigner.presignPutObject(presignRequest).url().toString();

        log.info("Generated presigned upload URL for key: {}", key);

        return presignedUrl;
    }

    public String generateDownloadUrl(String key) {
        GetObjectRequest objectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofHours(1))
                .getObjectRequest(objectRequest)
                .build();

        return s3Presigner.presignGetObject(presignRequest).url().toString();
    }

    public void deleteImage(String imageUrl) {
        String key = extractKeyFromUrl(imageUrl);
        if (key == null) {
            log.warn("Could not extract key from URL: {}", imageUrl);
            return;
        }

        DeleteObjectRequest request = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        s3Client.deleteObject(request);
        log.info("Deleted image: {} from bucket: {}", key, bucketName);
    }

    private String getPublicUrl(String key) {
        if (awsEndpoint != null && !awsEndpoint.isBlank()) {
            return awsEndpoint + "/" + bucketName + "/" + key;
        }
        return "https://" + bucketName + ".s3.amazonaws.com/" + key;
    }

    private String extractKeyFromUrl(String url) {
        if (url == null) return null;

        // Handle LocalStack URLs: http://localhost:4566/bucket/key
        if (url.contains("localhost:4566")) {
            int bucketStart = url.indexOf(bucketName);
            if (bucketStart >= 0) {
                return url.substring(bucketStart + bucketName.length() + 1);
            }
        }

        // Handle S3 URLs: https://bucket.s3.amazonaws.com/key
        if (url.contains(".s3.amazonaws.com/")) {
            return url.substring(url.indexOf(".s3.amazonaws.com/") + 18);
        }

        return null;
    }

    private String sanitizeFileName(String fileName) {
        if (fileName == null) return "unnamed";
        return fileName.replaceAll("[^a-zA-Z0-9.-]", "_");
    }
}
