package com.myisland.cli.commands;

import com.myisland.cli.config.CliConfig;
import com.myisland.cli.config.ProjectPaths;
import com.myisland.cli.service.DockerService;
import com.myisland.cli.service.ProcessService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.shell.command.annotation.Command;
import org.springframework.shell.command.annotation.Option;
import org.zeroturnaround.exec.ProcessExecutor;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;

@Command(group = "Development")
public class DevCommands {

    private static final Logger log = LoggerFactory.getLogger(DevCommands.class);

    private final DockerService dockerService;
    private final ProcessService processService;
    private final ProjectPaths paths;
    private final CliConfig config;

    public DevCommands(DockerService dockerService, ProcessService processService,
                       ProjectPaths paths, CliConfig config) {
        this.dockerService = dockerService;
        this.processService = processService;
        this.paths = paths;
        this.config = config;
    }

    @Command(command = "init-db", description = "Initialize or reset the database")
    public String initDb() {
        try {
            if (!dockerService.isDockerAvailable()) {
                return "Error: Docker is not available.";
            }

            StringBuilder result = new StringBuilder();

            result.append("Removing existing database container...\n");
            dockerService.removePostgres();

            result.append("Starting fresh PostgreSQL container...\n");
            dockerService.startPostgres();

            result.append("\nDatabase initialized successfully.\n");
            result.append("Connection info:\n");
            result.append("  Host:     localhost\n");
            result.append("  Port:     ").append(config.getDocker().getPort()).append("\n");
            result.append("  Database: ").append(config.getDocker().getDatabase()).append("\n");
            result.append("  Username: ").append(config.getDocker().getUsername()).append("\n");
            result.append("  Password: ").append(config.getDocker().getPassword()).append("\n");

            return result.toString();

        } catch (Exception e) {
            log.error("Failed to initialize database", e);
            return "Error initializing database: " + e.getMessage();
        }
    }

    @Command(command = "clean", description = "Clean build artifacts")
    public String clean(
            @Option(longNames = "all", shortNames = 'a', description = "Also clean node_modules") boolean all
    ) {
        try {
            StringBuilder result = new StringBuilder();

            result.append("Cleaning API...\n");
            processService.cleanApi();
            result.append("API cleaned.\n\n");

            result.append("Cleaning Frontend...\n");
            processService.cleanFrontend();
            result.append("Frontend dist/ cleaned.\n");

            if (all) {
                Path nodeModules = paths.getFrontendPath().resolve("node_modules");
                if (Files.exists(nodeModules)) {
                    result.append("\nRemoving node_modules (this may take a while)...\n");
                    new ProcessExecutor()
                            .command("rm", "-rf", nodeModules.toString())
                            .execute();
                    result.append("node_modules removed. Run 'npm install' to reinstall.\n");
                }
            }

            return result.toString();

        } catch (Exception e) {
            log.error("Clean failed", e);
            return "Error during clean: " + e.getMessage();
        }
    }

    @Command(command = "logs", description = "Show logs for a service")
    public String logs(
            @Option(longNames = "service", shortNames = 's', description = "Service name (db, api, frontend)", required = true) String service,
            @Option(longNames = "lines", shortNames = 'n', description = "Number of lines to show", defaultValue = "50") int lines,
            @Option(longNames = "follow", shortNames = 'f', description = "Follow log output") boolean follow
    ) {
        try {
            switch (service.toLowerCase()) {
                case "db":
                case "postgres":
                case "database":
                    if (follow) {
                        dockerService.tailLogs();
                        return "";
                    } else {
                        dockerService.showLogs(lines);
                        return "";
                    }

                case "api":
                case "backend":
                    Path apiLog = paths.getApiPath().resolve("api.log");
                    return showLogFile(apiLog, lines, follow);

                case "frontend":
                case "ui":
                    Path frontendLog = paths.getFrontendPath().resolve("frontend.log");
                    return showLogFile(frontendLog, lines, follow);

                default:
                    return "Unknown service: " + service + "\nAvailable: db, api, frontend";
            }
        } catch (Exception e) {
            log.error("Failed to show logs", e);
            return "Error showing logs: " + e.getMessage();
        }
    }

    @Command(command = "install", description = "Install dependencies for all projects")
    public String install() {
        try {
            StringBuilder result = new StringBuilder();

            result.append("Installing frontend dependencies...\n");
            result.append("═".repeat(50)).append("\n");

            new ProcessExecutor()
                    .command(paths.getNpmCommand(), "install")
                    .directory(paths.getFrontendPath().toFile())
                    .redirectOutput(System.out)
                    .execute();

            result.append("\n✓ Frontend dependencies installed\n\n");

            result.append("Downloading API dependencies...\n");
            result.append("═".repeat(50)).append("\n");

            new ProcessExecutor()
                    .command(paths.getApiMvnw(), "dependency:resolve")
                    .directory(paths.getApiPath().toFile())
                    .redirectOutput(System.out)
                    .execute();

            result.append("\n✓ API dependencies downloaded\n");

            return result.toString();

        } catch (Exception e) {
            log.error("Install failed", e);
            return "Error installing dependencies: " + e.getMessage();
        }
    }

    @Command(command = "psql", description = "Open PostgreSQL shell")
    public String psql() {
        try {
            if (!dockerService.isDockerAvailable()) {
                return "Error: Docker is not available.";
            }

            String containerName = config.getDocker().getContainerName();

            ProcessBuilder pb = new ProcessBuilder(
                    "docker", "exec", "-it", containerName,
                    "psql", "-U", config.getDocker().getUsername(), "-d", config.getDocker().getDatabase()
            );
            pb.inheritIO();
            Process process = pb.start();
            process.waitFor();

            return "";

        } catch (Exception e) {
            log.error("Failed to open psql", e);
            return "Error opening psql: " + e.getMessage() +
                   "\nTry manually: docker exec -it my-island-postgres psql -U postgres -d myisland";
        }
    }

    private String showLogFile(Path logFile, int lines, boolean follow) throws Exception {
        if (!Files.exists(logFile)) {
            return "Log file not found: " + logFile + "\nService may not have been started in background mode.";
        }

        if (follow) {
            ProcessBuilder pb = new ProcessBuilder("tail", "-f", logFile.toString());
            pb.inheritIO();
            Process process = pb.start();
            process.waitFor();
            return "";
        } else {
            ProcessBuilder pb = new ProcessBuilder("tail", "-n", String.valueOf(lines), logFile.toString());
            pb.redirectErrorStream(true);
            Process process = pb.start();

            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }
            process.waitFor();
            return output.toString();
        }
    }
}
