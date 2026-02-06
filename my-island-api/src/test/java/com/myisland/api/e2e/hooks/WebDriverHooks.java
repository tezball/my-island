package com.myisland.api.e2e.hooks;

import io.cucumber.java.After;
import io.cucumber.java.AfterAll;
import io.cucumber.java.Before;
import io.cucumber.java.BeforeAll;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testcontainers.Testcontainers;
import org.testcontainers.containers.BrowserWebDriverContainer;
import org.testcontainers.containers.VncRecordingContainer;
import java.io.File;

public class WebDriverHooks {

    private static BrowserWebDriverContainer<?> chrome;
    private static RemoteWebDriver driver;

    @BeforeAll
    public static void setupContainer() {
        if (chrome == null) {
            org.testcontainers.Testcontainers.exposeHostPorts(5173);
            chrome = new BrowserWebDriverContainer<>()
                    .withCapabilities(new ChromeOptions())
                    .withRecordingMode(BrowserWebDriverContainer.VncRecordingMode.RECORD_FAILING,
                            new File("./target/selenium-recordings"));
            chrome.start();
        }
    }

    @Before
    public void setupDriver() {
        if (driver == null || driver.getSessionId() == null) {
            driver = new RemoteWebDriver(chrome.getSeleniumAddress(), new ChromeOptions());
        }
    }

    @After
    public void tearDown() {
        // We can either quit driver here or keep it. For strict isolation, quit.
        if (driver != null) {
            driver.quit();
            driver = null;
        }
    }

    @AfterAll
    public static void tearDownContainer() {
        if (chrome != null) {
            chrome.stop();
            chrome = null;
        }
    }

    public static RemoteWebDriver getDriver() {
        if (driver == null) {
            // In case setupDriver didn't run or got cleared?
            // Should not happen if strictly following cucumber lifecycle
            throw new IllegalStateException("Driver is not initialized");
        }
        return driver;
    }
}
