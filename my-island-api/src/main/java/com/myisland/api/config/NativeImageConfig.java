package com.myisland.api.config;

import org.springframework.aot.hint.MemberCategory;
import org.springframework.aot.hint.RuntimeHints;
import org.springframework.aot.hint.RuntimeHintsRegistrar;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportRuntimeHints;

@Configuration
@ImportRuntimeHints(NativeImageConfig.MyIslandRuntimeHints.class)
public class NativeImageConfig {

    static class MyIslandRuntimeHints implements RuntimeHintsRegistrar {

        @Override
        public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
            registerJjwtHints(hints);
            registerShedLockHints(hints);
            registerFlywayHints(hints);
            registerLoki4jHints(hints, classLoader);
            registerResourceHints(hints);
        }

        private void registerJjwtHints(RuntimeHints hints) {
            // JJWT uses Classes.forName() / Classes.newInstance() for dynamic loading
            // These classes are loaded reflectively from jjwt-api static initializers:
            //   Keys.<clinit> -> Classes.forName("io.jsonwebtoken.impl.security.KeysBridge")
            //   Jwts.builder() -> Classes.newInstance("io.jsonwebtoken.impl.DefaultJwtBuilder")
            //   Jwts.parser()  -> Classes.newInstance("io.jsonwebtoken.impl.DefaultJwtParserBuilder")
            //   Jwts.claims()  -> Classes.newInstance("io.jsonwebtoken.impl.DefaultClaimsBuilder")
            //   Jwts.header()  -> Classes.newInstance("io.jsonwebtoken.impl.DefaultJwtHeaderBuilder")
            String[] jjwtClasses = {
                // Core impl classes loaded via Classes.newInstance()
                "io.jsonwebtoken.impl.DefaultJwtParser",
                "io.jsonwebtoken.impl.DefaultJwtParserBuilder",
                "io.jsonwebtoken.impl.DefaultJwtBuilder",
                "io.jsonwebtoken.impl.DefaultClaimsBuilder",
                "io.jsonwebtoken.impl.DefaultJwtHeaderBuilder",
                "io.jsonwebtoken.impl.DefaultClaims",
                "io.jsonwebtoken.impl.DefaultJwe",
                "io.jsonwebtoken.impl.DefaultProtectedJwt",
                "io.jsonwebtoken.impl.DefaultProtectedHeader",
                // Security — KeysBridge loaded via Classes.forName() from Keys.<clinit>
                "io.jsonwebtoken.impl.security.KeysBridge",
                "io.jsonwebtoken.impl.security.DefaultKeyOperationBuilder",
                "io.jsonwebtoken.impl.security.DefaultMacAlgorithm",
                "io.jsonwebtoken.impl.security.DefaultHashAlgorithm",
                "io.jsonwebtoken.impl.security.DefaultSecretKeyBuilder",
                "io.jsonwebtoken.impl.security.StandardKeyOperations",
                "io.jsonwebtoken.impl.security.StandardSecureDigestAlgorithms",
                "io.jsonwebtoken.impl.security.ConstantKeyLocator",
                "io.jsonwebtoken.impl.security.JwksBridge",
                // Compression — loaded via ServiceLoader
                "io.jsonwebtoken.impl.compression.DeflateCompressionAlgorithm",
                "io.jsonwebtoken.impl.compression.GzipCompressionAlgorithm",
                "io.jsonwebtoken.impl.io.StandardCompressionAlgorithms",
                // Jackson serialization — loaded via ServiceLoader
                "io.jsonwebtoken.jackson.io.JacksonSerializer",
                "io.jsonwebtoken.jackson.io.JacksonDeserializer",
                "io.jsonwebtoken.jackson.io.JacksonSupplierSerializer"
            };
            registerReflectionForClasses(hints, jjwtClasses);

            // JJWT ServiceLoader resources
            hints.resources().registerPattern("META-INF/services/io.jsonwebtoken.*");
        }

        private void registerShedLockHints(RuntimeHints hints) {
            String[] shedLockClasses = {
                "net.javacrumbs.shedlock.provider.jdbctemplate.JdbcTemplateLockProvider",
                "net.javacrumbs.shedlock.provider.jdbctemplate.JdbcTemplateLockProvider$Configuration",
                "net.javacrumbs.shedlock.provider.jdbctemplate.JdbcTemplateLockProvider$Configuration$Builder",
                "net.javacrumbs.shedlock.core.DefaultLockManager",
                "net.javacrumbs.shedlock.core.LockConfiguration",
                "net.javacrumbs.shedlock.core.DefaultLockingTaskExecutor"
            };
            registerReflectionForClasses(hints, shedLockClasses);

            // ShedLock AOP proxy for @SchedulerLock annotation
            hints.proxies().registerJdkProxy(
                net.javacrumbs.shedlock.core.LockProvider.class
            );
        }

        private void registerLoki4jHints(RuntimeHints hints, ClassLoader classLoader) {
            // Only register if Loki4j is on the classpath
            if (!isClassPresent("com.github.loki4j.logback.Loki4jAppender", classLoader)) {
                return;
            }

            String[] loki4jClasses = {
                "com.github.loki4j.logback.Loki4jAppender",
                "com.github.loki4j.logback.JavaHttpSender",
                "com.github.loki4j.logback.JsonEncoder",
                "com.github.loki4j.logback.ProtobufEncoder",
                "com.github.loki4j.logback.LogbackLabelFactory"
            };
            registerReflectionForClasses(hints, loki4jClasses);
        }

        private void registerFlywayHints(RuntimeHints hints) {
            // Flyway uses reflection on ConfigurationExtension subclasses
            String[] flywayClasses = {
                "org.flywaydb.core.internal.publishing.PublishingConfigurationExtension",
                "org.flywaydb.core.internal.proprietaryStubs.AuthCommandExtensionStub",
                "org.flywaydb.core.internal.proprietaryStubs.LicensingConfigurationExtensionStub",
                "org.flywaydb.core.internal.proprietaryStubs.CommandExtensionStub",
                "org.flywaydb.core.internal.proprietaryStubs.PATTokenConfigurationExtensionStub",
                "org.flywaydb.core.internal.configuration.extensions.PrepareScriptFilenameConfigurationExtension",
                "org.flywaydb.core.internal.configuration.extensions.DeployScriptFilenameConfigurationExtension",
                "org.flywaydb.core.internal.command.clean.CleanModeConfigurationExtension",
                "org.flywaydb.core.api.migration.baseline.BaselineMigrationConfigurationExtension",
                "org.flywaydb.core.extensibility.ConfigurationExtension"
            };
            registerReflectionForClasses(hints, flywayClasses);
        }

        private void registerResourceHints(RuntimeHints hints) {
            // Thymeleaf email templates
            hints.resources().registerPattern("templates/*");

            // Flyway migrations and seed data
            hints.resources().registerPattern("db/migration/*");
            hints.resources().registerPattern("db/seed/*");

            // Seed images for dev profile
            hints.resources().registerPattern("seed-images/*");

            // Logback config
            hints.resources().registerPattern("logback-spring.xml");
        }

        private void registerReflectionForClasses(RuntimeHints hints, String[] classNames) {
            for (String className : classNames) {
                try {
                    hints.reflection().registerType(
                        Class.forName(className),
                        MemberCategory.INVOKE_DECLARED_CONSTRUCTORS,
                        MemberCategory.INVOKE_DECLARED_METHODS,
                        MemberCategory.INVOKE_PUBLIC_CONSTRUCTORS,
                        MemberCategory.INVOKE_PUBLIC_METHODS,
                        MemberCategory.DECLARED_FIELDS
                    );
                } catch (ClassNotFoundException e) {
                    // Class not on classpath — skip silently (e.g. optional dependency)
                }
            }
        }

        private boolean isClassPresent(String className, ClassLoader classLoader) {
            try {
                Class.forName(className, false, classLoader);
                return true;
            } catch (ClassNotFoundException e) {
                return false;
            }
        }
    }
}
