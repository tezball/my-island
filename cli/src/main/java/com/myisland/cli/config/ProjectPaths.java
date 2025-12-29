package com.myisland.cli.config;

import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class ProjectPaths {

    private final Path projectRoot;

    public ProjectPaths() {
        // CLI is in cli/ subdirectory, so parent is project root
        Path cliPath = Paths.get(System.getProperty("user.dir"));
        if (cliPath.getFileName().toString().equals("cli")) {
            this.projectRoot = cliPath.getParent();
        } else {
            // Running from project root or other location
            this.projectRoot = cliPath;
        }
    }

    public Path getProjectRoot() {
        return projectRoot;
    }

    public Path getApiPath() {
        return projectRoot.resolve("my-island-api");
    }

    public Path getFrontendPath() {
        return projectRoot;
    }

    public Path getCliPath() {
        return projectRoot.resolve("cli");
    }

    public String getApiMvnw() {
        return getApiPath().resolve("mvnw").toString();
    }

    public String getNpmCommand() {
        return "npm";
    }
}
