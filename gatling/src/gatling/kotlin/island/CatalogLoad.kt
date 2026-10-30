package island

import io.gatling.javaapi.core.CoreDsl.StringBody
import io.gatling.javaapi.core.CoreDsl.atOnceUsers
import io.gatling.javaapi.core.CoreDsl.global
import io.gatling.javaapi.core.CoreDsl.jsonPath
import io.gatling.javaapi.core.CoreDsl.scenario
import io.gatling.javaapi.core.CoreDsl.substring
import io.gatling.javaapi.core.Simulation
import io.gatling.javaapi.http.HttpDsl.http
import io.gatling.javaapi.http.HttpDsl.status

class CatalogLoad : Simulation() {
    private val base = System.getenv("GATLING_BASE_URL") ?: "http://localhost:8080"
    private val httpProtocol = http.baseUrl(base).acceptHeader("application/json")

    private val catalog = scenario("catalog")
        .exec { session ->
            val n = session.userId()
            session
                .set("hostEmail", "host-%03d@example.com".format(n))
                .set("stayTitle", "Load camp $n")
        }
        .exec(http("places").get("/places").check(status().`is`(200)))
        .exec(http("stays").get("/stays").check(status().`is`(200)))
        .exec(http("experiences").get("/experiences").check(status().`is`(200)))
        .exec(
            http("guest login").post("/sessions")
                .body(StringBody("""{"email":"guest@example.com","password":"guest"}"""))
                .asJson()
                .check(status().`is`(200))
        )
        .exec(http("place id").get("/places").check(jsonPath("$[0].id").saveAs("placeId")))
        .exec(
            http("check off").post("/visits")
                .header("Authorization", "Bearer guest@example.com")
                .body(StringBody("""{"placeId":"#{placeId}"}"""))
                .asJson()
                .check(status().`is`(204))
        )
        .exec(
            http("no public visit count").get("/places")
                .check(status().`is`(200))
                .check(substring("visitCount").notExists())
                .check(substring("visitedCount").notExists())
        )
        .exec(
            http("host login").post("/sessions")
                .body(StringBody("""{"email":"#{hostEmail}","password":"guest"}"""))
                .asJson()
                .check(status().`is`(200))
        )
        .exec(
            http("host edit").post("/host/stays")
                .header("Authorization", "Bearer #{hostEmail}")
                .body(StringBody("""{"kind":"campsite","title":"#{stayTitle}","description":"A pitch","county":"Kerry"}"""))
                .asJson()
                .check(status().`is`(200))
                .check(jsonPath("$.hidden").`is`("true"))
        )
        .exec(
            http("edit stays hidden").get("/stays")
                .check(status().`is`(200))
                .check(substring("#{stayTitle}").notExists())
        )
        .exec(
            http("admin login").post("/sessions")
                .body(StringBody("""{"email":"tezball86@gmail.com","password":"guest"}"""))
                .asJson()
                .check(status().`is`(200))
        )
        .exec(
            http("admin list").get("/admin/listings")
                .header("Authorization", "Bearer tezball86@gmail.com")
                .check(status().`is`(200))
                .check(jsonPath("$[0].id").exists())
        )

    init {
        setUp(catalog.injectOpen(atOnceUsers(100)))
            .protocols(httpProtocol)
            .assertions(global().failedRequests().count().lt(1L))
    }
}
