package com.example.myislandapi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.ses.SesClient;

import java.net.URI;

@Configuration
public class AwsConfig {

    @Value("${aws.region}")
    private String awsRegion;

    @Value("${aws.endpoint:}")
    private String awsEndpoint;

    @Bean
    public S3Client s3Client() {
        var builder = S3Client.builder()
                .region(Region.of(awsRegion))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create("localstack", "localstack")
                ));

        if (awsEndpoint != null && !awsEndpoint.isBlank()) {
            builder.endpointOverride(URI.create(awsEndpoint))
                   .forcePathStyle(true);
        }

        return builder.build();
    }

    @Bean
    public S3Presigner s3Presigner() {
        var builder = S3Presigner.builder()
                .region(Region.of(awsRegion))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create("localstack", "localstack")
                ));

        if (awsEndpoint != null && !awsEndpoint.isBlank()) {
            builder.endpointOverride(URI.create(awsEndpoint));
        }

        return builder.build();
    }

    @Bean
    public SesClient sesClient() {
        var builder = SesClient.builder()
                .region(Region.of(awsRegion))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create("localstack", "localstack")
                ));

        if (awsEndpoint != null && !awsEndpoint.isBlank()) {
            builder.endpointOverride(URI.create(awsEndpoint));
        }

        return builder.build();
    }
}
