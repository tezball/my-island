package com.myisland.cli.commands;

import com.myisland.cli.service.ProcessService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.shell.command.annotation.Command;
import org.zeroturnaround.exec.ProcessResult;

@Command(group = "Testing")
public class TestCommands {

    private static final Logger log = LoggerFactory.getLogger(TestCommands.class);

    private final ProcessService processService;

    public TestCommands(ProcessService processService) {
        this.processService = processService;
    }

    @Command(command = "test", description = "Run all tests (API and Frontend)")
    public String test() {
        StringBuilder result = new StringBuilder();

        try {
            result.append("Running API tests...\n");
            result.append("═".repeat(50)).append("\n");
            ProcessResult apiResult = processService.testApi();
            if (apiResult.getExitValue() == 0) {
                result.append("\n✓ API tests passed\n\n");
            } else {
                result.append("\n✗ API tests failed (exit code: ").append(apiResult.getExitValue()).append(")\n\n");
            }

            result.append("Running Frontend tests...\n");
            result.append("═".repeat(50)).append("\n");
            ProcessResult frontendResult = processService.testFrontend();
            if (frontendResult.getExitValue() == 0) {
                result.append("\n✓ Frontend tests passed\n");
            } else {
                result.append("\n✗ Frontend tests failed (exit code: ").append(frontendResult.getExitValue()).append(")\n");
            }

            result.append("\n").append("═".repeat(50)).append("\n");
            result.append("Test Summary:\n");
            result.append("  API:      ").append(apiResult.getExitValue() == 0 ? "✓ Passed" : "✗ Failed").append("\n");
            result.append("  Frontend: ").append(frontendResult.getExitValue() == 0 ? "✓ Passed" : "✗ Failed").append("\n");

        } catch (Exception e) {
            log.error("Tests failed", e);
            result.append("\nError: ").append(e.getMessage());
        }

        return result.toString();
    }

    @Command(command = "test-api", description = "Run API tests")
    public String testApi() {
        try {
            ProcessResult result = processService.testApi();
            if (result.getExitValue() == 0) {
                return "\n✓ API tests passed";
            } else {
                return "\n✗ API tests failed (exit code: " + result.getExitValue() + ")";
            }
        } catch (Exception e) {
            log.error("API tests failed", e);
            return "Error running API tests: " + e.getMessage();
        }
    }

    @Command(command = "test-frontend", description = "Run Frontend tests")
    public String testFrontend() {
        try {
            ProcessResult result = processService.testFrontend();
            if (result.getExitValue() == 0) {
                return "\n✓ Frontend tests passed";
            } else {
                return "\n✗ Frontend tests failed (exit code: " + result.getExitValue() + ")";
            }
        } catch (Exception e) {
            log.error("Frontend tests failed", e);
            return "Error running frontend tests: " + e.getMessage();
        }
    }
}
