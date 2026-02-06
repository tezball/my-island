package com.myisland.api.e2e.steps;

import com.myisland.api.e2e.hooks.WebDriverHooks;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class NavigationSteps {

    static final String BASE_URL = "http://host.testcontainers.internal:5173";

    private static final Map<String, String> PAGE_PATHS = Map.ofEntries(
            Map.entry("home", "/"),
            Map.entry("signup", "/signup"),
            Map.entry("signin", "/signin"),
            Map.entry("forgot-password", "/forgot-password"),
            Map.entry("personalization", "/personalize"),
            Map.entry("offers", "/offers"),
            Map.entry("vouchers", "/vouchers"),
            Map.entry("trips", "/trips"),
            Map.entry("search", "/search"),
            Map.entry("profile", "/profile")
    );

    private WebDriver getDriver() {
        return WebDriverHooks.getDriver();
    }

    @Given("I am on the {string} page")
    public void i_am_on_the_page(String pageName) {
        String path = PAGE_PATHS.getOrDefault(pageName, "/" + pageName);
        getDriver().get(BASE_URL + path);
    }

    @Given("I navigate to {string}")
    public void i_navigate_to(String path) {
        getDriver().get(BASE_URL + path);
    }

    @Then("I should be on the {string} page")
    public void i_should_be_on_the_page(String pageName) {
        String expectedPath = PAGE_PATHS.getOrDefault(pageName, "/" + pageName);
        new WebDriverWait(getDriver(), Duration.ofSeconds(10))
                .until(driver -> driver.getCurrentUrl().contains(expectedPath));
    }

    @Then("the URL should contain {string}")
    public void the_url_should_contain(String text) {
        new WebDriverWait(getDriver(), Duration.ofSeconds(10))
                .until(driver -> driver.getCurrentUrl().contains(text));
    }

    @Then("I should see the text {string}")
    public void i_should_see_the_text(String text) {
        boolean present = new WebDriverWait(getDriver(), Duration.ofSeconds(10))
                .until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), text));
        assertTrue(present, "Expected text '" + text + "' not found on page.");
    }

    @When("I wait for the page to load")
    public void i_wait_for_the_page_to_load() {
        new WebDriverWait(getDriver(), Duration.ofSeconds(10))
                .until(driver -> ((org.openqa.selenium.JavascriptExecutor) driver)
                        .executeScript("return document.readyState").equals("complete"));
        // Additional wait for React to render and API data to load
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    @When("I click the {string} button")
    public void i_click_the_button(String buttonText) {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(10));
        var button = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[contains(normalize-space(), '" + buttonText + "')]")));
        // Use JavaScript click to avoid fixed nav bar intercepting the click
        ((org.openqa.selenium.JavascriptExecutor) getDriver()).executeScript("arguments[0].click();", button);
    }
}
