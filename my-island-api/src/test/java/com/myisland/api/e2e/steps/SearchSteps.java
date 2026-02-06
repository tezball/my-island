package com.myisland.api.e2e.steps;

import com.myisland.api.e2e.hooks.WebDriverHooks;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class SearchSteps {

    private WebDriver getDriver() {
        return WebDriverHooks.getDriver();
    }

    @When("I enter {string} in the search location field")
    public void i_enter_in_the_search_location_field(String location) {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(10));
        // The homepage search has an input with placeholder containing "location" or "where"
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("input[list='county-suggestions'], input[placeholder*='Galway'], input[placeholder*='Cork']")));
        input.clear();
        input.sendKeys(location);
    }

    @When("I click the search button")
    public void i_click_the_search_button() {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(10));
        WebElement button = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[contains(normalize-space(), 'Search')]")));
        button.click();
    }

    @Then("I should see search results")
    public void i_should_see_search_results() {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(15));
        // Wait for result cards to appear - they are div.cursor-pointer.group cards
        wait.until(driver -> {
            List<WebElement> results = driver.findElements(By.cssSelector("div.cursor-pointer.group"));
            return !results.isEmpty() ? results : null;
        });
    }

    @Then("I should see {string} in the results")
    public void i_should_see_in_the_results(String text) {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(10));
        boolean found = wait.until(ExpectedConditions.textToBePresentInElementLocated(
                By.tagName("main"), text));
        assertTrue(found, "Expected '" + text + "' in search results.");
    }
}
