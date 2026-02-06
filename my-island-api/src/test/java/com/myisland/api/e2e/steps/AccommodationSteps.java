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

public class AccommodationSteps {

    private WebDriver getDriver() {
        return WebDriverHooks.getDriver();
    }

    @When("I click on the first featured campsite")
    public void i_click_on_the_first_featured_campsite() {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(15));
        // Campsite cards have "flex flex-col gap-2 cursor-pointer group"
        // (distinguishing from trending destination cards which have "rounded-xl overflow-hidden")
        WebElement campsiteCard = wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector("div.flex.flex-col.gap-2.cursor-pointer.group")));
        campsiteCard.click();
    }

    @Then("I should see the campsite name in the page header")
    public void i_should_see_the_campsite_name_in_the_page_header() {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(15));
        WebElement header = wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("h1")));
        assertFalse(header.getText().isBlank(), "Campsite name header should not be empty");
    }

    @Then("I should see the {string} section")
    public void i_should_see_the_section(String sectionText) {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(20));
        // Search for a heading element (h1-h3) containing the section text
        WebElement heading = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//h1[contains(text(), '" + sectionText + "')] | //h2[contains(text(), '" + sectionText + "')] | //h3[contains(text(), '" + sectionText + "')]")));
        assertTrue(heading.isDisplayed(), "Expected section '" + sectionText + "' not found on page.");
    }

    @Then("I should see accommodation options listed")
    public void i_should_see_accommodation_options_listed() {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(20));
        // Accommodation options have "Book Now" or "Fully Booked" buttons
        List<WebElement> options = wait.until(driver -> {
            List<WebElement> elements = driver.findElements(
                    By.xpath("//button[contains(text(), 'Book Now') or contains(text(), 'Fully Booked') or contains(text(), 'Contact Us')]"));
            return elements.isEmpty() ? null : elements;
        });
        assertFalse(options.isEmpty(), "Expected accommodation options to be listed");
    }

    @Then("I should see at least one {string} button")
    public void i_should_see_at_least_one_button(String buttonText) {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(20));
        List<WebElement> buttons = wait.until(driver -> {
            List<WebElement> elements = driver.findElements(
                    By.xpath("//button[contains(normalize-space(), '" + buttonText + "')]"));
            return elements.isEmpty() ? null : elements;
        });
        assertTrue(buttons.size() >= 1,
                "Expected at least one '" + buttonText + "' button, found " + buttons.size());
    }
}
