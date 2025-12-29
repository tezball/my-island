package com.myisland.cli.service;

import com.myisland.cli.config.CliConfig;
import com.myisland.cli.config.ProjectPaths;
import com.myisland.cli.model.ServiceStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.zeroturnaround.exec.ProcessExecutor;
import org.zeroturnaround.exec.ProcessResult;
import org.zeroturnaround.exec.StartedProcess;
import org.zeroturnaround.exec.stream.LogOutputStream;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeoutException;

@Service
public class ProcessService {

    private static final Logger log = LoggerFactory.getLogger(ProcessService.class);

    private final ProjectPaths paths;
    private final CliConfig config;
    private final HealthCheckService healthCheck;

    private static final String API_PID_FILE = ".api.pid";
    private static final String FRONTEND_PID_FILE = ".frontend.pid";

    public ProcessService(ProjectPaths paths, CliConfig config, HealthCheckService healthCheck) {
        this.paths = paths;
        this.config = config;
        this.healthCheck = healthCheck;
    }

    public void startApi() throws IOException, InterruptedException, TimeoutException {
        if (isApiRunning()) {
            log.info("API is already running");
            return;
        }

        log.info("Starting Spring Boot API...");
        Path apiPath = paths.getApiPath();

        File mvnw = apiPath.resolve("mvnw").toFile();
        if (mvnw.exists()) {
            mvnw.setExecutable(true);
        }

        StartedProcess process = new ProcessExecutor()
                .command(paths.getApiMvnw(), "spring-boot:run")
                .directory(apiPath.toFile())
                .redirectOutput(new LogOutputStream() {
                    @Override
                    protected void processLine(String line) {
                        System.out.println("[API] " + line);
                    }
                })
                .start();

        savePid(API_PID_FILE, process.getProcess().pid());
        log.info("API started with PID: {}", process.getProcess().pid());

        waitForApi();
    }

    public void startApiBackground() throws IOException, InterruptedException, TimeoutException {
        if (isApiRunning()) {
            log.info("API is already running");
            return;
        }

        log.info("Starting Spring Boot API in background...");
        Path apiPath = paths.getApiPath();

        File mvnw = apiPath.resolve("mvnw").toFile();
        if (mvnw.exists()) {
            mvnw.setExecutable(true);
        }

        ProcessBuilder pb = new ProcessBuilder(paths.getApiMvnw(), "spring-boot:run")
                .directory(apiPath.toFile())
                .redirectOutput(apiPath.resolve("api.log").toFile())
                .redirectErrorStream(true);

        Process process = pb.start();
        savePid(API_PID_FILE, process.pid());
        log.info("API started in background with PID: {}", process.pid());
    }

    public void stopApi() throws IOException {
        Long pid = readPid(API_PID_FILE);
        if (pid == null) {
            log.info("No API process found");
            return;
        }

        log.info("Stopping API (PID: {})...", pid);
        killProcessTree(pid);
        deletePid(API_PID_FILE);
        log.info("API stopped");
    }

    public void startFrontend() throws IOException, InterruptedException, TimeoutException {
        if (isFrontendRunning()) {
            log.info("Frontend is already running");
            return;
        }

        log.info("Starting Vite dev server...");
        Path frontendPath = paths.getFrontendPath();

        StartedProcess process = new ProcessExecutor()
                .command(paths.getNpmCommand(), "run", "dev")
                .directory(frontendPath.toFile())
                .redirectOutput(new LogOutputStream() {
                    @Override
                    protected void processLine(String line) {
                        System.out.println("[Frontend] " + line);
                    }
                })
                .start();

        savePid(FRONTEND_PID_FILE, process.getProcess().pid());
        log.info("Frontend started with PID: {}", process.getProcess().pid());
    }

    public void startFrontendBackground() throws IOException {
        if (isFrontendRunning()) {
            log.info("Frontend is already running");
            return;
        }

        log.info("Starting Vite dev server in background...");
        Path frontendPath = paths.getFrontendPath();

        ProcessBuilder pb = new ProcessBuilder(paths.getNpmCommand(), "run", "dev")
                .directory(frontendPath.toFile())
                .redirectOutput(frontendPath.resolve("frontend.log").toFile())
                .redirectErrorStream(true);

        Process process = pb.start();
        savePid(FRONTEND_PID_FILE, process.pid());
        log.info("Frontend started in background with PID: {}", process.pid());
    }

    public void stopFrontend() throws IOException {
        Long pid = readPid(FRONTEND_PID_FILE);
        if (pid == null) {
            log.info("No frontend process found");
            return;
        }

        log.info("Stopping Frontend (PID: {})...", pid);
        killProcessTree(pid);
        deletePid(FRONTEND_PID_FILE);
        log.info("Frontend stopped");
    }

    public ServiceStatus getApiStatus() {
        int port = config.getApi().getPort();
        Long pid = readPid(API_PID_FILE);

        if (pid != null && isProcessRunning(pid)) {
            if (healthCheck.isApiHealthy()) {
                return ServiceStatus.builder()
                        .name("API")
                        .status(ServiceStatus.Status.RUNNING)
                        .port(port)
                        .details("PID: " + pid)
                        .build();
            } else {
                return ServiceStatus.builder()
                        .name("API")
                        .status(ServiceStatus.Status.STARTING)
                        .port(port)
                        .details("Process running, waiting for health check")
                        .build();
            }
        }

        if (healthCheck.isApiHealthy()) {
            return ServiceStatus.builder()
                    .name("API")
                    .status(ServiceStatus.Status.RUNNING)
                    .port(port)
                    .details("External process")
                    .build();
        }

        return ServiceStatus.builder()
                .name("API")
                .status(ServiceStatus.Status.STOPPED)
                .port(port)
                .build();
    }

    public ServiceStatus getFrontendStatus() {
        int port = config.getFrontend().getPort();
        Long pid = readPid(FRONTEND_PID_FILE);

        if (pid != null && isProcessRunning(pid)) {
            if (healthCheck.isFrontendHealthy()) {
                return ServiceStatus.builder()
                        .name("Frontend")
                        .status(ServiceStatus.Status.RUNNING)
                        .port(port)
                        .details("PID: " + pid)
                        .build();
            } else {
                return ServiceStatus.builder()
                        .name("Frontend")
                        .status(ServiceStatus.Status.STARTING)
                        .port(port)
                        .details("Process running, waiting for server")
                        .build();
            }
        }

        if (healthCheck.isFrontendHealthy()) {
            return ServiceStatus.builder()
                    .name("Frontend")
                    .status(ServiceStatus.Status.RUNNING)
                    .port(port)
                    .details("External process")
                    .build();
        }

        return ServiceStatus.builder()
                .name("Frontend")
                .status(ServiceStatus.Status.STOPPED)
                .port(port)
                .build();
    }

    public ProcessResult buildApi() throws IOException, InterruptedException, TimeoutException {
        log.info("Building API...");
        Path apiPath = paths.getApiPath();

        File mvnw = apiPath.resolve("mvnw").toFile();
        if (mvnw.exists()) {
            mvnw.setExecutable(true);
        }

        return new ProcessExecutor()
                .command(paths.getApiMvnw(), "clean", "package", "-DskipTests")
                .directory(apiPath.toFile())
                .redirectOutput(System.out)
                .execute();
    }

    public ProcessResult buildFrontend() throws IOException, InterruptedException, TimeoutException {
        log.info("Building Frontend...");
        return new ProcessExecutor()
                .command(paths.getNpmCommand(), "run", "build")
                .directory(paths.getFrontendPath().toFile())
                .redirectOutput(System.out)
                .execute();
    }

    public ProcessResult testApi() throws IOException, InterruptedException, TimeoutException {
        log.info("Running API tests...");
        Path apiPath = paths.getApiPath();

        File mvnw = apiPath.resolve("mvnw").toFile();
        if (mvnw.exists()) {
            mvnw.setExecutable(true);
        }

        return new ProcessExecutor()
                .command(paths.getApiMvnw(), "test")
                .directory(apiPath.toFile())
                .redirectOutput(System.out)
                .execute();
    }

    public ProcessResult testFrontend() throws IOException, InterruptedException, TimeoutException {
        log.info("Running Frontend tests...");
        return new ProcessExecutor()
                .command(paths.getNpmCommand(), "test")
                .directory(paths.getFrontendPath().toFile())
                .redirectOutput(System.out)
                .execute();
    }

    public void cleanApi() throws IOException, InterruptedException, TimeoutException {
        log.info("Cleaning API build artifacts...");
        Path apiPath = paths.getApiPath();

        File mvnw = apiPath.resolve("mvnw").toFile();
        if (mvnw.exists()) {
            mvnw.setExecutable(true);
        }

        new ProcessExecutor()
                .command(paths.getApiMvnw(), "clean")
                .directory(apiPath.toFile())
                .redirectOutput(System.out)
                .execute();
    }

    public void cleanFrontend() throws IOException, InterruptedException, TimeoutException {
        log.info("Cleaning Frontend build artifacts...");
        Path distPath = paths.getFrontendPath().resolve("dist");
        if (Files.exists(distPath)) {
            new ProcessExecutor()
                    .command("rm", "-rf", distPath.toString())
                    .execute();
            log.info("Removed dist/ directory");
        }

        Path nodeModulesPath = paths.getFrontendPath().resolve("node_modules");
        if (Files.exists(nodeModulesPath)) {
            log.info("To clean node_modules, run: rm -rf node_modules && npm install");
        }
    }

    private boolean isApiRunning() {
        Long pid = readPid(API_PID_FILE);
        return pid != null && isProcessRunning(pid);
    }

    private boolean isFrontendRunning() {
        Long pid = readPid(FRONTEND_PID_FILE);
        return pid != null && isProcessRunning(pid);
    }

    private void waitForApi() throws InterruptedException {
        log.info("Waiting for API to be ready...");
        int maxAttempts = 60;
        int attempt = 0;

        while (attempt < maxAttempts) {
            if (healthCheck.isApiHealthy()) {
                log.info("API is ready!");
                return;
            }
            attempt++;
            Thread.sleep(2000);
        }

        log.warn("API health check timeout - server may still be starting");
    }

    private void savePid(String filename, long pid) throws IOException {
        Path pidFile = paths.getCliPath().resolve(filename);
        Files.writeString(pidFile, String.valueOf(pid));
    }

    private Long readPid(String filename) {
        try {
            Path pidFile = paths.getCliPath().resolve(filename);
            if (Files.exists(pidFile)) {
                String content = Files.readString(pidFile).trim();
                return Long.parseLong(content);
            }
        } catch (Exception e) {
            log.debug("Failed to read PID file: {}", e.getMessage());
        }
        return null;
    }

    private void deletePid(String filename) throws IOException {
        Path pidFile = paths.getCliPath().resolve(filename);
        Files.deleteIfExists(pidFile);
    }

    private boolean isProcessRunning(long pid) {
        try {
            ProcessResult result = new ProcessExecutor()
                    .command("kill", "-0", String.valueOf(pid))
                    .readOutput(true)
                    .execute();
            return result.getExitValue() == 0;
        } catch (Exception e) {
            return false;
        }
    }

    private void killProcessTree(long pid) {
        try {
            new ProcessExecutor()
                    .command("pkill", "-P", String.valueOf(pid))
                    .execute();
            new ProcessExecutor()
                    .command("kill", String.valueOf(pid))
                    .execute();
        } catch (Exception e) {
            log.debug("Error killing process: {}", e.getMessage());
        }
    }
}
