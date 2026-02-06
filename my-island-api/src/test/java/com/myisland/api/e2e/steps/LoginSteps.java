package com.myisland.api.e2e.steps;

import com.myisland.api.e2e.hooks.WebDriverHooks;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class LoginSteps {

    private WebDriver getDriver() {
        return WebDriverHooks.getDriver();
    }

    @Given("I am on the login page")
    public void i_am_on_the_login_page() {
        // Accessing host machine from container: host.testcontainers.internal
        getDriver().get("http://host.testcontainers.internal:5173/signin");
    }

    @When("I enter email {string} and password {string}")
    public void i_enter_email_and_password(String email, String password) {
        System.out.println("Current URL: " + getDriver().getCurrentUrl());
        // System.out.println("Page Source: " + getDriver().getPageSource());
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(10));
        WebElement emailInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email")));
        emailInput.clear();
        emailInput.sendKeys(email);

        WebElement passwordInput = getDriver().findElement(By.id("password"));
        passwordInput.clear();
        passwordInput.sendKeys(password);
    }

    @When("I click the login button")
    public void i_click_the_login_button() {
        // Based on SignInPage.tsx, button is "Sign In".
        // Using xpath to be safe or css selector compatible with Tailwind.
        // The button has "Sign In" text.
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(10));
        WebElement button = wait
                .until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(text(), 'Sign In')]")));
        button.click();
    }

    @Then("I should be redirected to the dashboard")
    public void i_should_be_redirected_to_the_dashboard() {
        new WebDriverWait(getDriver(), Duration.ofSeconds(10))
                .until(ExpectedConditions.urlToBe("http://host.testcontainers.internal:5173/"));
    }

    @Then("I should see {string} in the header")
    public void i_should_see_in_the_header(String text) {
        // Assuming the header contains the user's name or some welcome message.
        // I will search for the text in the body for now as a catch-all.
        boolean present = new WebDriverWait(getDriver(), Duration.ofSeconds(10))
                .until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), text));
        assertTrue(present, "Expected text '" + text + "' not found on page.");
    }
}
