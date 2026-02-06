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

import static org.junit.jupiter.api.Assertions.assertTrue;

public class PasswordResetSteps {

    private WebDriver getDriver() {
        return WebDriverHooks.getDriver();
    }

    @When("I enter reset email {string}")
    public void i_enter_reset_email(String email) {
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(10));
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email")));
        input.clear();
        input.sendKeys(email);
    }
}
