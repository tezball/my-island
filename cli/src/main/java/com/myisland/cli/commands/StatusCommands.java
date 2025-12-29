package com.myisland.cli.commands;

import com.myisland.cli.model.ServiceStatus;
import com.myisland.cli.service.DockerService;
import com.myisland.cli.service.ProcessService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.shell.command.annotation.Command;

@Command(group = "Service Lifecycle")
public class StatusCommands {

    private static final Logger log = LoggerFactory.getLogger(StatusCommands.class);

    private final DockerService dockerService;
    private final ProcessService processService;

    public StatusCommands(DockerService dockerService, ProcessService processService) {
        this.dockerService = dockerService;
        this.processService = processService;
    }

    @Command(command = "status", description = "Show status of all services")
    public String status() {
        StringBuilder result = new StringBuilder();
        result.append("\n");
        result.append("╔══════════════════════════════════════════════════════╗\n");
        result.append("║              my-island Service Status                ║\n");
        result.append("╠══════════════════════════════════════════════════════╣\n");

        boolean dockerAvailable = dockerService.isDockerAvailable();
        result.append("║ Docker: ");
        if (dockerAvailable) {
            result.append("\u001B[32mAvailable\u001B[0m");
            result.append("                                      ║\n");
        } else {
            result.append("\u001B[31mNot Available\u001B[0m");
            result.append("                                  ║\n");
        }

        result.append("╠══════════════════════════════════════════════════════╣\n");

        ServiceStatus pgStatus = dockerService.getPostgresStatus();
        result.append("║ ").append(formatStatus(pgStatus)).append(" ║\n");

        ServiceStatus apiStatus = processService.getApiStatus();
        result.append("║ ").append(formatStatus(apiStatus)).append(" ║\n");

        ServiceStatus frontendStatus = processService.getFrontendStatus();
        result.append("║ ").append(formatStatus(frontendStatus)).append(" ║\n");

        result.append("╚══════════════════════════════════════════════════════╝\n");

        result.append("\nURLs:\n");
        if (frontendStatus.getStatus() == ServiceStatus.Status.RUNNING) {
            result.append("  Frontend: http://localhost:").append(frontendStatus.getPort()).append("\n");
        }
        if (apiStatus.getStatus() == ServiceStatus.Status.RUNNING) {
            result.append("  API:      http://localhost:").append(apiStatus.getPort()).append("\n");
        }

        return result.toString();
    }

    private String formatStatus(ServiceStatus status) {
        String name = String.format("%-12s", status.getName());
        String state = status.getStatus().colored();
        String port = status.getPort() != null ? ":" + status.getPort() : "";
        String details = status.getDetails() != null ? " " + status.getDetails() : "";

        String content = name + state + port + details;
        int visibleLength = name.length() + status.getStatus().getLabel().length() + port.length() + details.length();
        int padding = 52 - visibleLength;

        return content + " ".repeat(Math.max(0, padding));
    }
}
