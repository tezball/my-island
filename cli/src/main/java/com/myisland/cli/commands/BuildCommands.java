package com.myisland.cli.commands;

import com.myisland.cli.service.ProcessService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.shell.command.annotation.Command;
import org.zeroturnaround.exec.ProcessResult;

@Command(group = "Build")
public class BuildCommands {

    private static final Logger log = LoggerFactory.getLogger(BuildCommands.class);

    private final ProcessService processService;

    public BuildCommands(ProcessService processService) {
        this.processService = processService;
    }

    @Command(command = "build", description = "Build all projects (API and Frontend)")
    public String build() {
        StringBuilder result = new StringBuilder();

        try {
            result.append("Building API...\n");
            result.append("═".repeat(50)).append("\n");
            ProcessResult apiResult = processService.buildApi();
            if (apiResult.getExitValue() == 0) {
                result.append("\n✓ API build successful\n\n");
            } else {
                result.append("\n✗ API build failed (exit code: ").append(apiResult.getExitValue()).append(")\n\n");
            }

            result.append("Building Frontend...\n");
            result.append("═".repeat(50)).append("\n");
            ProcessResult frontendResult = processService.buildFrontend();
            if (frontendResult.getExitValue() == 0) {
                result.append("\n✓ Frontend build successful\n");
            } else {
                result.append("\n✗ Frontend build failed (exit code: ").append(frontendResult.getExitValue()).append(")\n");
            }

            result.append("\n").append("═".repeat(50)).append("\n");
            result.append("Build Summary:\n");
            result.append("  API:      ").append(apiResult.getExitValue() == 0 ? "✓ Success" : "✗ Failed").append("\n");
            result.append("  Frontend: ").append(frontendResult.getExitValue() == 0 ? "✓ Success" : "✗ Failed").append("\n");

        } catch (Exception e) {
            log.error("Build failed", e);
            result.append("\nError: ").append(e.getMessage());
        }

        return result.toString();
    }

    @Command(command = "build-api", description = "Build the Spring Boot API")
    public String buildApi() {
        try {
            ProcessResult result = processService.buildApi();
            if (result.getExitValue() == 0) {
                return "\n✓ API build successful";
            } else {
                return "\n✗ API build failed (exit code: " + result.getExitValue() + ")";
            }
        } catch (Exception e) {
            log.error("API build failed", e);
            return "Error building API: " + e.getMessage();
        }
    }

    @Command(command = "build-frontend", description = "Build the React frontend")
    public String buildFrontend() {
        try {
            ProcessResult result = processService.buildFrontend();
            if (result.getExitValue() == 0) {
                return "\n✓ Frontend build successful";
            } else {
                return "\n✗ Frontend build failed (exit code: " + result.getExitValue() + ")";
            }
        } catch (Exception e) {
            log.error("Frontend build failed", e);
            return "Error building frontend: " + e.getMessage();
        }
    }
}
