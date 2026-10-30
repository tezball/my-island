package island

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.flywaydb.core.Flyway
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.utility.DockerImageName
import javax.sql.DataSource

object SharedDatabase {
    val container: PostgreSQLContainer<*> by lazy {
        PostgreSQLContainer(
            DockerImageName.parse("postgis/postgis:17-3.5").asCompatibleSubstituteFor("postgres")
        ).apply {
            withDatabaseName("island")
            withUsername("island")
            withPassword("island")
            start()
        }
    }

    val dataSource: DataSource by lazy {
        val config = HikariConfig()
        config.jdbcUrl = container.jdbcUrl
        config.username = container.username
        config.password = container.password
        config.maximumPoolSize = 10
        val ds = HikariDataSource(config)
        Flyway.configure().dataSource(ds).locations("classpath:db/migration").load().migrate()
        ds
    }
}
