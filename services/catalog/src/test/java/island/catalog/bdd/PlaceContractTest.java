package island.catalog.bdd;

import static io.cucumber.junit.platform.engine.Constants.GLUE_PROPERTY_NAME;
import static io.cucumber.junit.platform.engine.Constants.PLUGIN_PROPERTY_NAME;

import org.junit.platform.suite.api.ConfigurationParameter;
import org.junit.platform.suite.api.IncludeEngines;
import org.junit.platform.suite.api.SelectClasspathResource;
import org.junit.platform.suite.api.Suite;

/** Surefire entrypoint so `mvnw test` runs Gherkin on Testcontainers. */
@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("features")
@ConfigurationParameter(key = GLUE_PROPERTY_NAME, value = "island.catalog.bdd")
@ConfigurationParameter(key = PLUGIN_PROPERTY_NAME, value = "pretty")
class PlaceContractTest {}
