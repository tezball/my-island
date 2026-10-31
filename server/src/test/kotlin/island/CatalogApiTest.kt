package island

import io.ktor.client.HttpClient
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsBytes
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
        val kayakPhoto = client.get("/listings/kayak-cork/photo")
        assertEquals(HttpStatusCode.OK, kayakPhoto.status)
        assertTrue(kayakPhoto.headers["Content-Type"]!!.startsWith("image/png"))
        assertEquals(0x89.toByte(), kayakPhoto.bodyAsBytes()[0])
        assertEquals(HttpStatusCode.NotFound, client.get("/listings/bike-galway/photo").status)
        assertEquals(HttpStatusCode.NotFound, client.get("/page/bike-galway").status)
        assertEquals(HttpStatusCode.NotFound, client.get("/listings/boat-antrim/photo").status)
        assertEquals(HttpStatusCode.NotFound, client.get("/page/boat-antrim").status)
    }

    @Test
    fun guestCheckOffIsPrivateAndAdminSeesHiddenStays() = testApplication {
        pointAtSharedDatabase()
        application { module() }
        val places = client.get("/places").bodyAsText()
        val placeId = Regex("\"id\":\"([^\"]+)\"").find(places)!!.groupValues[1]
        val guest = client.signIn("guest@example.com")
        val mark = client.post("/visits") {
            header("Authorization", "Bearer $guest")
            contentType(ContentType.Application.Json)
            setBody("""{"placeId":"$placeId"}""")
        }
        assertEquals(HttpStatusCode.NoContent, mark.status)
        assertTrue(client.get("/me/visits") { header("Authorization", "Bearer $guest") }.bodyAsText().contains(placeId))
        assertFalse(client.get("/places").bodyAsText().contains("visitedCount"))
        val denied = client.get("/admin/listings") {
            header("Authorization", "Bearer $guest")
        }
        assertEquals(HttpStatusCode.Forbidden, denied.status)
        val emailBearer = client.get("/admin/listings") {
            header("Authorization", "Bearer tezball86@gmail.com")
        }
        assertEquals(HttpStatusCode.Unauthorized, emailBearer.status)
        val admin = client.signIn("tezball86@gmail.com")
        val adminList = client.get("/admin/listings") {
            header("Authorization", "Bearer $admin")
        }
        assertEquals(HttpStatusCode.OK, adminList.status)
        assertTrue(adminList.bodyAsText().contains("\"hidden\":true"))
        val hostsDenied = client.get("/admin/hosts") {
            header("Authorization", "Bearer $guest")
        }
        assertEquals(HttpStatusCode.Forbidden, hostsDenied.status)
        val hosts = client.get("/admin/hosts") {
            header("Authorization", "Bearer $admin")
        }
        assertEquals(HttpStatusCode.OK, hosts.status)
        assertTrue(hosts.bodyAsText().contains("host-001@example.com"))
        val added = client.post("/admin/places") {
            header("Authorization", "Bearer $admin")
            contentType(ContentType.Application.Json)
            setBody("""{"name":"Admin Point","county":"Clare","lat":52.97,"lng":-9.43}""")
        }
        assertEquals(HttpStatusCode.OK, added.status)
        assertTrue(client.get("/places").bodyAsText().contains("Admin Point"))
        assertTrue(client.get("/me/places") { header("Authorization", "Bearer $admin") }.bodyAsText().contains("Admin Point"))
        val host = client.signIn("host-001@example.com")
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
            header("Authorization", "Bearer $host")
            contentType(ContentType.Application.Json)
            setBody("""{"kind":"campsite","title":"Api Camp","description":"A pitch","county":"Kerry"}""")
        }
        assertEquals(HttpStatusCode.OK, created.status)
        assertFalse(client.get("/stays").bodyAsText().contains("Api Camp"))
        val createdId = Regex("\"id\":\"(\\d+)\"").find(created.bodyAsText())!!.groupValues[1]
        val edited = client.post("/host/stays/$createdId") {
            header("Authorization", "Bearer $host")
            contentType(ContentType.Application.Json)
            setBody("""{"kind":"glamping","title":"Api Camp Edited","description":"A pitch","county":"Kerry"}""")
        }
        assertEquals(HttpStatusCode.OK, edited.status)
        assertFalse(client.get("/stays").bodyAsText().contains("Api Camp Edited"))
        val png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
        val published = client.post("/host/stays") {
            header("Authorization", "Bearer $host")
            contentType(ContentType.Application.Json)
            setBody("""{"kind":"campsite","title":"Reviewed Camp","description":"A quiet pitch","county":"Kerry","lat":52.1,"lng":-9.5,"imageBase64":"$png","lots":[{"name":"Harbour pitch","sleeps":4,"priceEur":28},{"name":"River pitch","sleeps":2,"priceEur":22}]}""")
        }
        assertEquals(HttpStatusCode.OK, published.status)
        assertTrue(published.bodyAsText().contains("\"hidden\":\"false\""))
        val campId = Regex("\"id\":\"(\\d+)\"").find(published.bodyAsText())!!.groupValues[1]
        val campPage = client.get("/page/$campId").bodyAsText()
        assertTrue(campPage.contains("Harbour pitch"))
        assertTrue(campPage.contains("River pitch"))
        assertTrue(campPage.contains("/listings/$campId/photo"))
        assertTrue(campPage.contains("/host/stays/$campId"))
        assertTrue(campPage.contains("Save this stay"))
        val campPhoto = client.get("/listings/$campId/photo")
        assertEquals(HttpStatusCode.OK, campPhoto.status)
        assertEquals(0x89.toByte(), campPhoto.bodyAsBytes()[0])
        val hiddenEdit = client.post("/host/stays/$campId") {
            header("Authorization", "Bearer $host")
            contentType(ContentType.Application.Json)
            setBody("""{"kind":"campsite","title":"Reviewed Camp","description":"A quiet pitch","county":"Kerry","lat":52.1,"lng":-9.5,"lots":[{"name":"Harbour pitch","sleeps":4,"priceEur":28}]}""")
        }
        assertEquals(HttpStatusCode.OK, hiddenEdit.status, hiddenEdit.bodyAsText())
        assertTrue(hiddenEdit.bodyAsText().contains("\"hidden\":\"true\""))
        assertEquals(HttpStatusCode.NotFound, client.get("/page/$campId").status)
        val down = client.post("/host/stays") {
            header("Authorization", "Bearer $host")
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
        val host = client.signIn("host-001@example.com")
        val png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
        val createdStay = client.post("/host/stays") {
            header("Authorization", "Bearer $host")
            contentType(ContentType.Application.Json)
            setBody("""{"kind":"glamping","title":"Harbour glamping","description":"A quiet pitch","county":"Kerry","lat":52.1,"lng":-9.5,"imageBase64":"$png","lots":[{"name":"Lot 1","sleeps":2,"priceEur":24}]}""")
        }
        assertEquals(HttpStatusCode.OK, createdStay.status, createdStay.bodyAsText())
        val stayId = Regex("\"id\":\"(\\d+)\"").find(createdStay.bodyAsText())!!.groupValues[1].toLong()
        val page = client.get("/page/$stayId")
        assertEquals(HttpStatusCode.OK, page.status)
        assertTrue(page.bodyAsText().contains("Lot"))
        assertTrue(page.bodyAsText().contains("/listings/$stayId/photo"))
        val placeId = Regex("\"id\":\"([^\"]+)\"").find(client.get("/places").bodyAsText())!!.groupValues[1]
        assertTrue(client.get("/page/$placeId").bodyAsText().contains("I've been"))
        val hostPage = client.get("/host").bodyAsText()
        assertTrue(hostPage.contains("type=\"file\""))
        assertTrue(hostPage.contains("Add a lot"))
        assertTrue(hostPage.contains("Sign up"))
        assertTrue(hostPage.contains("/accounts"))
        assertTrue(hostPage.contains("role: 'host'"))
        assertFalse(hostPage.contains("role: 'guest'"))
        val home = client.get("/").bodyAsText()
        assertTrue(home.contains("Host"))
        assertTrue(home.contains(">Guide</a>"))
        assertTrue(client.get("/admin").bodyAsText().contains("Add a place"))
        assertTrue(client.get("/admin").bodyAsText().contains("Show hosts"))
        val guidePage = client.get("/supplier").bodyAsText()
        assertTrue(guidePage.contains("Add an experience"))
        assertTrue(guidePage.contains("<title>Guide</title>"))
        assertTrue(guidePage.contains("role: 'supplier'"))
        assertFalse(guidePage.contains("role: 'guest'"))
        assertTrue(guidePage.contains("/accounts"))
        val seededStayPage = client.get("/page/$stayId").bodyAsText()
        assertTrue(seededStayPage.contains("/host/stays/$stayId"))
        assertTrue(seededStayPage.contains("Save this stay"))
        val kayakPage = client.get("/page/kayak-cork").bodyAsText()
        assertTrue(kayakPage.contains("/supplier/experiences/kayak-cork"))
        assertTrue(kayakPage.contains("Save this experience"))
        assertTrue(kayakPage.contains("A guide owns this experience"))
    }

    @Test
    fun supplierEditHidesTheExperience() = testApplication {
        pointAtSharedDatabase()
        application { module() }
        val supplier = client.signIn("supplier-kayak@example.com")
        val created = client.post("/supplier/experiences") {
            header("Authorization", "Bearer $supplier")
            contentType(ContentType.Application.Json)
            setBody("""{"name":"Hidden paddle","county":"Cork","description":"A short paddle"}""")
        }
        assertEquals(HttpStatusCode.OK, created.status)
        val id = Regex("\"id\":\"([^\"]+)\"").find(created.bodyAsText())!!.groupValues[1]
        val edited = client.post("/supplier/experiences/$id") {
            header("Authorization", "Bearer $supplier")
            contentType(ContentType.Application.Json)
            setBody("""{"name":"Hidden paddle edited","county":"Cork","description":"A short paddle"}""")
        }
        assertEquals(HttpStatusCode.OK, edited.status)
        assertFalse(client.get("/experiences").bodyAsText().contains("Hidden paddle edited"))
        val png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
        val live = client.post("/supplier/experiences") {
            header("Authorization", "Bearer $supplier")
            contentType(ContentType.Application.Json)
            setBody("""{"name":"Reviewed paddle","county":"Cork","description":"A short paddle","lat":51.5,"lng":-9.3,"imageBase64":"$png"}""")
        }
        assertEquals(HttpStatusCode.OK, live.status)
        assertTrue(live.bodyAsText().contains("\"hidden\":\"false\""))
        assertTrue(client.get("/experiences").bodyAsText().contains("Reviewed paddle"))
        val jpeg = "/9j/4AAQSkZJRgABAQAAAQABAAD/2Q=="
        val jpegLive = client.post("/supplier/experiences") {
            header("Authorization", "Bearer $supplier")
            contentType(ContentType.Application.Json)
            setBody("""{"name":"Jpeg paddle","county":"Cork","description":"A short paddle","lat":51.5,"lng":-9.3,"imageBase64":"$jpeg"}""")
        }
        assertEquals(HttpStatusCode.OK, jpegLive.status)
        val jpegId = Regex("\"id\":\"([^\"]+)\"").find(jpegLive.bodyAsText())!!.groupValues[1]
        val jpegPhoto = client.get("/listings/$jpegId/photo")
        assertEquals(HttpStatusCode.OK, jpegPhoto.status)
        assertTrue(jpegPhoto.headers["Content-Type"]!!.startsWith("image/jpeg"))
        val liveId = Regex("\"id\":\"([^\"]+)\"").find(live.bodyAsText())!!.groupValues[1]
        val livePage = client.get("/page/$liveId").bodyAsText()
        assertTrue(livePage.contains("/supplier/experiences/$liveId"))
        assertTrue(livePage.contains("A guide owns this experience"))
        val hiddenGuideEdit = client.post("/supplier/experiences/$liveId") {
            header("Authorization", "Bearer $supplier")
            contentType(ContentType.Application.Json)
            setBody("""{"name":"Reviewed paddle","county":"Cork","description":"A short paddle","lat":51.5,"lng":-9.3}""")
        }
        assertEquals(HttpStatusCode.OK, hiddenGuideEdit.status, hiddenGuideEdit.bodyAsText())
        assertTrue(hiddenGuideEdit.bodyAsText().contains("\"hidden\":\"true\""))
        assertEquals(HttpStatusCode.NotFound, client.get("/page/$liveId").status)
    }

    @Test
    fun expiredSessionIsRejected() = testApplication {
        pointAtSharedDatabase()
        application { module() }
        val email = "expire-${System.nanoTime()}@example.com"
        val signup = client.post("/accounts") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"$email","password":"guest","role":"host"}""")
        }
        assertEquals(HttpStatusCode.OK, signup.status)
        val token = client.signIn(email)
        SharedDatabase.dataSource.connection.use { connection ->
            connection.prepareStatement(
                "update session set expires_at = now() - interval '1 hour' where account_id = (select id from account where email = ?)"
            ).use { statement ->
                statement.setString(1, email)
                assertEquals(1, statement.executeUpdate())
            }
        }
        val stays = client.get("/host/stays") { header("Authorization", "Bearer $token") }
        assertEquals(HttpStatusCode.Unauthorized, stays.status)
        assertEquals(HttpStatusCode.Unauthorized, client.get("/host/stays").status)
    }

    @Test
    fun seededStaysArePublicOnlyWhenTheyPass() = testApplication {
        pointAtSharedDatabase()
        application { module() }
        val stays = client.get("/stays").bodyAsText()
        assertFalse(stays.contains("Kerry glamping 001"))
        assertFalse(stays.contains("Clare bed and breakfast 002"))
        assertFalse(stays.contains("Antrim glamping 004"))
        val published = queryInt(
            """
            select count(*) from stay
            where hidden = false
              and title ~ ' [0-9]{3}${'$'}'
              and title !~ '^Load camp [0-9]+${'$'}'
            """.trimIndent()
        )
        val withheld = queryInt(
            """
            select count(*) from stay
            where hidden = true
              and title ~ ' [0-9]{3}${'$'}'
              and title !~ '^Load camp [0-9]+${'$'}'
            """.trimIndent()
        )
        assertEquals(0, published)
        assertEquals(0, withheld)
        val bad = SharedDatabase.dataSource.connection.use { connection ->
            connection.createStatement().executeQuery(
                """
                select count(*) from stay
                where hidden = false
                  and title ~ ' [0-9]{3}${'$'}'
                  and (
                    image is null
                    or lat is null or lng is null
                    or lat < 51 or lat > 55.5
                    or lng < -11 or lng > -5
                    or title like '%<%' or description like '%<%'
                    or title ilike '%script%' or description ilike '%script%'
                    or coalesce(website, '') <> ''
                  )
                """.trimIndent()
            ).use { rs ->
                rs.next()
                rs.getInt(1)
            }
        }
        assertEquals(0, bad)
        val hash = SharedDatabase.dataSource.connection.use { connection ->
            connection.createStatement().executeQuery(
                "select password_hash from account where email = 'guest@example.com'"
            ).use { rs ->
                rs.next()
                rs.getString(1)
            }
        }
        assertTrue(hash.startsWith("pbkdf2-sha256"))
    }

    @Test
    fun exploreMapFiltersPinsAndIslandCenter() = testApplication {
        pointAtSharedDatabase()
        application { module() }
        val page = client.get("/").bodyAsText()
        assertTrue(page.contains("Your places"))
        assertTrue(page.contains("Other places"))
        assertTrue(page.contains("Places you have stayed"))
        assertTrue(page.contains("Places you could stay"))
        assertTrue(page.contains("You are not signed in."))
        assertTrue(page.contains("#1B4F72"))
        assertTrue(page.contains("#2E7D32"))
        assertTrue(page.contains("#C56A12"))
        assertTrue(page.contains("#9A3412"))
        assertTrue(page.contains("#0F6E8C"))
        assertTrue(page.contains("getCurrentPosition"))
        assertTrue(page.contains("53.4"))
        assertTrue(page.contains("M14 1C7"))
        assertTrue(page.contains("M14 3 L26 24"))
        assertTrue(page.contains("A10 10"))
        assertTrue(page.contains("M4 13 L14 4"))
        assertTrue(page.contains("r=\"12\""))
        assertTrue(page.contains("Supplier experience"))
    }

    @Test
    fun signInAndCreateSlowDown() = testApplication {
        pointAtSharedDatabase()
        environment {
            config = MapApplicationConfig(
                "island.signInLimit" to "3",
                "island.signInIpLimit" to "3",
                "island.createLimit" to "2",
            )
        }
        application { module() }
        val email = "limit-${System.nanoTime()}@example.com"
        val first = client.post("/accounts") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"$email","password":"guest","role":"host"}""")
        }
        assertEquals(HttpStatusCode.OK, first.status)
        val second = client.post("/accounts") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"$email","password":"guest","role":"host"}""")
        }
        assertEquals(HttpStatusCode.Conflict, second.status)
        val third = client.post("/accounts") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"limit-b-${System.nanoTime()}@example.com","password":"guest","role":"host"}""")
        }
        assertEquals(HttpStatusCode.TooManyRequests, third.status)
        repeat(3) {
            val login = client.post("/sessions") {
                contentType(ContentType.Application.Json)
                setBody("""{"email":"guest@example.com","password":"nope"}""")
            }
            assertEquals(HttpStatusCode.Unauthorized, login.status)
        }
        val blocked = client.post("/sessions") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"guest@example.com","password":"nope"}""")
        }
        assertEquals(HttpStatusCode.TooManyRequests, blocked.status)
    }

    @Test
    fun titleDescriptionAndPhotoAreCapped() = testApplication {
        pointAtSharedDatabase()
        application { module() }
        val token = client.signIn("host-002@example.com")
        val tooTitle = client.post("/host/stays") {
            header("Authorization", "Bearer $token")
            contentType(ContentType.Application.Json)
            setBody("""{"kind":"campsite","title":"${"T".repeat(121)}","description":"A pitch","county":"Kerry"}""")
        }
        assertEquals(HttpStatusCode.BadRequest, tooTitle.status)
        assertTrue(tooTitle.bodyAsText().contains("title"))
        val accepted = client.post("/host/stays") {
            header("Authorization", "Bearer $token")
            contentType(ContentType.Application.Json)
            setBody("""{"kind":"campsite","title":"${"T".repeat(120)}","description":"A pitch","county":"Kerry"}""")
        }
        assertEquals(HttpStatusCode.OK, accepted.status)
        val tooBody = client.post("/host/stays") {
            header("Authorization", "Bearer $token")
            contentType(ContentType.Application.Json)
            setBody("""{"kind":"campsite","title":"Short title","description":"${"D".repeat(4001)}","county":"Kerry"}""")
        }
        assertEquals(HttpStatusCode.BadRequest, tooBody.status)
        val raw = ByteArray(1_048_577)
        raw[0] = 0x89.toByte()
        raw[1] = 0x50
        raw[2] = 0x4E
        raw[3] = 0x47
        val b64 = java.util.Base64.getEncoder().encodeToString(raw)
        val tooPhoto = client.post("/host/stays") {
            header("Authorization", "Bearer $token")
            contentType(ContentType.Application.Json)
            setBody("""{"kind":"campsite","title":"Photo cap","description":"A pitch","county":"Kerry","imageBase64":"$b64"}""")
        }
        assertEquals(HttpStatusCode.BadRequest, tooPhoto.status)
        assertTrue(tooPhoto.bodyAsText().contains("photo"))
    }

    @Test
    fun adminReviewPublishesOrRejects() = testApplication {
        pointAtSharedDatabase()
        application { module() }
        val page = client.get("/admin/review").bodyAsText()
        assertTrue(page.contains("Approve"))
        assertTrue(page.contains("Reject"))
        assertTrue(page.contains("Reject requires a short reason."))
        assertTrue(client.get("/admin").bodyAsText().contains("Review"))
        assertEquals(HttpStatusCode.Unauthorized, client.get("/admin/review/next").status)
        val host = client.signIn("host-003@example.com")
        val guest = client.signIn("guest@example.com")
        assertEquals(HttpStatusCode.Forbidden, client.get("/admin/review/next") {
            header("Authorization", "Bearer $guest")
        }.status)
        val admin = client.signIn("tezball86@gmail.com")
        val next = client.get("/admin/review/next") { header("Authorization", "Bearer $admin") }
        assertEquals(HttpStatusCode.OK, next.status)
        assertFalse(next.bodyAsText().contains("Kerry glamping"))
        assertFalse(next.bodyAsText().contains("Load camp"))
        assertFalse(next.bodyAsText().contains("Connemara coast bike"))
        assertFalse(next.bodyAsText().contains("Rathlin boat crossing"))
        assertEquals(
            0,
            queryInt(
                """
                select count(*) from stay
                where title in ('Kerry glamping 001', 'Clare bed and breakfast 002', 'Antrim glamping 004')
                  and hidden = true and review_reason is null and saved_by_person = true
                """.trimIndent()
            )
        )
        assertEquals(
            0,
            queryInt(
                """
                select count(*) from experience
                where id in ('kayak-cork', 'bike-galway', 'boat-antrim')
                  and hidden = true and review_reason is null and saved_by_person = true
                """.trimIndent()
            )
        )
        val png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
        val title = "Queue Camp ${System.nanoTime()}"
        val created = client.post("/host/stays") {
            header("Authorization", "Bearer $host")
            contentType(ContentType.Application.Json)
            setBody("""{"kind":"campsite","title":"$title","description":"A pitch","county":"Kerry","lat":1.0,"lng":1.0,"imageBase64":"$png"}""")
        }
        assertEquals(HttpStatusCode.OK, created.status)
        assertTrue(created.bodyAsText().contains("\"hidden\":\"true\""))
        val id = Regex("\"id\":\"(\\d+)\"").find(created.bodyAsText())!!.groupValues[1]
        assertEquals(HttpStatusCode.NotFound, client.get("/listings/$id/photo").status)
        val hiddenPhoto = client.get("/admin/review/photo/stay/$id") { header("Authorization", "Bearer $admin") }
        assertEquals(HttpStatusCode.OK, hiddenPhoto.status)
        assertEquals(HttpStatusCode.Forbidden, client.post("/admin/review/stay/$id/approve") {
            header("Authorization", "Bearer $guest")
        }.status)
        val blank = client.post("/admin/review/stay/$id/reject") {
            header("Authorization", "Bearer $admin")
            contentType(ContentType.Application.Json)
            setBody("""{"reason":"  "}""")
        }
        assertEquals(HttpStatusCode.BadRequest, blank.status)
        val approved = client.post("/admin/review/stay/$id/approve") { header("Authorization", "Bearer $admin") }
        assertEquals(HttpStatusCode.OK, approved.status)
        assertTrue(client.get("/stays").bodyAsText().contains(title))
        assertEquals(HttpStatusCode.OK, client.get("/listings/$id/photo").status)
        val editedTitle = "Queue Camp Edited ${System.nanoTime()}"
        val edited = client.post("/host/stays/$id") {
            header("Authorization", "Bearer $host")
            contentType(ContentType.Application.Json)
            setBody("""{"kind":"campsite","title":"$editedTitle","description":"A pitch","county":"Kerry"}""")
        }
        assertEquals(HttpStatusCode.OK, edited.status)
        assertTrue(edited.bodyAsText().contains("\"hidden\":\"true\""))
        assertFalse(client.get("/stays").bodyAsText().contains(editedTitle))
        val rejectTitle = "Reject Camp ${System.nanoTime()}"
        val rejectedStay = client.post("/host/stays") {
            header("Authorization", "Bearer $host")
            contentType(ContentType.Application.Json)
            setBody("""{"kind":"campsite","title":"$rejectTitle","description":"A pitch","county":"Kerry"}""")
        }
        val rejectId = Regex("\"id\":\"(\\d+)\"").find(rejectedStay.bodyAsText())!!.groupValues[1]
        val rejected = client.post("/admin/review/stay/$rejectId/reject") {
            header("Authorization", "Bearer $admin")
            contentType(ContentType.Application.Json)
            setBody("""{"reason":"Not a place to stay"}""")
        }
        assertEquals(HttpStatusCode.OK, rejected.status)
        assertFalse(client.get("/stays").bodyAsText().contains(rejectTitle))
        assertTrue(client.get("/host/stays") { header("Authorization", "Bearer $host") }.bodyAsText().contains("Not a place to stay"))
        val loadTitle = "Load camp ${System.nanoTime()}"
        val load = client.post("/host/stays") {
            header("Authorization", "Bearer $host")
            contentType(ContentType.Application.Json)
            setBody("""{"kind":"campsite","title":"$loadTitle","description":"A pitch","county":"Kerry"}""")
        }
        assertEquals(HttpStatusCode.OK, load.status, load.bodyAsText())
        val loadId = Regex("\"id\":\"(\\d+)\"").find(load.bodyAsText())!!.groupValues[1]
        assertEquals(0, queryInt("select count(*) from stay where id = $loadId and saved_by_person = true"))
        assertEquals(1, queryInt("select count(*) from stay where id = $loadId and hidden = true and saved_by_person = false"))
        val personId = Regex("\"id\":\"(\\d+)\"").find(created.bodyAsText())!!.groupValues[1]
        assertEquals(
            1,
            queryInt(
                """
                select count(*) from stay
                where id = $personId and saved_by_person = true
                """.trimIndent()
            )
        )
        val deck = client.get("/admin/review/next") { header("Authorization", "Bearer $admin") }
        assertFalse(deck.bodyAsText().contains(loadTitle))
        assertFalse(deck.bodyAsText().contains("Antrim glamping 004"))
    }

    @Test
    fun newSupplierIsReviewedByTheAdmin() = testApplication {
        pointAtSharedDatabase()
        application { module() }
        val admin = client.signIn("tezball86@gmail.com")
        val email = "new-supplier-${System.nanoTime()}@example.com"
        val signup = client.post("/accounts") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"$email","password":"guest","role":"supplier"}""")
        }
        assertEquals(HttpStatusCode.OK, signup.status)
        val supplierId = accountField(email, "id")
        assertFalse(accountApproved(email))
        val blank = client.post("/admin/review/supplier/$supplierId/reject") {
            header("Authorization", "Bearer $admin")
            contentType(ContentType.Application.Json)
            setBody("""{"reason":""}""")
        }
        assertEquals(HttpStatusCode.BadRequest, blank.status)
        val rejected = client.post("/admin/review/supplier/$supplierId/reject") {
            header("Authorization", "Bearer $admin")
            contentType(ContentType.Application.Json)
            setBody("""{"reason":"Not a supplier we can publish"}""")
        }
        assertEquals(HttpStatusCode.OK, rejected.status)
        assertEquals("Not a supplier we can publish", accountField(email, "review_reason"))
        assertFalse(accountApproved(email))
        val email2 = "ok-supplier-${System.nanoTime()}@example.com"
        client.post("/accounts") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"$email2","password":"guest","role":"supplier"}""")
        }
        val id2 = accountField(email2, "id")
        val approved = client.post("/admin/review/supplier/$id2/approve") {
            header("Authorization", "Bearer $admin")
        }
        assertEquals(HttpStatusCode.OK, approved.status)
        assertTrue(accountApproved(email2))
    }

    @Test
    fun placeImagesStopAtFive() = testApplication {
        pointAtSharedDatabase()
        application { module() }
        val admin = client.signIn("tezball86@gmail.com")
        val png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
        val jpeg = "/9j/4AAQSkZJRgABAQAAAQABAAD/2Q=="
        val sixName = "Six Image Point ${System.nanoTime()}"
        val six = (1..6).joinToString(",") { "\"$png\"" }
        val tooMany = client.post("/admin/places") {
            header("Authorization", "Bearer $admin")
            contentType(ContentType.Application.Json)
            setBody("""{"name":"$sixName","county":"Clare","lat":52.9,"lng":-9.4,"images":[$six]}""")
        }
        assertEquals(HttpStatusCode.BadRequest, tooMany.status)
        assertTrue(tooMany.bodyAsText().contains("five"))
        assertFalse(client.get("/places").bodyAsText().contains(sixName))
        val badName = "Bad Image Point ${System.nanoTime()}"
        val bad = client.post("/admin/places") {
            header("Authorization", "Bearer $admin")
            contentType(ContentType.Application.Json)
            setBody("""{"name":"$badName","county":"Clare","lat":52.9,"lng":-9.4,"images":["aGVsbG8="]}""")
        }
        assertEquals(HttpStatusCode.BadRequest, bad.status)
        assertTrue(bad.bodyAsText().contains("PNG or JPEG only"))
        val placeName = "Photo Point ${System.nanoTime()}"
        val created = client.post("/admin/places") {
            header("Authorization", "Bearer $admin")
            contentType(ContentType.Application.Json)
            setBody("""{"name":"$placeName","county":"Clare","lat":52.9,"lng":-9.4,"images":["$png","$jpeg"]}""")
        }
        assertEquals(HttpStatusCode.OK, created.status)
        val id = Regex("\"id\":\"([^\"]+)\"").find(created.bodyAsText())!!.groupValues[1]
        val placePage = client.get("/page/$id").bodyAsText()
        assertTrue(placePage.contains("/listings/$id/images/0"))
        assertTrue(placePage.contains("/listings/$id/images/1"))
        assertEquals(0x89.toByte(), client.get("/listings/$id/images/0").bodyAsBytes()[0])
        assertTrue(client.get("/listings/$id/images/1").headers["Content-Type"]!!.startsWith("image/jpeg"))
        val more = (1..3).joinToString(",") { "\"$png\"" }
        val added = client.post("/admin/places/$id/images") {
            header("Authorization", "Bearer $admin")
            contentType(ContentType.Application.Json)
            setBody("""{"images":[$more]}""")
        }
        assertEquals(HttpStatusCode.OK, added.status)
        assertTrue(added.bodyAsText().contains("\"count\":\"5\""))
        val sixth = client.post("/admin/places/$id/images") {
            header("Authorization", "Bearer $admin")
            contentType(ContentType.Application.Json)
            setBody("""{"images":["$png"]}""")
        }
        assertEquals(HttpStatusCode.BadRequest, sixth.status)
        assertTrue(sixth.bodyAsText().contains("five"))
        assertEquals(HttpStatusCode.OK, client.get("/listings/$id/images/4").status)
        assertEquals(HttpStatusCode.NotFound, client.get("/listings/$id/images/5").status)
        val guest = client.signIn("guest@example.com")
        val denied = client.post("/admin/places/$id/images") {
            header("Authorization", "Bearer $guest")
            contentType(ContentType.Application.Json)
            setBody("""{"images":["$png"]}""")
        }
        assertEquals(HttpStatusCode.Forbidden, denied.status)
        val html = client.get("/admin").bodyAsText()
        assertTrue(html.contains("Up to five PNG or JPEG images."))
        assertTrue(html.contains("multiple"))
        assertTrue(html.contains("Add images"))
    }

}

private suspend fun HttpClient.signIn(email: String, password: String = "guest"): String {
    val login = post("/sessions") {
        contentType(ContentType.Application.Json)
        setBody("""{"email":"$email","password":"$password"}""")
    }
    assertEquals(HttpStatusCode.OK, login.status, login.bodyAsText())
    return Regex("\"token\":\"([^\"]+)\"").find(login.bodyAsText())!!.groupValues[1]
}

private fun accountApproved(email: String): Boolean {
    return SharedDatabase.dataSource.connection.use { connection ->
        connection.prepareStatement("select supplier_approved from account where email = ?").use { statement ->
            statement.setString(1, email)
            statement.executeQuery().use { rs ->
                rs.next()
                rs.getBoolean(1)
            }
        }
    }
}

private fun accountField(email: String, column: String): String {
    return SharedDatabase.dataSource.connection.use { connection ->
        connection.prepareStatement("select $column from account where email = ?").use { statement ->
            statement.setString(1, email)
            statement.executeQuery().use { rs ->
                rs.next()
                rs.getString(1)
            }
        }
    }
}

private fun queryInt(sql: String): Int {
    return SharedDatabase.dataSource.connection.use { connection ->
        connection.createStatement().executeQuery(sql).use { rs ->
            rs.next()
            rs.getInt(1)
        }
    }
}

private fun pointAtSharedDatabase() {
    val db = SharedDatabase.container
    System.setProperty("jdbc.url", db.jdbcUrl)
    System.setProperty("jdbc.user", db.username)
    System.setProperty("jdbc.password", db.password)
}
