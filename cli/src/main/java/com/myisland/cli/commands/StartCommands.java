package com.myisland.cli.commands;

import com.myisland.cli.service.DockerService;
import com.myisland.cli.service.ProcessService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.shell.command.annotation.Command;
import org.springframework.shell.command.annotation.Option;

@Command(group = "Service Lifecycle")
public class StartCommands {

    private static final Logger log = LoggerFactory.getLogger(StartCommands.class);

    private final DockerService dockerService;
    private final ProcessService processService;

    public StartCommands(DockerService dockerService, ProcessService processService) {
        this.dockerService = dockerService;
        this.processService = processService;
    }

    @Command(command = "start", description = "Start all services (database, API, frontend)")
    public String start(
            @Option(longNames = "background", shortNames = 'b', description = "Run in background") boolean background
    ) {
        StringBuilder result = new StringBuilder();

        try {
            if (!dockerService.isDockerAvailable()) {
                return "Error: Docker is not available. Please ensure Docker is installed and running.";
            }

            result.append("Starting PostgreSQL...\n");
            dockerService.startPostgres();
            result.append("PostgreSQL started.\n\n");

            result.append("Starting API...\n");
            processService.startApiBackground();
            result.append("API starting...\n\n");

            result.append("Starting Frontend...\n");
            processService.startFrontendBackground();
            result.append("Frontend starting...\n\n");

            result.append("All services started. Use 'status' to check their state.");

        } catch (Exception e) {
            log.error("Failed to start services", e);
            result.append("\nError: ").append(e.getMessage());
        }

        return result.toString();
    }

    @Command(command = "start-db", description = "Start PostgreSQL database container")
    public String startDb() {
        try {
            if (!dockerService.isDockerAvailable()) {
                return "Error: Docker is not available. Please ensure Docker is installed and running.";
            }

            dockerService.startPostgres();
            return "PostgreSQL started successfully.";
        } catch (Exception e) {
            log.error("Failed to start PostgreSQL", e);
            return "Error starting PostgreSQL: " + e.getMessage();
        }
    }

    @Command(command = "start-api", description = "Start the Spring Boot API server")
    public String startApi(
            @Option(longNames = "background", shortNames = 'b', description = "Run in background") boolean background
    ) {
        try {
            if (background) {
                processService.startApiBackground();
                return "API started in background. Check logs with 'logs -s api'.";
            } else {
                processService.startApi();
                return "API started.";
            }
        } catch (Exception e) {
            log.error("Failed to start API", e);
            return "Error starting API: " + e.getMessage();
        }
    }

    @Command(command = "start-frontend", description = "Start the Vite development server")
    public String startFrontend(
            @Option(longNames = "background", shortNames = 'b', description = "Run in background") boolean background
    ) {
        try {
            if (background) {
                processService.startFrontendBackground();
                return "Frontend started in background. Check logs with 'logs -s frontend'.";
            } else {
                processService.startFrontend();
                return "Frontend started.";
            }
        } catch (Exception e) {
            log.error("Failed to start frontend", e);
            return "Error starting frontend: " + e.getMessage();
        }
    }
}
