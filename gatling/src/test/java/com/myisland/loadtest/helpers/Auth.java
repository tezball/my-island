package com.myisland.loadtest.helpers;

import io.gatling.javaapi.core.ChainBuilder;

import java.util.Map;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

public final class Auth {

    private Auth() {}

    public static ChainBuilder login(String emailExpr, String passwordExpr) {
        return exec(
            http("Login")
                .post("/auth/login")
                .header("Content-Type", "application/json")
                .body(StringBody("{\"email\":\"" + emailExpr + "\",\"password\":\"" + passwordExpr + "\"}"))
                .check(status().is(200))
                .check(jsonPath("$.token").saveAs("jwtToken"))
        );
    }

    public static ChainBuilder loginFromSession() {
        return exec(
            http("Login")
                .post("/auth/login")
                .header("Content-Type", "application/json")
                .body(StringBody("{\"email\":\"#{email}\",\"password\":\"#{password}\"}"))
                .check(status().is(200))
                .check(jsonPath("$.token").saveAs("jwtToken"))
        );
    }

    public static Map<CharSequence, String> authHeader(String token) {
        return Map.of("Authorization", "Bearer " + token);
    }
}
