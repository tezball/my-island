package island

import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.server.testing.testApplication
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

class CatalogApiTest {
    @Test
    fun publicListsHideUnreviewedRows() = testApplication {
        pointAtSharedDatabase()
        application { module() }
        val places = client.get("/places")
        val stays = client.get("/stays")
        val experiences = client.get("/experiences")
        assertEquals(HttpStatusCode.OK, places.status)
        assertEquals(HttpStatusCode.OK, stays.status)
        assertEquals(HttpStatusCode.OK, experiences.status)
        assertEquals(HttpStatusCode.OK, client.get("/metrics").status)
        assertEquals(HttpStatusCode.OK, client.get("/info").status)
        assertTrue(places.bodyAsText().contains("\"id\""))
        assertFalse(stays.bodyAsText().contains("\"hidden\":true"))
        assertTrue(experiences.bodyAsText().contains("Lough Hyne"))
        assertFalse(experiences.bodyAsText().contains("Connemara coast bike"))
    }

    @Test
    fun guestCheckOffIsPrivateAndAdminSeesHiddenStays() = testApplication {
        pointAtSharedDatabase()
        application { module() }
        val places = client.get("/places").bodyAsText()
        val placeId = Regex("\"id\":\"([^\"]+)\"").find(places)!!.groupValues[1]
        val login = client.post("/sessions") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"guest@example.com","password":"guest"}""")
        }
        assertEquals(HttpStatusCode.OK, login.status)
        val mark = client.post("/visits") {
            header("Authorization", "Bearer guest@example.com")
            contentType(ContentType.Application.Json)
            setBody("""{"placeId":"$placeId"}""")
        }
        assertEquals(HttpStatusCode.NoContent, mark.status)
        assertFalse(client.get("/places").bodyAsText().contains("visitedCount"))
        val denied = client.get("/admin/listings") {
            header("Authorization", "Bearer guest@example.com")
        }
        assertEquals(HttpStatusCode.Forbidden, denied.status)
        val admin = client.get("/admin/listings") {
            header("Authorization", "Bearer tezball86@gmail.com")
        }
        assertEquals(HttpStatusCode.OK, admin.status)
        assertTrue(admin.bodyAsText().contains("\"hidden\":true"))
        val added = client.post("/admin/places") {
            header("Authorization", "Bearer tezball86@gmail.com")
            contentType(ContentType.Application.Json)
            setBody("""{"name":"Admin Point","county":"Clare","lat":52.97,"lng":-9.43}""")
        }
        assertEquals(HttpStatusCode.OK, added.status)
        assertTrue(client.get("/places").bodyAsText().contains("Admin Point"))
        val created = client.post("/host/stays") {
            header("Authorization", "Bearer host-001@example.com")
            contentType(ContentType.Application.Json)
            setBody("""{"kind":"campsite","title":"Api Camp","description":"A pitch","county":"Kerry"}""")
        }
        assertEquals(HttpStatusCode.OK, created.status)
        assertFalse(client.get("/stays").bodyAsText().contains("Api Camp"))
    }

    @Test
    fun listingPageShowsLots() = testApplication {
        pointAtSharedDatabase()
        application { module() }
        val stayId = SharedDatabase.dataSource.connection.use { c ->
            c.createStatement().executeQuery(
                "select stay.id from stay join lot on lot.stay_id = stay.id where stay.hidden = false limit 1"
            ).use { rs ->
                rs.next()
                rs.getLong(1)
            }
        }
        val page = client.get("/page/$stayId")
        assertEquals(HttpStatusCode.OK, page.status)
        assertTrue(page.bodyAsText().contains("Lot"))
    }
}

private fun pointAtSharedDatabase() {
    val db = SharedDatabase.container
    System.setProperty("jdbc.url", db.jdbcUrl)
    System.setProperty("jdbc.user", db.username)
    System.setProperty("jdbc.password", db.password)
}
