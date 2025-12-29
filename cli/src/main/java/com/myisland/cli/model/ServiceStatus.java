package com.myisland.cli.model;

public class ServiceStatus {
    private String name;
    private Status status;
    private String details;
    private Integer port;

    public enum Status {
        RUNNING("Running", "\u001B[32m"),      // Green
        STOPPED("Stopped", "\u001B[31m"),      // Red
        STARTING("Starting", "\u001B[33m"),    // Yellow
        ERROR("Error", "\u001B[31m"),          // Red
        UNKNOWN("Unknown", "\u001B[90m");      // Gray

        private final String label;
        private final String ansiColor;

        Status(String label, String ansiColor) {
            this.label = label;
            this.ansiColor = ansiColor;
        }

        public String getLabel() {
            return label;
        }

        public String colored() {
            return ansiColor + label + "\u001B[0m";
        }
    }

    private ServiceStatus(Builder builder) {
        this.name = builder.name;
        this.status = builder.status;
        this.details = builder.details;
        this.port = builder.port;
    }

    public String getName() { return name; }
    public Status getStatus() { return status; }
    public String getDetails() { return details; }
    public Integer getPort() { return port; }

    public String toDisplayString() {
        String statusStr = status.colored();
        String portStr = port != null ? " (:" + port + ")" : "";
        String detailsStr = details != null && !details.isEmpty() ? " - " + details : "";
        return String.format("%-15s %s%s%s", name + ":", statusStr, portStr, detailsStr);
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String name;
        private Status status;
        private String details;
        private Integer port;

        public Builder name(String name) { this.name = name; return this; }
        public Builder status(Status status) { this.status = status; return this; }
        public Builder details(String details) { this.details = details; return this; }
        public Builder port(Integer port) { this.port = port; return this; }

        public ServiceStatus build() {
            return new ServiceStatus(this);
        }
    }
}
