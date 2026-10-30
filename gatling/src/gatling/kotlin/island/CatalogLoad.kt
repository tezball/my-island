package island

import io.gatling.javaapi.core.CoreDsl.StringBody
import io.gatling.javaapi.core.CoreDsl.atOnceUsers
import io.gatling.javaapi.core.CoreDsl.jsonPath
import io.gatling.javaapi.core.CoreDsl.scenario
import io.gatling.javaapi.core.Simulation
import io.gatling.javaapi.http.HttpDsl.http
import io.gatling.javaapi.http.HttpDsl.status

class CatalogLoad : Simulation() {
    private val base = System.getenv("GATLING_BASE_URL") ?: "http://localhost:8080"
    private val httpProtocol = http.baseUrl(base).acceptHeader("application/json")

    private val browse = scenario("browse")
        .exec(http("places").get("/places").check(status().`is`(200)))
        .exec(http("stays").get("/stays").check(status().`is`(200)))
        .exec(http("experiences").get("/experiences").check(status().`is`(200)))
        .exec(http("home").get("/").check(status().`is`(200)))

    private val checkOff = scenario("check-off")
        .exec(
            http("login").post("/sessions")
                .body(StringBody("""{"email":"guest@example.com","password":"guest"}"""))
                .asJson()
                .check(status().`is`(200))
        )
        .exec(http("place id").get("/places").check(jsonPath("$[0].id").saveAs("placeId")))
        .exec(
            http("visit").post("/visits")
                .header("Authorization", "Bearer guest@example.com")
                .body(StringBody("""{"placeId":"#{placeId}"}"""))
                .asJson()
                .check(status().`is`(204))
        )

    private val hostEdit = scenario("host edit")
        .exec(
            http("new stay").post("/host/stays")
                .header("Authorization", "Bearer host-001@example.com")
                .body(StringBody("""{"kind":"campsite","title":"Load camp","description":"A pitch","county":"Kerry"}"""))
                .asJson()
                .check(status().`is`(200))
        )

    private val admin = scenario("admin")
        .exec(
            http("admin list").get("/admin/listings")
                .header("Authorization", "Bearer tezball86@gmail.com")
                .check(status().`is`(200))
        )

    init {
        setUp(
            browse.injectOpen(atOnceUsers(70)),
            checkOff.injectOpen(atOnceUsers(15)),
            hostEdit.injectOpen(atOnceUsers(10)),
            admin.injectOpen(atOnceUsers(5))
        ).protocols(httpProtocol)
    }
}
