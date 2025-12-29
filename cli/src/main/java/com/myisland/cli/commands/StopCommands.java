package com.myisland.cli.commands;

import com.myisland.cli.service.DockerService;
import com.myisland.cli.service.ProcessService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.shell.command.annotation.Command;
import org.springframework.shell.command.annotation.Option;

@Command(group = "Service Lifecycle")
public class StopCommands {

    private static final Logger log = LoggerFactory.getLogger(StopCommands.class);

    private final DockerService dockerService;
    private final ProcessService processService;

    public StopCommands(DockerService dockerService, ProcessService processService) {
        this.dockerService = dockerService;
        this.processService = processService;
    }

    @Command(command = "stop", description = "Stop all services")
    public String stop(
            @Option(longNames = "remove", shortNames = 'r', description = "Also remove Docker containers") boolean remove
    ) {
        StringBuilder result = new StringBuilder();

        try {
            result.append("Stopping Frontend...\n");
            processService.stopFrontend();
            result.append("Frontend stopped.\n\n");

            result.append("Stopping API...\n");
            processService.stopApi();
            result.append("API stopped.\n\n");

            result.append("Stopping PostgreSQL...\n");
            if (remove) {
                dockerService.removePostgres();
                result.append("PostgreSQL stopped and container removed.\n");
            } else {
                dockerService.stopPostgres();
                result.append("PostgreSQL stopped.\n");
            }

            result.append("\nAll services stopped.");

        } catch (Exception e) {
            log.error("Failed to stop services", e);
            result.append("\nError: ").append(e.getMessage());
        }

        return result.toString();
    }

    @Command(command = "stop-db", description = "Stop PostgreSQL database container")
    public String stopDb(
            @Option(longNames = "remove", shortNames = 'r', description = "Also remove the container") boolean remove
    ) {
        try {
            if (remove) {
                dockerService.removePostgres();
                return "PostgreSQL stopped and container removed.";
            } else {
                dockerService.stopPostgres();
                return "PostgreSQL stopped.";
            }
        } catch (Exception e) {
            log.error("Failed to stop PostgreSQL", e);
            return "Error stopping PostgreSQL: " + e.getMessage();
        }
    }

    @Command(command = "stop-api", description = "Stop the API server")
    public String stopApi() {
        try {
            processService.stopApi();
            return "API stopped.";
        } catch (Exception e) {
            log.error("Failed to stop API", e);
            return "Error stopping API: " + e.getMessage();
        }
    }

    @Command(command = "stop-frontend", description = "Stop the frontend development server")
    public String stopFrontend() {
        try {
            processService.stopFrontend();
            return "Frontend stopped.";
        } catch (Exception e) {
            log.error("Failed to stop frontend", e);
            return "Error stopping frontend: " + e.getMessage();
        }
    }
}
