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
        val signup = client.post("/accounts") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"new-host@example.com","password":"guest","role":"host"}""")
        }
        assertEquals(HttpStatusCode.OK, signup.status)
        val again = client.post("/accounts") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"new-host@example.com","password":"guest","role":"host"}""")
        }
        assertEquals(HttpStatusCode.Conflict, again.status)
        val google = client.post("/sessions/google") {
            contentType(ContentType.Application.Json)
            setBody("""{"idToken":"missing"}""")
        }
        assertEquals(HttpStatusCode.ServiceUnavailable, google.status)
        val created = client.post("/host/stays") {
            header("Authorization", "Bearer host-001@example.com")
            contentType(ContentType.Application.Json)
            setBody("""{"kind":"campsite","title":"Api Camp","description":"A pitch","county":"Kerry"}""")
        }
        assertEquals(HttpStatusCode.OK, created.status)
        assertFalse(client.get("/stays").bodyAsText().contains("Api Camp"))
        val createdId = Regex("\"id\":\"(\\d+)\"").find(created.bodyAsText())!!.groupValues[1]
        val edited = client.post("/host/stays/$createdId") {
            header("Authorization", "Bearer host-001@example.com")
            contentType(ContentType.Application.Json)
            setBody("""{"kind":"glamping","title":"Api Camp Edited","description":"A pitch","county":"Kerry"}""")
        }
        assertEquals(HttpStatusCode.OK, edited.status)
        assertFalse(client.get("/stays").bodyAsText().contains("Api Camp Edited"))
        val png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
        val published = client.post("/host/stays") {
            header("Authorization", "Bearer host-001@example.com")
            contentType(ContentType.Application.Json)
            setBody("""{"kind":"campsite","title":"Reviewed Camp","description":"A quiet pitch","county":"Kerry","lat":52.1,"lng":-9.5,"imageBase64":"$png"}""")
        }
        assertEquals(HttpStatusCode.OK, published.status)
        assertTrue(published.bodyAsText().contains("\"hidden\":\"false\"") || client.get("/stays").bodyAsText().contains("Reviewed Camp"))
        val down = client.post("/host/stays") {
            header("Authorization", "Bearer host-001@example.com")
            contentType(ContentType.Application.Json)
            setBody("""{"kind":"campsite","title":"Down Site Camp","description":"A quiet pitch","county":"Kerry","lat":52.1,"lng":-9.5,"imageBase64":"$png","website":"http://127.0.0.1:1"}""")
        }
        assertEquals(HttpStatusCode.OK, down.status)
        assertTrue(down.bodyAsText().contains("\"hidden\":\"true\""))
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

    @Test
    fun supplierEditHidesTheExperience() = testApplication {
        pointAtSharedDatabase()
        application { module() }
        val created = client.post("/supplier/experiences") {
            header("Authorization", "Bearer supplier-kayak@example.com")
            contentType(ContentType.Application.Json)
            setBody("""{"name":"Hidden paddle","county":"Cork","description":"A short paddle"}""")
        }
        assertEquals(HttpStatusCode.OK, created.status)
        val id = Regex("\"id\":\"([^\"]+)\"").find(created.bodyAsText())!!.groupValues[1]
        val edited = client.post("/supplier/experiences/$id") {
            header("Authorization", "Bearer supplier-kayak@example.com")
            contentType(ContentType.Application.Json)
            setBody("""{"name":"Hidden paddle edited","county":"Cork","description":"A short paddle"}""")
        }
        assertEquals(HttpStatusCode.OK, edited.status)
        assertFalse(client.get("/experiences").bodyAsText().contains("Hidden paddle edited"))
    }
}

private fun pointAtSharedDatabase() {
    val db = SharedDatabase.container
    System.setProperty("jdbc.url", db.jdbcUrl)
    System.setProperty("jdbc.user", db.username)
    System.setProperty("jdbc.password", db.password)
}
