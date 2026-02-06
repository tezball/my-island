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
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class BookingSteps {

    private WebDriver getDriver() {
        return WebDriverHooks.getDriver();
    }

    @When("I click on the first search result")
    public void i_click_on_the_first_search_result() {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(15));
        // Search result cards are div.cursor-pointer with onClick navigating to campsite
        WebElement result = wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector("div.cursor-pointer.group")));
        result.click();
    }

    @When("I click the first available {string} button")
    public void i_click_the_first_available_button(String buttonText) {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(20));
        WebElement button = wait.until(driver -> {
            List<WebElement> buttons = driver.findElements(
                    By.xpath("//button[contains(normalize-space(), '" + buttonText + "') and not(@disabled)]"));
            return buttons.isEmpty() ? null : buttons.get(0);
        });
        // Scroll into view before clicking
        ((org.openqa.selenium.JavascriptExecutor) getDriver())
                .executeScript("arguments[0].scrollIntoView({block: 'center'});", button);
        try { Thread.sleep(300); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        button.click();
    }

    @Then("I should see the booking modal")
    public void i_should_see_the_booking_modal() {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(10));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(
                By.tagName("body"), "Book Your Stay"));
    }

    @When("I select a check-in date {int} days from now")
    public void i_select_a_check_in_date_days_from_now(int daysFromNow) {
        selectCalendarDate(daysFromNow);
    }

    @When("I select a check-out date {int} days from now")
    public void i_select_a_check_out_date_days_from_now(int daysFromNow) {
        selectCalendarDate(daysFromNow);
    }

    private void selectCalendarDate(int daysFromNow) {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(10));
        LocalDate targetDate = LocalDate.now().plusDays(daysFromNow);
        int targetDay = targetDate.getDayOfMonth();
        String targetMonthYear = targetDate.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH)
                + " " + targetDate.getYear();

        // Navigate to the correct month using the chevron_right button
        for (int i = 0; i < 12; i++) {
            // Check current calendar month heading
            WebElement monthHeading = wait.until(ExpectedConditions.visibilityOfElementLocated(
                    By.xpath("//h3[contains(@class, 'font-semibold')]")));
            if (monthHeading.getText().contains(targetMonthYear)) {
                break;
            }
            // Click next month arrow
            WebElement nextButton = getDriver().findElement(
                    By.xpath("//button[.//span[contains(text(), 'chevron_right')]]"));
            nextButton.click();
            // Brief wait for calendar to update
            try { Thread.sleep(300); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        }

        // Click the target day button within the calendar grid
        // Find the grid of day buttons and click the one matching our target day
        WebElement dayButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//div[contains(@class, 'grid-cols-7')]//button[not(@disabled) and normalize-space(text())='" + targetDay + "']")));
        dayButton.click();
    }

    @Then("I should see the payment form")
    public void i_should_see_the_payment_form() {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(15));
        // In dev mode we see "Development Mode", in prod we see "Secure Payment"
        wait.until(driver -> {
            String bodyText = driver.findElement(By.tagName("body")).getText();
            return bodyText.contains("Development Mode") || bodyText.contains("Secure Payment");
        });
    }

    @Then("I should see {string} confirmation")
    public void i_should_see_confirmation(String text) {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(15));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), text));
    }

    @Then("I should see a booking ID")
    public void i_should_see_a_booking_id() {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(10));
        // Booking ID is displayed as "#<id>" in the confirmation
        wait.until(driver -> {
            String bodyText = driver.findElement(By.tagName("body")).getText();
            return bodyText.matches("(?s).*#\\d+.*");
        });
    }
}
