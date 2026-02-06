package com.myisland.api.e2e.steps;

import com.myisland.api.e2e.hooks.WebDriverHooks;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static com.myisland.api.e2e.steps.NavigationSteps.BASE_URL;

public class AuthSteps {

    private WebDriver getDriver() {
        return WebDriverHooks.getDriver();
    }

    @Given("I am logged in as {string}")
    public void i_am_logged_in_as(String email) {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(10));

        getDriver().get(BASE_URL + "/signin");

        WebElement emailInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email")));
        emailInput.clear();
        emailInput.sendKeys(email);

        WebElement passwordInput = getDriver().findElement(By.id("password"));
        passwordInput.clear();
        passwordInput.sendKeys("password");

        WebElement loginButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[contains(text(), 'Sign In')]")));
        loginButton.click();

        // Wait for redirect to home page (successful login)
        wait.until(ExpectedConditions.urlToBe(BASE_URL + "/"));
    }

    @Given("I am logged in as guest")
    public void i_am_logged_in_as_guest() {
        i_am_logged_in_as("family@example.com");
    }

    @When("I enter full name {string}")
    public void i_enter_full_name(String name) {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(10));
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("fullname")));
        input.clear();
        input.sendKeys(name);
    }

    @When("I enter signup email with a unique address")
    public void i_enter_signup_email_with_a_unique_address() {
        String uniqueEmail = "testuser" + System.currentTimeMillis() + "@test.com";
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(10));
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email")));
        input.clear();
        input.sendKeys(uniqueEmail);
    }

    @When("I enter signup password {string}")
    public void i_enter_signup_password(String password) {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(10));
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("password")));
        input.clear();
        input.sendKeys(password);
    }

    @Then("I should be on the personalization page")
    public void i_should_be_on_the_personalization_page() {
        new WebDriverWait(getDriver(), Duration.ofSeconds(10))
                .until(ExpectedConditions.urlContains("/personalize"));
    }
}
