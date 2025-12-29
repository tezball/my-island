package com.myisland.cli.service;

import com.myisland.cli.config.CliConfig;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ClassicHttpResponse;
import org.apache.hc.core5.util.Timeout;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.Socket;

@Service
public class HealthCheckService {

    private static final Logger log = LoggerFactory.getLogger(HealthCheckService.class);
    private final CliConfig config;

    public HealthCheckService(CliConfig config) {
        this.config = config;
    }

    public boolean isApiHealthy() {
        return checkHttpEndpoint(config.getApi().getHealthEndpoint()) ||
               isPortOpen("localhost", config.getApi().getPort());
    }

    public boolean isFrontendHealthy() {
        return checkHttpEndpoint(config.getFrontend().getHealthEndpoint()) ||
               isPortOpen("localhost", config.getFrontend().getPort());
    }

    public boolean isPostgresHealthy() {
        return isPortOpen("localhost", config.getDocker().getPort());
    }

    private boolean checkHttpEndpoint(String url) {
        RequestConfig requestConfig = RequestConfig.custom()
                .setConnectTimeout(Timeout.ofSeconds(2))
                .setResponseTimeout(Timeout.ofSeconds(2))
                .build();

        try (CloseableHttpClient client = HttpClients.custom()
                .setDefaultRequestConfig(requestConfig)
                .build()) {

            HttpGet request = new HttpGet(url);
            ClassicHttpResponse response = client.execute(request, r -> r);
            int statusCode = response.getCode();
            return statusCode >= 200 && statusCode < 400;
        } catch (Exception e) {
            log.debug("Health check failed for {}: {}", url, e.getMessage());
            return false;
        }
    }

    private boolean isPortOpen(String host, int port) {
        try (Socket socket = new Socket()) {
            socket.connect(new java.net.InetSocketAddress(host, port), 1000);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
