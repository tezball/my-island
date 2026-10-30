plugins {
    kotlin("jvm") version "2.1.10"
    id("io.gatling.gradle") version "3.13.5"
}

dependencies {
    gatling("io.gatling:gatling-core-java:3.13.5")
    gatling("io.gatling:gatling-http-java:3.13.5")
}
