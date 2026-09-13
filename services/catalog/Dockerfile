# Place catalog API (island.catalog). Temurin 21 — not the workspace toolchain image.
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /src
COPY mvnw pom.xml ./
COPY .mvn .mvn
COPY src src
RUN chmod +x mvnw && ./mvnw -B -DskipTests package

FROM eclipse-temurin:21-jre-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=build /src/target/catalog.jar /app/app.jar
ARG GIT_COMMIT=unknown
ARG GIT_COMMIT_SHORT=unknown
ARG GIT_BRANCH=unknown
ARG APP_VERSION=0.0.1-SNAPSHOT
ARG APP_BUILD_TIME=unknown
ENV GIT_COMMIT=$GIT_COMMIT \
    GIT_COMMIT_SHORT=$GIT_COMMIT_SHORT \
    GIT_BRANCH=$GIT_BRANCH \
    APP_VERSION=$APP_VERSION \
    APP_BUILD_TIME=$APP_BUILD_TIME
EXPOSE 8080
USER nobody
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
