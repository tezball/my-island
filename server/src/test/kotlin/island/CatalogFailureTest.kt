package island

import com.sun.net.httpserver.HttpServer
import io.ktor.client.HttpClient
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.server.config.MapApplicationConfig
import io.ktor.server.testing.testApplication
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Timeout
import java.net.InetSocketAddress
import java.util.Base64
import java.util.concurrent.TimeUnit

@Timeout(value = 60, unit = TimeUnit.SECONDS)
class CatalogFailureTest {
    @Test
    fun badPasswordIsRejected() = testApplication {
        pointAtSharedDatabase()
        application { module() }
        val email = "bad-password-${System.nanoTime()}@example.com"
        val signup = client.post("/accounts") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"$email","password":"guest","role":"host"}""")
        }
        assertEquals(HttpStatusCode.OK, signup.status, signup.bodyAsText())
        assertEquals(HttpStatusCode.Unauthorized, client.session("missing-${System.nanoTime()}@example.com", "guest"))
        assertEquals(HttpStatusCode.Unauthorized, client.session(email, "wrong-password"))
        assertEquals(HttpStatusCode.Unauthorized, client.session("  $email  ", ""))
        assertEquals(HttpStatusCode.OK, client.session(email, "guest"))

        val salt = b64(ByteArray(16) { 4 })
        val longSalt = b64(ByteArray(65) { 5 })
        val hash32 = b64(ByteArray(32) { 6 })
        val hash16 = b64(ByteArray(16) { 7 })
        val broken = listOf(
            "not-a-password-hash",
            stored("pbkdf2-sha256", "100000", salt),
            stored("sha256", "100000", salt, hash32),
            stored("pbkdf2-sha256", "lots", salt, hash32),
            stored("pbkdf2-sha256", "", salt, hash32),
            stored("pbkdf2-sha256", "49999", salt, hash32),
            stored("pbkdf2-sha256", "200001", salt, hash32),
            stored("pbkdf2-sha256", "100000", "!!!!", hash32),
            stored("pbkdf2-sha256", "100000", salt, "!!!!"),
            stored("pbkdf2-sha256", "100000", "", hash32),
            stored("pbkdf2-sha256", "100000", longSalt, hash32),
            stored("pbkdf2-sha256", "100000", salt, hash16),
            stored("pbkdf2-sha256", "100000", salt, hash32),
        )
        for (hash in broken) {
            storePasswordHash(email, hash)
            assertEquals(HttpStatusCode.Unauthorized, client.session(email, "guest"), hash)
        }
    }

    @Test
    fun missingFieldsAreRejected() = testApplication {
        pointAtSharedDatabase()
        application { module() }
        val blankPassword = "blank-${System.nanoTime()}@example.com"
        val spaces = client.post("/accounts") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"$blankPassword","password":"   ","role":"host"}""")
        }
        assertEquals(HttpStatusCode.Conflict, spaces.status)
        assertFalse(accountExists(blankPassword))
        val noAt = client.post("/accounts") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"host-only","password":"guest","role":"host"}""")
        }
        assertEquals(HttpStatusCode.Conflict, noAt.status)
        assertFalse(accountExists("host-only"))
        val emptyEmail = client.post("/accounts") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"  ","password":"guest","role":"supplier"}""")
        }
        assertEquals(HttpStatusCode.Conflict, emptyEmail.status)
        val guestRole = client.post("/accounts") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"guest-role-${System.nanoTime()}@example.com","password":"guest","role":"guest"}""")
        }
        assertEquals(HttpStatusCode.BadRequest, guestRole.status)
        val noPassword = client.post("/accounts") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"no-password-${System.nanoTime()}@example.com","role":"host"}""")
        }
        assertEquals(HttpStatusCode.BadRequest, noPassword.status)

        val hostEmail = "missing-host-${System.nanoTime()}@example.com"
        val created = client.post("/accounts") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"$hostEmail","password":"guest","role":"host"}""")
        }
        assertEquals(HttpStatusCode.OK, created.status, created.bodyAsText())
        val host = client.signIn(hostEmail)
        val noTitle = client.post("/host/stays") {
            header("Authorization", "Bearer $host")
            contentType(ContentType.Application.Json)
            setBody("""{"kind":"campsite","description":"A pitch","county":"Kerry"}""")
        }
        assertEquals(HttpStatusCode.BadRequest, noTitle.status)
        val noCounty = client.post("/host/stays") {
            header("Authorization", "Bearer $host")
            contentType(ContentType.Application.Json)
            setBody("""{"kind":"glamping","title":"No county","description":"A pitch"}""")
        }
        assertEquals(HttpStatusCode.BadRequest, noCounty.status)
        val badId = client.post("/host/stays/not-a-stay") {
            header("Authorization", "Bearer $host")
            contentType(ContentType.Application.Json)
            setBody(stayBody("Ignored stay"))
        }
        assertEquals(HttpStatusCode.BadRequest, badId.status)
        val hugePhoto = client.post("/host/stays") {
            header("Authorization", "Bearer $host")
            contentType(ContentType.Application.Json)
            setBody(stayBody("Huge photo stay ${System.nanoTime()}", imageBase64 = "A".repeat(1_500_001)))
        }
        assertEquals(HttpStatusCode.BadRequest, hugePhoto.status)
        assertTrue(hugePhoto.bodyAsText().contains("photo is too big"))

        val supplierEmail = "missing-guide-${System.nanoTime()}@example.com"
        assertEquals(HttpStatusCode.OK, client.post("/accounts") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"$supplierEmail","password":"guest","role":"supplier"}""")
        }.status)
        val supplier = client.signIn(supplierEmail)
        val noName = client.post("/supplier/experiences") {
            header("Authorization", "Bearer $supplier")
            contentType(ContentType.Application.Json)
            setBody("""{"county":"Kerry","description":"A guide on the cliff"}""")
        }
        assertEquals(HttpStatusCode.BadRequest, noName.status)

        val admin = client.signIn("tezball86@gmail.com")
        val hidden = client.hiddenStay(host, stayBody("Reason stay ${System.nanoTime()}", imageBase64 = null))
        val missingReason = client.post("/admin/review/stay/$hidden/reject") {
            header("Authorization", "Bearer $admin")
            contentType(ContentType.Application.Json)
            setBody("{}")
        }
        assertEquals(HttpStatusCode.BadRequest, missingReason.status)
        val longReason = client.post("/admin/review/stay/$hidden/reject") {
            header("Authorization", "Bearer $admin")
            contentType(ContentType.Application.Json)
            setBody("""{"reason":"${"n".repeat(201)}"}""")
        }
        assertEquals(HttpStatusCode.BadRequest, longReason.status)
        val notANumber = client.post("/admin/review/stay/not-a-stay/reject") {
            header("Authorization", "Bearer $admin")
            contentType(ContentType.Application.Json)
            setBody("""{"reason":"Not a stay"}""")
        }
        assertEquals(HttpStatusCode.BadRequest, notANumber.status)
        val trimmed = client.post("/admin/review/stay/$hidden/reject") {
            header("Authorization", "Bearer $admin")
            contentType(ContentType.Application.Json)
            setBody("""{"reason":"  ${"n".repeat(200)}  "}""")
        }
        assertEquals(HttpStatusCode.OK, trimmed.status, trimmed.bodyAsText())
        val noPlaceName = client.post("/admin/places") {
            header("Authorization", "Bearer $admin")
            contentType(ContentType.Application.Json)
            setBody("""{"county":"Clare","lat":53.0,"lng":-8.0}""")
        }
        assertEquals(HttpStatusCode.BadRequest, noPlaceName.status)
        val noPin = "No pin place ${System.nanoTime()}"
        val pinless = client.post("/admin/places") {
            header("Authorization", "Bearer $admin")
            contentType(ContentType.Application.Json)
            setBody("""{"name":"$noPin","county":"Clare","lat":null,"lng":null}""")
        }
        assertEquals(HttpStatusCode.OK, pinless.status, pinless.bodyAsText())
        assertTrue(client.get("/places").bodyAsText().contains(noPin))
    }

    @Test
    fun reviewRejectsPinPhotoWebsiteAndText() = testApplication {
        pointAtSharedDatabase()
        environment {
            config = MapApplicationConfig(
                "island.createLimit" to "80",
                "island.signInLimit" to "80",
            )
        }
        application { module() }
        val server = localSite()
        try {
            val port = (server.address as InetSocketAddress).port
            val hostEmail = "review-host-${System.nanoTime()}@example.com"
            assertEquals(HttpStatusCode.OK, client.post("/accounts") {
                contentType(ContentType.Application.Json)
                setBody("""{"email":"$hostEmail","password":"guest","role":"host"}""")
            }.status)
            val host = client.signIn(hostEmail)
            val supplierEmail = "review-guide-${System.nanoTime()}@example.com"
            assertEquals(HttpStatusCode.OK, client.post("/accounts") {
                contentType(ContentType.Application.Json)
                setBody("""{"email":"$supplierEmail","password":"guest","role":"supplier"}""")
            }.status)
            val supplier = client.signIn(supplierEmail)
            val admin = client.signIn("tezball86@gmail.com")

            val plain = "A quiet pitch beside the cliff"
            val passing = "Harbour stay ${System.nanoTime()}"
            val passingId = client.publicStay(
                host,
                stayBody(passing, description = plain, lat = 51.0, lng = -11.0, lot = true),
            )
            assertTrue(client.get("/page/$passingId").bodyAsText().contains("Cliff lot"))
            assertEquals(HttpStatusCode.NotFound, client.get("/page/999999999").status)
            assertEquals(HttpStatusCode.NotFound, client.get("/listings/999999999").status)
            val edited = "Harbour stay < edited ${System.nanoTime()}"
            val edit = client.post("/host/stays/$passingId") {
                header("Authorization", "Bearer $host")
                contentType(ContentType.Application.Json)
                setBody(stayBody(edited, description = plain, lat = 51.0, lng = -11.0, lot = true))
            }
            assertEquals(HttpStatusCode.OK, edit.status, edit.bodyAsText())
            assertTrue(edit.bodyAsText().contains("\"hidden\":\"true\""))
            assertFalse(client.get("/stays").bodyAsText().contains(edited))
            assertEquals(HttpStatusCode.NotFound, client.get("/page/$passingId").status)
            assertEquals(HttpStatusCode.NotFound, client.get("/listings/$passingId").status)

            val farNorth = "Far north stay ${System.nanoTime()}"
            client.hiddenStay(host, stayBody(farNorth, description = plain, lat = 55.6, lng = -8.0))
            assertFalse(client.get("/stays").bodyAsText().contains(farNorth))
            client.hiddenStay(host, stayBody("Far south stay ${System.nanoTime()}", description = plain, lat = 50.9, lng = -8.0))
            client.hiddenStay(host, stayBody("Far west stay ${System.nanoTime()}", description = plain, lat = 53.0, lng = -11.1))
            client.hiddenStay(host, stayBody("Far east stay ${System.nanoTime()}", description = plain, lat = 55.5, lng = -4.9))
            client.hiddenStay(host, stayBody("No lat stay ${System.nanoTime()}", description = plain, includeLat = false, lng = -8.0))
            client.hiddenStay(host, stayBody("No lng stay ${System.nanoTime()}", description = plain, lat = 53.0, includeLng = false))
            client.hiddenStay(
                host,
                stayBody("Angle stay ${System.nanoTime()}", description = "A pitch with a < in the text", lat = 53.0, lng = -8.0),
            )
            client.hiddenStay(
                host,
                stayBody("Script stay ${System.nanoTime()}", description = "A guide wrote script in the notes", lat = 53.0, lng = -8.0),
            )
            client.hiddenStay(
                host,
                stayBody("Upper script stay ${System.nanoTime()}", description = "A guide wrote SCRIPT in the notes", lat = 53.0, lng = -8.0),
            )
            client.hiddenStay(host, stayBody("Gif stay ${System.nanoTime()}", description = plain, imageBase64 = GIF))
            client.hiddenStay(host, stayBody("Short photo stay ${System.nanoTime()}", description = plain, imageBase64 = TINY))
            client.hiddenStay(host, stayBody("Not png stay ${System.nanoTime()}", description = plain, imageBase64 = NOT_PNG))
            client.hiddenStay(host, stayBody("Not jpeg stay ${System.nanoTime()}", description = plain, imageBase64 = NOT_JPEG))
            client.hiddenStay(host, stayBody("Bad photo stay ${System.nanoTime()}", description = plain, imageBase64 = "!!!!"))
            client.hiddenStay(host, stayBody("Blank photo stay ${System.nanoTime()}", description = plain, imageBase64 = "   "))
            client.hiddenStay(host, stayBody("No photo stay ${System.nanoTime()}", description = plain, imageBase64 = null))
            client.hiddenStay(
                host,
                stayBody("Down site stay ${System.nanoTime()}", description = plain, website = "http://127.0.0.1:1"),
            )
            client.hiddenStay(
                host,
                stayBody("Bad url stay ${System.nanoTime()}", description = plain, website = "not a url"),
            )
            client.hiddenStay(
                host,
                stayBody("Away site stay ${System.nanoTime()}", description = plain, website = "http://127.0.0.1:$port/away"),
            )
            client.hiddenStay(
                host,
                stayBody("Missing site stay ${System.nanoTime()}", description = plain, website = "http://127.0.0.1:$port/missing"),
            )
            client.hiddenStay(
                host,
                stayBody("Down page stay ${System.nanoTime()}", description = plain, website = "http://127.0.0.1:$port/down"),
            )
            val liveSite = "Live site stay ${System.nanoTime()}"
            client.publicStay(
                host,
                stayBody(liveSite, description = plain, website = "http://127.0.0.1:$port/up"),
            )

            val marked = "Marked guide ${System.nanoTime()}"
            val markedId = client.hiddenExperience(
                supplier,
                experienceBody(marked, description = "A guide on the cliff < path", lat = 53.0, lng = -8.0),
            )
            assertEquals(HttpStatusCode.NotFound, client.get("/page/$markedId").status)
            assertEquals(HttpStatusCode.NotFound, client.get("/page/exp-absent-${System.nanoTime()}").status)
            assertEquals(HttpStatusCode.NotFound, client.get("/admin/review/photo/stay/not-a-stay") {
                header("Authorization", "Bearer $admin")
            }.status)
            val guest = client.signIn("guest@example.com")
            assertEquals(HttpStatusCode.Forbidden, client.post("/admin/review/experience/$markedId/reject") {
                header("Authorization", "Bearer $guest")
                contentType(ContentType.Application.Json)
                setBody("""{"reason":"Not an experience"}""")
            }.status)
            assertEquals(HttpStatusCode.BadRequest, client.post("/admin/review/experience/%20/reject") {
                header("Authorization", "Bearer $admin")
                contentType(ContentType.Application.Json)
                setBody("""{"reason":"Not an experience"}""")
            }.status)
            val scripted = "Scripted guide ${System.nanoTime()}"
            val scriptedId = client.hiddenExperience(
                supplier,
                experienceBody(scripted, description = "A guide wrote script in the notes", lat = 53.2, lng = -8.2),
            )
            val hiddenPhoto = client.get("/admin/review/photo/experience/$scriptedId") {
                header("Authorization", "Bearer $admin")
            }
            assertEquals(HttpStatusCode.OK, hiddenPhoto.status)
            assertEquals(HttpStatusCode.NotFound, client.get("/listings/$scriptedId/photo").status)
            assertEquals(HttpStatusCode.NotFound, client.get("/admin/review/photo/lot/$scriptedId") {
                header("Authorization", "Bearer $admin")
            }.status)
            client.hiddenExperience(
                supplier,
                experienceBody("Northern guide ${System.nanoTime()}", description = "A guide on the cliff", lat = 56.0, lng = -8.0),
            )
            client.hiddenExperience(
                supplier,
                experienceBody("Gif guide ${System.nanoTime()}", description = "A guide on the cliff", imageBase64 = GIF),
            )
            client.hiddenExperience(
                supplier,
                experienceBody(
                    "Closed guide ${System.nanoTime()}",
                    description = "A guide on the cliff",
                    website = "http://127.0.0.1:$port/down",
                ),
            )
            val liveGuide = "Live guide ${System.nanoTime()}"
            val liveId = client.publicExperience(
                supplier,
                experienceBody(liveGuide, description = "A guide on the cliff", website = "http://127.0.0.1:$port/up"),
            )
            val livePage = client.get("/page/$liveId")
            assertEquals(HttpStatusCode.OK, livePage.status)
            assertTrue(livePage.bodyAsText().contains(liveGuide))
            assertTrue(client.get("/listings/$liveId").bodyAsText().contains("experience"))

            val missingExperience = "exp-missing-${System.nanoTime()}"
            assertEquals(HttpStatusCode.NotFound, client.post("/admin/review/experience/$missingExperience/reject") {
                header("Authorization", "Bearer $admin")
                contentType(ContentType.Application.Json)
                setBody("""{"reason":"Not an experience"}""")
            }.status)
            assertEquals(HttpStatusCode.NotFound, client.post("/admin/review/experience/$missingExperience/approve") {
                header("Authorization", "Bearer $admin")
            }.status)
            val blank = client.post("/admin/review/experience/$markedId/reject") {
                header("Authorization", "Bearer $admin")
                contentType(ContentType.Application.Json)
                setBody("""{"reason":" "}""")
            }
            assertEquals(HttpStatusCode.BadRequest, blank.status)
            val rejected = client.post("/admin/review/experience/$markedId/reject") {
                header("Authorization", "Bearer $admin")
                contentType(ContentType.Application.Json)
                setBody("""{"reason":"Not an experience a guide can publish"}""")
            }
            assertEquals(HttpStatusCode.OK, rejected.status, rejected.bodyAsText())
            assertEquals("Not an experience a guide can publish", experienceReason(markedId))
            assertFalse(client.get("/experiences").bodyAsText().contains(marked))
            val approved = client.post("/admin/review/experience/$scriptedId/approve") {
                header("Authorization", "Bearer $admin")
            }
            assertEquals(HttpStatusCode.OK, approved.status, approved.bodyAsText())
            assertTrue(client.get("/experiences").bodyAsText().contains(scripted))
        } finally {
            server.stop(0)
        }
    }

    @Test
    fun placeRejectsAPhotoThatIsNotPngOrJpeg() = testApplication {
        pointAtSharedDatabase()
        environment { config = MapApplicationConfig("island.createLimit" to "40") }
        application { module() }
        val admin = client.signIn("tezball86@gmail.com")
        val rejected = mapOf(
            "Gif place" to GIF,
            "Short place" to TINY,
            "Not png place" to NOT_PNG,
            "Not jpeg place" to NOT_JPEG,
            "Bad text place" to "!!!!",
            "Empty place" to "",
        )
        for ((name, photo) in rejected) {
            val place = "$name ${System.nanoTime()}"
            val response = client.post("/admin/places") {
                header("Authorization", "Bearer $admin")
                contentType(ContentType.Application.Json)
                setBody("""{"name":"$place","county":"Clare","lat":53.1,"lng":-8.1,"images":["$photo"]}""")
            }
            assertEquals(HttpStatusCode.BadRequest, response.status, place)
            assertTrue(response.bodyAsText().contains("PNG or JPEG only"), response.bodyAsText())
            assertFalse(client.get("/places").bodyAsText().contains(place))
        }
        val hugeName = "Huge place ${System.nanoTime()}"
        val huge = b64(ByteArray(1_048_577) { 0x89.toByte() })
        val tooBig = client.post("/admin/places") {
            header("Authorization", "Bearer $admin")
            contentType(ContentType.Application.Json)
            setBody("""{"name":"$hugeName","county":"Clare","lat":53.1,"lng":-8.1,"images":["$huge"]}""")
        }
        assertEquals(HttpStatusCode.BadRequest, tooBig.status, tooBig.bodyAsText())
        assertTrue(tooBig.bodyAsText().contains("photo is too big"))
        assertFalse(client.get("/places").bodyAsText().contains(hugeName))
        val longName = "Long photo place ${System.nanoTime()}"
        val longText = client.post("/admin/places") {
            header("Authorization", "Bearer $admin")
            contentType(ContentType.Application.Json)
            setBody("""{"name":"$longName","county":"Clare","lat":53.1,"lng":-8.1,"images":["${"A".repeat(1_500_001)}"]}""")
        }
        assertEquals(HttpStatusCode.BadRequest, longText.status, longText.bodyAsText())
        assertTrue(longText.bodyAsText().contains("photo is too big"))
        assertFalse(client.get("/places").bodyAsText().contains(longName))
    }
}

private const val PNG =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="

private val GIF = b64("GIF89a".encodeToByteArray())
private val TINY = b64(byteArrayOf(0x01, 0x02))
private val NOT_PNG = b64(byteArrayOf(0x89.toByte(), 0x47, 0, 0, 0, 0, 0, 0, 0))
private val NOT_JPEG = b64(byteArrayOf(0xFF.toByte(), 0x00, 0, 0, 0, 0, 0, 0, 0))

private fun b64(bytes: ByteArray): String = Base64.getEncoder().encodeToString(bytes)

private fun stored(algorithm: String, iterations: String, salt: String, hash: String? = null): String {
    val parts = mutableListOf(algorithm, iterations, salt)
    if (hash != null) parts += hash
    return parts.joinToString("\u0024")
}

private fun stayBody(
    title: String,
    description: String = "A quiet pitch",
    lat: Double? = 53.0,
    lng: Double? = -8.0,
    imageBase64: String? = PNG,
    website: String? = null,
    lot: Boolean = false,
    includeLat: Boolean = true,
    includeLng: Boolean = true,
): String {
    val fields = mutableListOf(
        """"kind":"campsite"""",
        """"title":"$title"""",
        """"description":"$description"""",
        """"county":"Kerry"""",
    )
    if (includeLat && lat != null) fields += """"lat":$lat"""
    if (includeLng && lng != null) fields += """"lng":$lng"""
    if (imageBase64 != null) fields += """"imageBase64":"$imageBase64""""
    if (website != null) fields += """"website":"$website""""
    if (lot) fields += """"lots":[{"name":"Cliff lot","sleeps":2,"priceEur":35}]"""
    return "{" + fields.joinToString(",") + "}"
}

private fun experienceBody(
    name: String,
    description: String,
    lat: Double? = 53.0,
    lng: Double? = -8.0,
    imageBase64: String? = PNG,
    website: String? = null,
): String {
    val fields = mutableListOf(
        """"name":"$name"""",
        """"county":"Kerry"""",
        """"description":"$description"""",
    )
    if (lat != null) fields += """"lat":$lat"""
    if (lng != null) fields += """"lng":$lng"""
    if (imageBase64 != null) fields += """"imageBase64":"$imageBase64""""
    if (website != null) fields += """"website":"$website""""
    return "{" + fields.joinToString(",") + "}"
}

private fun localSite(): HttpServer {
    val server = HttpServer.create(InetSocketAddress("127.0.0.1", 0), 0)
    server.createContext("/") { exchange ->
        val status = when (exchange.requestURI.path) {
            "/up" -> 200
            "/away" -> 301
            "/missing" -> 404
            else -> 500
        }
        exchange.sendResponseHeaders(status, -1)
        exchange.close()
    }
    server.start()
    return server
}

private suspend fun HttpClient.session(email: String, password: String): HttpStatusCode {
    val login = post("/sessions") {
        contentType(ContentType.Application.Json)
        setBody("""{"email":"$email","password":"$password"}""")
    }
    return login.status
}

private suspend fun HttpClient.signIn(email: String): String {
    val login = post("/sessions") {
        contentType(ContentType.Application.Json)
        setBody("""{"email":"$email","password":"guest"}""")
    }
    assertEquals(HttpStatusCode.OK, login.status, login.bodyAsText())
    return Regex("\"token\":\"([^\"]+)\"").find(login.bodyAsText())!!.groupValues[1]
}

private suspend fun HttpClient.hiddenStay(token: String, body: String): String {
    val created = post("/host/stays") {
        header("Authorization", "Bearer $token")
        contentType(ContentType.Application.Json)
        setBody(body)
    }
    assertEquals(HttpStatusCode.OK, created.status, created.bodyAsText())
    assertTrue(created.bodyAsText().contains("\"hidden\":\"true\""), created.bodyAsText())
    return Regex("\"id\":\"(\\d+)\"").find(created.bodyAsText())!!.groupValues[1]
}

private suspend fun HttpClient.publicStay(token: String, body: String): String {
    val created = post("/host/stays") {
        header("Authorization", "Bearer $token")
        contentType(ContentType.Application.Json)
        setBody(body)
    }
    assertEquals(HttpStatusCode.OK, created.status, created.bodyAsText())
    assertTrue(created.bodyAsText().contains("\"hidden\":\"false\""), created.bodyAsText())
    val id = Regex("\"id\":\"(\\d+)\"").find(created.bodyAsText())!!.groupValues[1]
    assertTrue(get("/stays").bodyAsText().contains(id))
    return id
}

private suspend fun HttpClient.hiddenExperience(token: String, body: String): String {
    val created = post("/supplier/experiences") {
        header("Authorization", "Bearer $token")
        contentType(ContentType.Application.Json)
        setBody(body)
    }
    assertEquals(HttpStatusCode.OK, created.status, created.bodyAsText())
    assertTrue(created.bodyAsText().contains("\"hidden\":\"true\""), created.bodyAsText())
    return Regex("\"id\":\"([^\"]+)\"").find(created.bodyAsText())!!.groupValues[1]
}

private suspend fun HttpClient.publicExperience(token: String, body: String): String {
    val created = post("/supplier/experiences") {
        header("Authorization", "Bearer $token")
        contentType(ContentType.Application.Json)
        setBody(body)
    }
    assertEquals(HttpStatusCode.OK, created.status, created.bodyAsText())
    assertTrue(created.bodyAsText().contains("\"hidden\":\"false\""), created.bodyAsText())
    val id = Regex("\"id\":\"([^\"]+)\"").find(created.bodyAsText())!!.groupValues[1]
    assertTrue(get("/experiences").bodyAsText().contains(id))
    return id
}

private fun storePasswordHash(email: String, hash: String) {
    SharedDatabase.dataSource.connection.use { connection ->
        connection.prepareStatement("update account set password_hash = ? where email = ?").use { statement ->
            statement.setString(1, hash)
            statement.setString(2, email)
            assertEquals(1, statement.executeUpdate())
        }
    }
}

private fun accountExists(email: String): Boolean {
    return SharedDatabase.dataSource.connection.use { connection ->
        connection.prepareStatement("select 1 from account where email = ?").use { statement ->
            statement.setString(1, email.trim().lowercase())
            statement.executeQuery().use { rs -> rs.next() }
        }
    }
}

private fun experienceReason(id: String): String? {
    return SharedDatabase.dataSource.connection.use { connection ->
        connection.prepareStatement("select review_reason from experience where id = ?").use { statement ->
            statement.setString(1, id)
            statement.executeQuery().use { rs ->
                if (!rs.next()) null else rs.getString(1)
            }
        }
    }
}

private fun pointAtSharedDatabase() {
    val db = SharedDatabase.container
    System.setProperty("jdbc.url", db.jdbcUrl)
    System.setProperty("jdbc.user", db.username)
    System.setProperty("jdbc.password", db.password)
}
