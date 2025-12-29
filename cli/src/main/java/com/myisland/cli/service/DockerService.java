package com.myisland.cli.service;

import com.myisland.cli.config.CliConfig;
import com.myisland.cli.model.ServiceStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.zeroturnaround.exec.ProcessExecutor;
import org.zeroturnaround.exec.ProcessResult;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

@Service
public class DockerService {

    private static final Logger log = LoggerFactory.getLogger(DockerService.class);
    private final CliConfig config;

    public DockerService(CliConfig config) {
        this.config = config;
    }

    public boolean isDockerAvailable() {
        try {
            ProcessResult result = new ProcessExecutor()
                    .command("docker", "info")
                    .readOutput(true)
                    .execute();
            return result.getExitValue() == 0;
        } catch (Exception e) {
            return false;
        }
    }

    public void startPostgres() throws IOException, InterruptedException, TimeoutException {
        CliConfig.Docker dockerConfig = config.getDocker();

        if (isContainerRunning(dockerConfig.getContainerName())) {
            log.info("PostgreSQL container is already running");
            return;
        }

        if (containerExists(dockerConfig.getContainerName())) {
            log.info("Starting existing PostgreSQL container...");
            new ProcessExecutor()
                    .command("docker", "start", dockerConfig.getContainerName())
                    .redirectOutput(System.out)
                    .execute();
        } else {
            log.info("Creating and starting PostgreSQL container...");
            new ProcessExecutor()
                    .command(
                            "docker", "run",
                            "-d",
                            "--name", dockerConfig.getContainerName(),
                            "-e", "POSTGRES_DB=" + dockerConfig.getDatabase(),
                            "-e", "POSTGRES_USER=" + dockerConfig.getUsername(),
                            "-e", "POSTGRES_PASSWORD=" + dockerConfig.getPassword(),
                            "-p", dockerConfig.getPort() + ":5432",
                            "-v", dockerConfig.getVolumeName() + ":/var/lib/postgresql/data",
                            dockerConfig.getPostgresImage()
                    )
                    .redirectOutput(System.out)
                    .execute();
        }

        waitForPostgres();
    }

    public void stopPostgres() throws IOException, InterruptedException, TimeoutException {
        String containerName = config.getDocker().getContainerName();

        if (!containerExists(containerName)) {
            log.info("PostgreSQL container does not exist");
            return;
        }

        log.info("Stopping PostgreSQL container...");
        new ProcessExecutor()
                .command("docker", "stop", containerName)
                .redirectOutput(System.out)
                .execute();
    }

    public void removePostgres() throws IOException, InterruptedException, TimeoutException {
        String containerName = config.getDocker().getContainerName();

        stopPostgres();

        if (containerExists(containerName)) {
            log.info("Removing PostgreSQL container...");
            new ProcessExecutor()
                    .command("docker", "rm", containerName)
                    .redirectOutput(System.out)
                    .execute();
        }
    }

    public ServiceStatus getPostgresStatus() {
        String containerName = config.getDocker().getContainerName();
        int port = config.getDocker().getPort();

        try {
            if (isContainerRunning(containerName)) {
                return ServiceStatus.builder()
                        .name("PostgreSQL")
                        .status(ServiceStatus.Status.RUNNING)
                        .port(port)
                        .details("Container: " + containerName)
                        .build();
            } else if (containerExists(containerName)) {
                return ServiceStatus.builder()
                        .name("PostgreSQL")
                        .status(ServiceStatus.Status.STOPPED)
                        .port(port)
                        .details("Container exists but stopped")
                        .build();
            } else {
                return ServiceStatus.builder()
                        .name("PostgreSQL")
                        .status(ServiceStatus.Status.STOPPED)
                        .details("No container found")
                        .build();
            }
        } catch (Exception e) {
            return ServiceStatus.builder()
                    .name("PostgreSQL")
                    .status(ServiceStatus.Status.ERROR)
                    .details(e.getMessage())
                    .build();
        }
    }

    private boolean isContainerRunning(String containerName) throws IOException, InterruptedException, TimeoutException {
        ProcessResult result = new ProcessExecutor()
                .command("docker", "ps", "-q", "-f", "name=" + containerName)
                .readOutput(true)
                .execute();
        return !result.outputUTF8().trim().isEmpty();
    }

    private boolean containerExists(String containerName) throws IOException, InterruptedException, TimeoutException {
        ProcessResult result = new ProcessExecutor()
                .command("docker", "ps", "-aq", "-f", "name=" + containerName)
                .readOutput(true)
                .execute();
        return !result.outputUTF8().trim().isEmpty();
    }

    private void waitForPostgres() throws IOException, InterruptedException, TimeoutException {
        log.info("Waiting for PostgreSQL to be ready...");
        int maxAttempts = 30;
        int attempt = 0;

        while (attempt < maxAttempts) {
            ProcessResult result = new ProcessExecutor()
                    .command("docker", "exec", config.getDocker().getContainerName(),
                            "pg_isready", "-U", config.getDocker().getUsername())
                    .readOutput(true)
                    .execute();

            if (result.getExitValue() == 0) {
                log.info("PostgreSQL is ready!");
                return;
            }

            attempt++;
            Thread.sleep(1000);
        }

        throw new RuntimeException("PostgreSQL failed to start within " + maxAttempts + " seconds");
    }

    public void showLogs(int lines) throws IOException, InterruptedException, TimeoutException {
        String containerName = config.getDocker().getContainerName();

        if (!containerExists(containerName)) {
            log.warn("PostgreSQL container does not exist");
            return;
        }

        new ProcessExecutor()
                .command("docker", "logs", "--tail", String.valueOf(lines), containerName)
                .redirectOutput(System.out)
                .execute();
    }

    public void tailLogs() throws IOException, InterruptedException, TimeoutException {
        String containerName = config.getDocker().getContainerName();

        if (!containerExists(containerName)) {
            log.warn("PostgreSQL container does not exist");
            return;
        }

        new ProcessExecutor()
                .command("docker", "logs", "-f", containerName)
                .redirectOutput(System.out)
                .execute();
    }
}
