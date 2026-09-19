package island.catalog.auth;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableConfigurationProperties({CatalogImportProperties.class, CatalogAuthProperties.class})
public class SecurityConfig {

  private final ImportKeyFilter importKeyFilter;

  public SecurityConfig(ImportKeyFilter importKeyFilter) {
    this.importKeyFilter = importKeyFilter;
  }

  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .exceptionHandling(
            ex ->
                ex.authenticationEntryPoint(
                        (request, response, authException) ->
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED))
                    .accessDeniedHandler(
                        (request, response, accessDeniedException) ->
                            response.sendError(HttpServletResponse.SC_FORBIDDEN)))
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
        .addFilterBefore(importKeyFilter, UsernamePasswordAuthenticationFilter.class)
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers("/actuator/**")
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/auth/google")
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/auth/login")
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/auth/logout")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/v1/places/**")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/v1/categories")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/v1/counties")
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/v1/places")
                    .hasRole("IMPORT")
                    .requestMatchers(HttpMethod.PUT, "/api/v1/places/**")
                    .denyAll()
                    .requestMatchers(HttpMethod.PATCH, "/api/v1/places/**")
                    .denyAll()
                    .requestMatchers(HttpMethod.DELETE, "/api/v1/places/**")
                    .denyAll()
                    .requestMatchers("/api/v1/me", "/api/v1/me/**")
                    .authenticated()
                    .anyRequest()
                    .permitAll());
    return http.build();
  }
}
