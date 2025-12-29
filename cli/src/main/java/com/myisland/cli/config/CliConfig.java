package com.myisland.cli.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "myisland")
public class CliConfig {

    private Docker docker = new Docker();
    private Api api = new Api();
    private Frontend frontend = new Frontend();

    public Docker getDocker() { return docker; }
    public void setDocker(Docker docker) { this.docker = docker; }
    public Api getApi() { return api; }
    public void setApi(Api api) { this.api = api; }
    public Frontend getFrontend() { return frontend; }
    public void setFrontend(Frontend frontend) { this.frontend = frontend; }

    public static class Docker {
        private String postgresImage = "postgres:15-alpine";
        private String containerName = "my-island-postgres";
        private String volumeName = "my-island-pgdata";
        private int port = 5432;
        private String database = "myisland";
        private String username = "postgres";
        private String password = "postgres";

        public String getPostgresImage() { return postgresImage; }
        public void setPostgresImage(String postgresImage) { this.postgresImage = postgresImage; }
        public String getContainerName() { return containerName; }
        public void setContainerName(String containerName) { this.containerName = containerName; }
        public String getVolumeName() { return volumeName; }
        public void setVolumeName(String volumeName) { this.volumeName = volumeName; }
        public int getPort() { return port; }
        public void setPort(int port) { this.port = port; }
        public String getDatabase() { return database; }
        public void setDatabase(String database) { this.database = database; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class Api {
        private int port = 8080;
        private String healthEndpoint = "http://localhost:8080/actuator/health";

        public int getPort() { return port; }
        public void setPort(int port) { this.port = port; }
        public String getHealthEndpoint() { return healthEndpoint; }
        public void setHealthEndpoint(String healthEndpoint) { this.healthEndpoint = healthEndpoint; }
    }

    public static class Frontend {
        private int port = 5173;
        private String healthEndpoint = "http://localhost:5173";

        public int getPort() { return port; }
        public void setPort(int port) { this.port = port; }
        public String getHealthEndpoint() { return healthEndpoint; }
        public void setHealthEndpoint(String healthEndpoint) { this.healthEndpoint = healthEndpoint; }
    }
}
