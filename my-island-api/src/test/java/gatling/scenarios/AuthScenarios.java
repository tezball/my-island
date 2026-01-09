package gatling.scenarios;

import io.gatling.javaapi.core.ChainBuilder;

import static gatling.GatlingConfig.*;
import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

/**
 * Authentication scenarios: signup, login, password reset.
 */
public final class AuthScenarios {

    /**
     * User signup flow - creates a new account.
     */
    public static ChainBuilder signup = exec(
            feed(userFeeder),
            http("Signup - Create Account")
                    .post("/api/auth/register")
                    .body(StringBody("""
                            {
                                "email": "#{email}",
                                "password": "#{password}",
                                "name": "#{name}"
                            }
                            """))
                    .check(status().is(201))
                    .check(jsonPath("$.accessToken").saveAs("accessToken"))
                    .check(jsonPath("$.refreshToken").saveAs("refreshToken"))
                    .check(jsonPath("$.user.id").saveAs("userId"))
    ).pause(MIN_PAUSE, MAX_PAUSE);

    /**
     * User login flow - authenticates existing user.
     */
    public static ChainBuilder loginWithDemoUser = exec(
            http("Login - Demo User")
                    .post("/api/auth/login")
                    .body(StringBody("""
                            {
                                "email": "%s",
                                "password": "%s"
                            }
                            """.formatted(DEMO_USER_EMAIL, DEMO_USER_PASSWORD)))
                    .check(status().is(200))
                    .check(jsonPath("$.accessToken").saveAs("accessToken"))
                    .check(jsonPath("$.refreshToken").saveAs("refreshToken"))
                    .check(jsonPath("$.user.id").saveAs("userId"))
    ).pause(MIN_PAUSE, MAX_PAUSE);

    /**
     * Owner login flow - authenticates as campsite owner.
     */
    public static ChainBuilder loginAsOwner = exec(
            http("Login - Owner")
                    .post("/api/auth/login")
                    .body(StringBody("""
                            {
                                "email": "%s",
                                "password": "%s"
                            }
                            """.formatted(DEMO_OWNER_EMAIL, DEMO_OWNER_PASSWORD)))
                    .check(status().is(200))
                    .check(jsonPath("$.accessToken").saveAs("accessToken"))
                    .check(jsonPath("$.refreshToken").saveAs("refreshToken"))
                    .check(jsonPath("$.user.id").saveAs("userId"))
    ).pause(MIN_PAUSE, MAX_PAUSE);

    /**
     * Login with session credentials (stored in session).
     */
    public static ChainBuilder loginWithSessionCredentials = exec(
            http("Login - Session Credentials")
                    .post("/api/auth/login")
                    .body(StringBody("""
                            {
                                "email": "#{email}",
                                "password": "#{password}"
                            }
                            """))
                    .check(status().is(200))
                    .check(jsonPath("$.accessToken").saveAs("accessToken"))
                    .check(jsonPath("$.refreshToken").saveAs("refreshToken"))
                    .check(jsonPath("$.user.id").saveAs("userId"))
    ).pause(MIN_PAUSE, MAX_PAUSE);

    /**
     * Get current user profile.
     */
    public static ChainBuilder getCurrentUser = exec(
            http("Get Current User")
                    .get("/api/users/me")
                    .header("Authorization", "Bearer #{accessToken}")
                    .check(status().is(200))
                    .check(jsonPath("$.id").exists())
    ).pause(MIN_PAUSE);

    /**
     * Forgot password flow.
     */
    public static ChainBuilder forgotPassword = exec(
            http("Forgot Password")
                    .post("/api/auth/forgot-password")
                    .body(StringBody("""
                            {
                                "email": "#{email}"
                            }
                            """))
                    .check(status().in(200, 404)) // May not find the email
    ).pause(MIN_PAUSE);

    /**
     * Token refresh flow.
     */
    public static ChainBuilder refreshToken = doIf(session -> session.contains("refreshToken")).then(
            exec(
                    http("Refresh Token")
                            .post("/api/auth/refresh")
                            .body(StringBody("""
                                    {
                                        "refreshToken": "#{refreshToken}"
                                    }
                                    """))
                            .check(status().in(200, 401))
                            .check(jsonPath("$.accessToken").optional().saveAs("accessToken"))
            ).pause(MIN_PAUSE)
    );

    private AuthScenarios() {
        // Utility class
    }
}
