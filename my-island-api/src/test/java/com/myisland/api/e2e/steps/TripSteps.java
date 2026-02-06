package com.myisland.api.e2e.steps;

import com.myisland.api.e2e.hooks.WebDriverHooks;
import io.cucumber.java.en.Then;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class TripSteps {

    private WebDriver getDriver() {
        return WebDriverHooks.getDriver();
    }

    @Then("I should see my bookings listed")
    public void i_should_see_my_bookings_listed() {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(10));
        // Booking cards contain "View Details" buttons
        List<WebElement> bookings = wait.until(driver -> {
            List<WebElement> elements = driver.findElements(
                    By.xpath("//button[contains(normalize-space(), 'View Details')]"));
            return elements.isEmpty() ? null : elements;
        });
        assertFalse(bookings.isEmpty(), "Expected at least one booking card on trips page");
    }

    @Then("I should see a {string} status badge")
    public void i_should_see_a_status_badge(String status) {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(10));
        boolean found = wait.until(ExpectedConditions.textToBePresentInElementLocated(
                By.tagName("body"), status));
        assertTrue(found, "Expected status badge '" + status + "' not found.");
    }
}
