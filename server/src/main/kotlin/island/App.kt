package island

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.Application
import io.ktor.server.application.ApplicationCall
import io.ktor.server.application.call
import io.ktor.server.application.install
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.response.respondBytes
import io.ktor.server.response.respondText
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.routing
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import org.flywaydb.core.Flyway
import java.math.BigDecimal
import java.security.MessageDigest
import java.security.SecureRandom
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.Timestamp
import java.sql.Types
import java.time.Instant
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.util.Base64
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec
import javax.sql.DataSource

private const val ADMIN_EMAIL = "tezball86@gmail.com"
private const val SESSION_HOURS = 12L
private const val TITLE_MAX = 120
private const val DESCRIPTION_MAX = 4000
private const val PHOTO_MAX_BYTES = 1_048_576
private const val PHOTO_TEXT_MAX = 1_500_000
private const val REASON_MAX = 200
private const val PBKDF2_ITERATIONS = 100_000

private val random = SecureRandom()

fun main() {
    val port = System.getenv("PORT")?.toInt() ?: 8080
    embeddedServer(Netty, port = port, module = Application::module).start(wait = true)
}

fun Application.module() {
    val ds = dataSource()
    Flyway.configure().dataSource(ds).locations("classpath:db/migration").load().migrate()
    val commit = System.getenv("GIT_COMMIT") ?: "unknown"
    println("island started gitCommit=$commit")
    val signInByEmail = HitWindow(tuned("island.signInLimit", "SIGN_IN_LIMIT", 120), 60_000)
    val signInByIp = HitWindow(tuned("island.signInIpLimit", "SIGN_IN_IP_LIMIT", 400), 60_000)
    val creates = HitWindow(tuned("island.createLimit", "CREATE_LIMIT", 20), 60_000)
    install(ContentNegotiation) { json() }
    routing {
        get("/health") { call.respond(mapOf("ok" to "true")) }
        get("/info") { call.respond(mapOf("gitCommit" to (System.getenv("GIT_COMMIT") ?: "unknown"))) }
        get("/metrics") {
            val safe = (System.getenv("GIT_COMMIT") ?: "unknown").replace(Regex("[^A-Za-z0-9_.-]"), "_")
            call.respondText(
                "island_up{git_commit=\"$safe\"} 1\n",
                ContentType.parse("text/plain; version=0.0.4"),
            )
        }
        get("/") { call.respondText(phonePage(), ContentType.Text.Html) }
        get("/host") { call.respondText(hostPage(), ContentType.Text.Html) }
        get("/supplier") { call.respondText(supplierPage(), ContentType.Text.Html) }
        get("/admin") { call.respondText(adminPage(), ContentType.Text.Html) }
        get("/admin/review") { call.respondText(adminReviewPage(), ContentType.Text.Html) }
        get("/places") { call.respond(ds.connection.use { it.places() }) }
        get("/stays") { call.respond(ds.connection.use { it.stays(publicOnly = true) }) }
        get("/experiences") { call.respond(ds.connection.use { it.experiences() }) }
        get("/listings/{id}") {
            val id = call.parameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val row = ds.connection.use { it.listing(id) }
            if (row == null) call.respond(HttpStatusCode.NotFound) else call.respond(row)
        }
        get("/listings/{id}/photo") {
            val id = call.parameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val photo = ds.connection.use { it.publicPhoto(id) }
            if (photo == null) call.respond(HttpStatusCode.NotFound)
            else call.respondBytes(photo.first, ContentType.parse(photo.second))
        }
        get("/listings/{id}/images/{index}") {
            val id = call.parameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val index = call.parameters["index"]?.toIntOrNull()
            if (index == null) {
                call.respond(HttpStatusCode.BadRequest)
                return@get
            }
            val photo = ds.connection.use { it.placeImage(id, index) }
            if (photo == null) call.respond(HttpStatusCode.NotFound)
            else call.respondBytes(photo.first, ContentType.parse(photo.second))
        }
        get("/page/{id}") {
            val id = call.parameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val row = ds.connection.use { it.listing(id) }
            if (row == null) call.respond(HttpStatusCode.NotFound)
            else call.respondText(listingPage(row), ContentType.Text.Html)
        }
        get("/me/places") {
            val account = call.account(ds) ?: return@get
            call.respond(ds.connection.use { it.placesFor(account.id) })
        }
        get("/me/visits") {
            val account = call.account(ds) ?: return@get
            call.respond(ds.connection.use { it.visitsFor(account.id) })
        }
        post("/accounts") {
            if (!creates.allow("ip:" + call.clientIp())) {
                call.slowDown()
                return@post
            }
            val body = call.receive<Signup>()
            if (body.role != "host" && body.role != "supplier") {
                call.respond(HttpStatusCode.BadRequest)
                return@post
            }
            val created = ds.connection.use { it.insertAccount(body) }
            if (created == null) call.respond(HttpStatusCode.Conflict) else call.respond(created)
        }
        post("/sessions/google") {
            if (!signInByIp.allow(call.clientIp())) {
                call.slowDown()
                return@post
            }
            val clientId = System.getenv("GOOGLE_CLIENT_ID")?.trim().orEmpty()
            if (clientId.isEmpty()) {
                call.respond(HttpStatusCode.ServiceUnavailable, mapOf("error" to "google client is not configured"))
                return@post
            }
            val body = call.receive<GoogleLogin>()
            val email = googleEmail(body.idToken, clientId)
            if (email == null) {
                call.respond(HttpStatusCode.Unauthorized)
                return@post
            }
            val session = ds.connection.use { connection ->
                connection.openSession(connection.upsertGoogle(email))
            }
            call.respond(session)
        }
        post("/sessions") {
            val body = call.receive<Login>()
            val email = body.email.trim().lowercase()
            if (!signInByEmail.allow(email) || !signInByIp.allow(call.clientIp())) {
                call.slowDown()
                return@post
            }
            val account = ds.connection.use { it.login(body.email, body.password) }
            if (account == null) call.respond(HttpStatusCode.Unauthorized)
            else call.respond(ds.connection.use { it.openSession(account) })
        }
        post("/visits") {
            val account = call.account(ds) ?: return@post
            val body = call.receive<VisitMark>()
            ds.connection.use { it.markVisit(account.id, body.placeId) }
            call.respond(HttpStatusCode.NoContent)
        }
        post("/supplier/experiences") {
            val account = call.supplier(ds) ?: return@post
            if (!creates.allow("acct:" + account.id)) {
                call.slowDown()
                return@post
            }
            val body = call.receive<ExperienceDraft>()
            if (call.rejectSize(body.name, body.description, body.imageBase64)) return@post
            val id = ds.connection.use { it.insertExperience(account.id, body) }
            call.respond(mapOf("id" to id, "hidden" to (!passesExperienceReview(body)).toString()))
        }
        post("/supplier/experiences/{id}") {
            val account = call.supplier(ds) ?: return@post
            val id = call.parameters["id"] ?: return@post call.respond(HttpStatusCode.BadRequest)
            val body = call.receive<ExperienceDraft>()
            if (call.rejectSize(body.name, body.description, body.imageBase64)) return@post
            val updated = ds.connection.use { it.updateExperience(account.id, id, body) }
            if (!updated) call.respond(HttpStatusCode.NotFound)
            else call.respond(mapOf("id" to id, "hidden" to (!passesExperienceReview(body)).toString()))
        }
        get("/host/stays") {
            val account = call.host(ds) ?: return@get
            call.respond(ds.connection.use { it.staysForHost(account.id) })
        }
        post("/host/stays") {
            val account = call.host(ds) ?: return@post
            if (!creates.allow("acct:" + account.id)) {
                call.slowDown()
                return@post
            }
            val body = call.receive<StayDraft>()
            if (call.rejectSize(body.title, body.description, body.imageBase64)) return@post
            val id = ds.connection.use { it.insertStay(account.id, body) }
            call.respond(mapOf("id" to id.toString(), "hidden" to (!passesStayReview(body)).toString()))
        }
        post("/host/stays/{id}") {
            val account = call.host(ds) ?: return@post
            val id = call.parameters["id"]?.toLongOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest)
                return@post
            }
            val body = call.receive<StayDraft>()
            if (call.rejectSize(body.title, body.description, body.imageBase64)) return@post
            val updated = ds.connection.use { it.updateStay(account.id, id, body) }
            if (!updated) call.respond(HttpStatusCode.NotFound)
            else call.respond(mapOf("id" to id.toString(), "hidden" to (!passesStayReview(body)).toString()))
        }
        post("/admin/places") {
            val account = call.admin(ds) ?: return@post
            if (!creates.allow("acct:" + account.id)) {
                call.slowDown()
                return@post
            }
            val body = call.receive<PlaceDraft>()
            val photos = checkedImages(body.images)
            if (photos.error != null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to photos.error))
                return@post
            }
            val id = ds.connection.use { it.insertPlace(account.id, body, photos.photos) }
            call.respond(mapOf("id" to id))
        }
        post("/admin/places/{id}/images") {
            val account = call.admin(ds) ?: return@post
            if (!creates.allow("acct:" + account.id)) {
                call.slowDown()
                return@post
            }
            val id = call.parameters["id"] ?: return@post call.respond(HttpStatusCode.BadRequest)
            val body = call.receive<PlaceImages>()
            val photos = checkedImages(body.images)
            if (photos.error != null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to photos.error))
                return@post
            }
            val count = ds.connection.use { it.addPlaceImages(id, photos.photos) }
            when (count) {
                null -> call.respond(HttpStatusCode.NotFound)
                -1 -> call.respond(HttpStatusCode.BadRequest, mapOf("error" to "A place can have five images."))
                else -> call.respond(mapOf("count" to count.toString()))
            }
        }
        get("/admin/hosts") {
            if (call.admin(ds) == null) return@get
            call.respond(ds.connection.use { it.hosts() })
        }
        get("/admin/listings") {
            if (call.admin(ds) == null) return@get
            call.respond(ds.connection.use { it.stays(publicOnly = false) })
        }
        get("/admin/review/next") {
            if (call.admin(ds) == null) return@get
            call.respond(ds.connection.use { it.nextReview() } ?: ReviewCard(empty = true))
        }
        get("/admin/review/photo/{kind}/{id}") {
            if (call.admin(ds) == null) return@get
            val kind = call.parameters["kind"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val id = call.parameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val photo = ds.connection.use { it.reviewPhoto(kind, id) }
            if (photo == null) call.respond(HttpStatusCode.NotFound)
            else call.respondBytes(photo.first, ContentType.parse(photo.second))
        }
        post("/admin/review/stay/{id}/approve") { call.decideStay(ds, approve = true) }
        post("/admin/review/stay/{id}/reject") { call.decideStay(ds, approve = false) }
        post("/admin/review/experience/{id}/approve") { call.decideExperience(ds, approve = true) }
        post("/admin/review/experience/{id}/reject") { call.decideExperience(ds, approve = false) }
        post("/admin/review/supplier/{id}/approve") { call.decideSupplier(ds, approve = true) }
        post("/admin/review/supplier/{id}/reject") { call.decideSupplier(ds, approve = false) }
    }
}

class HitWindow(private val limit: Int, private val windowMillis: Long) {
    private val hits = HashMap<String, ArrayDeque<Long>>()

    fun allow(key: String, now: Long = System.currentTimeMillis()): Boolean {
        synchronized(hits) {
            val queue = hits.getOrPut(key) { ArrayDeque() }
            val cutoff = now - windowMillis
            while (queue.isNotEmpty() && queue.first() <= cutoff) queue.removeFirst()
            if (queue.size >= limit) return false
            queue.addLast(now)
            return true
        }
    }
}

private fun Application.tuned(name: String, envName: String, default: Int): Int {
    environment.config.propertyOrNull(name)?.getString()?.toIntOrNull()?.let { return it }
    System.getenv(envName)?.toIntOrNull()?.let { return it }
    return default
}

private fun dataSource(): DataSource {
    val config = HikariConfig()
    config.jdbcUrl = System.getProperty("jdbc.url") ?: System.getenv("JDBC_URL") ?: "jdbc:postgresql://localhost:5432/island"
    config.username = System.getProperty("jdbc.user") ?: System.getenv("JDBC_USER") ?: "island"
    config.password = System.getProperty("jdbc.password") ?: System.getenv("JDBC_PASSWORD") ?: "island"
    config.maximumPoolSize = 5
    return HikariDataSource(config)
}

private fun ApplicationCall.clientIp(): String {
    val host = request.local.remoteHost
    return if (host.isBlank()) "unknown" else host
}

private suspend fun ApplicationCall.slowDown() {
    respond(HttpStatusCode.TooManyRequests, mapOf("error" to "slow down"))
}

private suspend fun ApplicationCall.rejectSize(title: String, description: String, imageBase64: String?): Boolean {
    val problem = sizeProblem(title, description, imageBase64) ?: return false
    respond(HttpStatusCode.BadRequest, mapOf("error" to problem))
    return true
}

private fun sizeProblem(title: String, description: String, imageBase64: String?): String? {
    if (title.length > TITLE_MAX) return "title is too long"
    if (description.length > DESCRIPTION_MAX) return "description is too long"
    val raw = imageBase64?.trim().orEmpty()
    if (raw.length > PHOTO_TEXT_MAX) return "photo is too big"
    if (raw.isEmpty()) return null
    val bytes = try {
        Base64.getDecoder().decode(raw)
    } catch (_: IllegalArgumentException) {
        return null
    }
    if (bytes.size > PHOTO_MAX_BYTES) return "photo is too big"
    return null
}

private suspend fun ApplicationCall.account(ds: DataSource): Account? {
    val header = request.headers["Authorization"]?.removePrefix("Bearer ")?.trim()
    if (header.isNullOrBlank()) {
        respond(HttpStatusCode.Unauthorized)
        return null
    }
    val account = ds.connection.use { it.accountBySession(header) }
    if (account == null) respond(HttpStatusCode.Unauthorized)
    return account
}

private suspend fun ApplicationCall.host(ds: DataSource): Account? {
    val account = account(ds) ?: return null
    if (account.role != "host") {
        respond(HttpStatusCode.Forbidden)
        return null
    }
    return account
}

private suspend fun ApplicationCall.supplier(ds: DataSource): Account? {
    val account = account(ds) ?: return null
    if (account.role != "supplier") {
        respond(HttpStatusCode.Forbidden)
        return null
    }
    return account
}

private suspend fun ApplicationCall.admin(ds: DataSource): Account? {
    val account = account(ds) ?: return null
    if (account.email != ADMIN_EMAIL) {
        respond(HttpStatusCode.Forbidden)
        return null
    }
    return account
}

private suspend fun ApplicationCall.decideStay(ds: DataSource, approve: Boolean) {
    if (admin(ds) == null) return
    val id = parameters["id"]?.toLongOrNull()
    if (id == null) {
        respond(HttpStatusCode.BadRequest)
        return
    }
    val ok = if (approve) {
        ds.connection.use { it.publishStay(id) }
    } else {
        val reason = shortReason(receive<ReviewDecision>().reason)
        if (reason == null) {
            respond(HttpStatusCode.BadRequest, mapOf("error" to "A short reason is required."))
            return
        }
        ds.connection.use { it.rejectStay(id, reason) }
    }
    if (!ok) respond(HttpStatusCode.NotFound) else respond(mapOf("ok" to "true"))
}

private suspend fun ApplicationCall.decideExperience(ds: DataSource, approve: Boolean) {
    if (admin(ds) == null) return
    val id = parameters["id"]
    if (id.isNullOrBlank()) {
        respond(HttpStatusCode.BadRequest)
        return
    }
    val ok = if (approve) {
        ds.connection.use { it.publishExperience(id) }
    } else {
        val reason = shortReason(receive<ReviewDecision>().reason)
        if (reason == null) {
            respond(HttpStatusCode.BadRequest, mapOf("error" to "A short reason is required."))
            return
        }
        ds.connection.use { it.rejectExperience(id, reason) }
    }
    if (!ok) respond(HttpStatusCode.NotFound) else respond(mapOf("ok" to "true"))
}

private suspend fun ApplicationCall.decideSupplier(ds: DataSource, approve: Boolean) {
    if (admin(ds) == null) return
    val id = parameters["id"]?.toLongOrNull()
    if (id == null) {
        respond(HttpStatusCode.BadRequest)
        return
    }
    val ok = if (approve) {
        ds.connection.use { it.publishSupplier(id) }
    } else {
        val reason = shortReason(receive<ReviewDecision>().reason)
        if (reason == null) {
            respond(HttpStatusCode.BadRequest, mapOf("error" to "A short reason is required."))
            return
        }
        ds.connection.use { it.rejectSupplier(id, reason) }
    }
    if (!ok) respond(HttpStatusCode.NotFound) else respond(mapOf("ok" to "true"))
}

private fun shortReason(raw: String?): String? {
    val reason = raw?.trim().orEmpty()
    if (reason.isEmpty() || reason.length > REASON_MAX) return null
    return reason
}

private fun sha256(value: String): String {
    val digest = MessageDigest.getInstance("SHA-256").digest(value.toByteArray())
    return digest.joinToString("") { "%02x".format(it) }
}

private fun randomToken(): String {
    val bytes = ByteArray(32)
    random.nextBytes(bytes)
    return bytes.joinToString("") { "%02x".format(it) }
}

private fun hashPassword(password: String): String {
    val salt = ByteArray(16)
    random.nextBytes(salt)
    val hash = pbkdf2(password, salt, PBKDF2_ITERATIONS)
    return listOf("pbkdf2-sha256", PBKDF2_ITERATIONS.toString(), b64(salt), b64(hash)).joinToString("$")
}

private fun verifyPassword(password: String, stored: String): Boolean {
    val parts = stored.split('$')
    if (parts.size != 4 || parts[0] != "pbkdf2-sha256") return false
    val iterations = parts[1].toIntOrNull() ?: return false
    if (iterations !in 50_000..200_000) return false
    val salt = try {
        Base64.getDecoder().decode(parts[2])
    } catch (_: IllegalArgumentException) {
        return false
    }
    val expected = try {
        Base64.getDecoder().decode(parts[3])
    } catch (_: IllegalArgumentException) {
        return false
    }
    if (salt.isEmpty() || salt.size > 64 || expected.size != 32) return false
    val actual = pbkdf2(password, salt, iterations)
    return MessageDigest.isEqual(actual, expected)
}

private fun pbkdf2(password: String, salt: ByteArray, iterations: Int): ByteArray {
    val spec = PBEKeySpec(password.toCharArray(), salt, iterations, 256)
    return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).encoded
}

private fun b64(bytes: ByteArray): String = Base64.getEncoder().encodeToString(bytes)

private fun photoOf(raw: String?): Pair<ByteArray, String>? {
    val text = raw?.trim().orEmpty()
    if (text.isEmpty() || text.length > PHOTO_TEXT_MAX) return null
    val bytes = try {
        Base64.getDecoder().decode(text)
    } catch (_: IllegalArgumentException) {
        return null
    }
    if (bytes.size > PHOTO_MAX_BYTES) return null
    val type = imageType(bytes) ?: return null
    return bytes to type
}

private fun imageType(bytes: ByteArray): String? {
    val png = bytes.size > 8 && bytes[0] == 0x89.toByte() && bytes[1] == 0x50.toByte()
    if (png) return "image/png"
    val jpeg = bytes.size > 3 && bytes[0] == 0xFF.toByte() && bytes[1] == 0xD8.toByte()
    if (jpeg) return "image/jpeg"
    return null
}

private fun PreparedStatement.bindPhoto(index: Int, imageBase64: String?) {
    val photo = photoOf(imageBase64)
    if (photo == null) {
        setNull(index, Types.BINARY)
        setNull(index + 1, Types.VARCHAR)
    } else {
        setBytes(index, photo.first)
        setString(index + 1, photo.second)
    }
}

private fun PreparedStatement.bindDouble(index: Int, value: Double?) {
    if (value == null) setNull(index, Types.DOUBLE) else setDouble(index, value)
}

private fun Connection.places(): List<PlaceRow> {
    val rows = mutableListOf<PlaceRow>()
    createStatement().use { st ->
        st.executeQuery("select id, name, county, country, lat, lng from place order by name").use { rs ->
            while (rs.next()) rows += placeRow(rs)
        }
    }
    return rows
}

private fun Connection.placesFor(accountId: Long): List<PlaceRow> {
    val rows = mutableListOf<PlaceRow>()
    prepareStatement("select id, name, county, country, lat, lng from place where account_id = ? order by name").use { ps ->
        ps.setLong(1, accountId)
        ps.executeQuery().use { rs ->
            while (rs.next()) rows += placeRow(rs)
        }
    }
    return rows
}

private fun placeRow(rs: java.sql.ResultSet): PlaceRow {
    val lat = rs.getDouble(5).let { if (rs.wasNull()) null else it }
    val lng = rs.getDouble(6).let { if (rs.wasNull()) null else it }
    return PlaceRow(rs.getString(1), rs.getString(2), rs.getString(3), rs.getString(4), lat, lng)
}

private fun Connection.experiences(): List<ExperienceRow> {
    val rows = mutableListOf<ExperienceRow>()
    createStatement().use { st ->
        st.executeQuery("select id, name, county, lat, lng from experience where hidden = false order by name").use { rs ->
            while (rs.next()) {
                val lat = rs.getDouble(4).let { if (rs.wasNull()) null else it }
                val lng = rs.getDouble(5).let { if (rs.wasNull()) null else it }
                rows += ExperienceRow(rs.getString(1), rs.getString(2), rs.getString(3), lat, lng)
            }
        }
    }
    return rows
}

private fun Connection.hosts(): List<HostRow> {
    val rows = mutableListOf<HostRow>()
    createStatement().use { st ->
        st.executeQuery(
            "select a.email, count(s.id) from account a left join stay s on s.host_id = a.id where a.role = 'host' group by a.email order by a.email"
        ).use { rs ->
            while (rs.next()) rows += HostRow(rs.getString(1), rs.getLong(2))
        }
    }
    return rows
}

private fun Connection.visitsFor(accountId: Long): List<VisitRow> {
    val rows = mutableListOf<VisitRow>()
    prepareStatement("select place_id from visit where account_id = ? order by place_id").use { ps ->
        ps.setLong(1, accountId)
        ps.executeQuery().use { rs ->
            while (rs.next()) rows += VisitRow(rs.getString(1))
        }
    }
    return rows
}

private fun Connection.staysForHost(hostId: Long): List<StayRow> {
    val rows = mutableListOf<StayRow>()
    prepareStatement(
        "select id, title, kind, county, hidden, lat, lng, review_reason from stay where host_id = ? order by id"
    ).use { ps ->
        ps.setLong(1, hostId)
        ps.executeQuery().use { rs ->
            while (rs.next()) rows += stayRow(rs)
        }
    }
    return rows
}

private fun Connection.stays(publicOnly: Boolean): List<StayRow> {
    val rows = mutableListOf<StayRow>()
    val where = if (publicOnly) "where hidden = false" else ""
    createStatement().use { st ->
        st.executeQuery(
            "select id, title, kind, county, hidden, lat, lng, review_reason from stay $where order by title"
        ).use { rs ->
            while (rs.next()) rows += stayRow(rs)
        }
    }
    return rows
}

private fun stayRow(rs: java.sql.ResultSet): StayRow {
    val lat = rs.getDouble(6).let { if (rs.wasNull()) null else it }
    val lng = rs.getDouble(7).let { if (rs.wasNull()) null else it }
    return StayRow(
        rs.getLong(1),
        rs.getString(2),
        rs.getString(3),
        rs.getString(4),
        rs.getBoolean(5),
        lat,
        lng,
        rs.getString(8),
    )
}

private fun Connection.listing(id: String): Listing? {
    val place = prepareStatement("select id, name, county, description from place where id = ?").use { ps ->
        ps.setString(1, id)
        ps.executeQuery().use { rs ->
            if (!rs.next()) null
            else Listing(rs.getString(1), "place", rs.getString(2), rs.getString(3), rs.getString(4), emptyList(), false)
        }
    }
    if (place != null) return place.copy(imageCount = placeImageCount(place.id))
    val stayId = id.toLongOrNull()
    if (stayId != null) {
        val stay = prepareStatement(
            "select title, kind, county, description, hidden, (image is not null) from stay where id = ?"
        ).use { ps ->
            ps.setLong(1, stayId)
            ps.executeQuery().use { rs ->
                if (!rs.next() || rs.getBoolean(5)) null
                else Listing(stayId.toString(), rs.getString(2), rs.getString(1), rs.getString(3), rs.getString(4), emptyList(), rs.getBoolean(6))
            }
        } ?: return null
        return stay.copy(lots = lotsFor(stayId))
    }
    prepareStatement(
        "select id, name, county, description, hidden, (image is not null) from experience where id = ?"
    ).use { ps ->
        ps.setString(1, id)
        ps.executeQuery().use { rs ->
            if (!rs.next() || rs.getBoolean(5)) return null
            return Listing(rs.getString(1), "experience", rs.getString(2), rs.getString(3), rs.getString(4), emptyList(), rs.getBoolean(6))
        }
    }
}

private fun Connection.lotsFor(stayId: Long): List<LotRow> {
    val lots = mutableListOf<LotRow>()
    prepareStatement("select name, sleeps, price_eur from lot where stay_id = ? order by id").use { ps ->
        ps.setLong(1, stayId)
        ps.executeQuery().use { rs ->
            while (rs.next()) lots += LotRow(rs.getString(1), rs.getInt(2), rs.getBigDecimal(3)?.toPlainString())
        }
    }
    return lots
}

private fun Connection.publicPhoto(id: String): Pair<ByteArray, String>? {
    val stayId = id.toLongOrNull()
    if (stayId != null) {
        return photoRow("select image, image_type from stay where id = ? and hidden = false and image is not null", stayId, null)
    }
    return photoRow("select image, image_type from experience where id = ? and hidden = false and image is not null", null, id)
}

private fun Connection.reviewPhoto(kind: String, id: String): Pair<ByteArray, String>? {
    if (kind == "stay") {
        val stayId = id.toLongOrNull() ?: return null
        return photoRow("select image, image_type from stay where id = ? and image is not null", stayId, null)
    }
    if (kind == "experience") {
        return photoRow("select image, image_type from experience where id = ? and image is not null", null, id)
    }
    return null
}

private fun Connection.photoRow(sql: String, stayId: Long?, textId: String?): Pair<ByteArray, String>? {
    prepareStatement(sql).use { ps ->
        if (stayId != null) ps.setLong(1, stayId) else ps.setString(1, textId)
        ps.executeQuery().use { rs ->
            if (!rs.next()) return null
            return rs.getBytes(1) to (rs.getString(2) ?: "image/png")
        }
    }
}

private fun Connection.login(email: String, password: String): Account? {
    prepareStatement("select id, email, role, password_hash from account where email = ?").use { ps ->
        ps.setString(1, email.trim().lowercase())
        ps.executeQuery().use { rs ->
            if (!rs.next()) return null
            if (!verifyPassword(password, rs.getString(4))) return null
            return Account(rs.getLong(1), rs.getString(2), rs.getString(3))
        }
    }
}

private fun Connection.accountBySession(token: String): Account? {
    val hash = sha256(token)
    val found = prepareStatement(
        """
        select a.id, a.email, a.role, s.expires_at
        from session s
        join account a on a.id = s.account_id
        where s.token_hash = ?
        """.trimIndent()
    ).use { ps ->
        ps.setString(1, hash)
        ps.executeQuery().use { rs ->
            if (!rs.next()) null
            else Account(rs.getLong(1), rs.getString(2), rs.getString(3)) to rs.getTimestamp(4).toInstant()
        }
    } ?: return null
    if (!found.second.isAfter(Instant.now())) {
        prepareStatement("delete from session where token_hash = ?").use { ps ->
            ps.setString(1, hash)
            ps.executeUpdate()
        }
        return null
    }
    return found.first
}

private fun Connection.openSession(account: Account): SessionIssued {
    prepareStatement("delete from session where account_id = ? and expires_at <= now()").use { ps ->
        ps.setLong(1, account.id)
        ps.executeUpdate()
    }
    val token = randomToken()
    val expires = OffsetDateTime.now(ZoneOffset.UTC).plusHours(SESSION_HOURS)
    prepareStatement("insert into session (token_hash, account_id, expires_at) values (?, ?, ?)").use { ps ->
        ps.setString(1, sha256(token))
        ps.setLong(2, account.id)
        ps.setTimestamp(3, Timestamp.from(expires.toInstant()))
        ps.executeUpdate()
    }
    return SessionIssued(token, account.id, account.email, account.role, expires.toString())
}

private fun Connection.markVisit(accountId: Long, placeId: String) {
    prepareStatement("insert into visit (account_id, place_id) values (?, ?) on conflict do nothing").use { ps ->
        ps.setLong(1, accountId)
        ps.setString(2, placeId)
        ps.executeUpdate()
    }
}

private fun Connection.updateStay(hostId: Long, stayId: Long, draft: StayDraft): Boolean {
    prepareStatement(
        """
        update stay
        set title = ?, description = ?, kind = ?, county = ?, lat = ?, lng = ?, hidden = ?, image = ?, image_type = ?, review_reason = null
        where id = ? and host_id = ?
        """.trimIndent()
    ).use { ps ->
        ps.setString(1, draft.title)
        ps.setString(2, draft.description)
        ps.setString(3, draft.kind)
        ps.setString(4, draft.county)
        ps.bindDouble(5, draft.lat)
        ps.bindDouble(6, draft.lng)
        ps.setBoolean(7, !passesStayReview(draft))
        ps.bindPhoto(8, draft.imageBase64)
        ps.setLong(10, stayId)
        ps.setLong(11, hostId)
        val ok = ps.executeUpdate() == 1
        if (ok) {
            prepareStatement("delete from lot where stay_id = ?").use { del ->
                del.setLong(1, stayId)
                del.executeUpdate()
            }
            insertLots(stayId, draft.lots)
        }
        return ok
    }
}

private fun Connection.insertStay(hostId: Long, draft: StayDraft): Long {
    prepareStatement(
        """
        insert into stay (host_id, kind, title, description, county, lat, lng, hidden, image, image_type)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) returning id
        """.trimIndent()
    ).use { ps ->
        ps.setLong(1, hostId)
        ps.setString(2, draft.kind)
        ps.setString(3, draft.title)
        ps.setString(4, draft.description)
        ps.setString(5, draft.county)
        ps.bindDouble(6, draft.lat)
        ps.bindDouble(7, draft.lng)
        ps.setBoolean(8, !passesStayReview(draft))
        ps.bindPhoto(9, draft.imageBase64)
        ps.executeQuery().use { rs ->
            rs.next()
            val stayId = rs.getLong(1)
            insertLots(stayId, draft.lots)
            return stayId
        }
    }
}

private fun Connection.insertLots(stayId: Long, lots: List<LotDraft>) {
    if (lots.isEmpty()) return
    prepareStatement("insert into lot (stay_id, name, sleeps, price_eur) values (?, ?, ?, ?)").use { ps ->
        for (lot in lots) {
            ps.setLong(1, stayId)
            ps.setString(2, lot.name)
            ps.setInt(3, lot.sleeps)
            if (lot.priceEur == null) ps.setNull(4, Types.NUMERIC) else ps.setBigDecimal(4, BigDecimal.valueOf(lot.priceEur))
            ps.addBatch()
        }
        ps.executeBatch()
    }
}

private fun Connection.placeImageCount(placeId: String): Int {
    prepareStatement("select count(*) from place_image where place_id = ?").use { ps ->
        ps.setString(1, placeId)
        ps.executeQuery().use { rs ->
            rs.next()
            return rs.getInt(1)
        }
    }
}

private fun Connection.placeImage(placeId: String, index: Int): Pair<ByteArray, String>? {
    if (index < 0) return null
    prepareStatement("select image, image_type from place_image where place_id = ? and position = ?").use { ps ->
        ps.setString(1, placeId)
        ps.setInt(2, index)
        ps.executeQuery().use { rs ->
            if (!rs.next()) return null
            return rs.getBytes(1) to (rs.getString(2) ?: "image/png")
        }
    }
}

private fun Connection.writePlaceImages(placeId: String, photos: List<Pair<ByteArray, String>>, startAt: Int) {
    if (photos.isEmpty()) return
    prepareStatement("insert into place_image (place_id, position, image, image_type) values (?, ?, ?, ?)").use { ps ->
        photos.forEachIndexed { offset, photo ->
            ps.setString(1, placeId)
            ps.setInt(2, startAt + offset)
            ps.setBytes(3, photo.first)
            ps.setString(4, photo.second)
            ps.addBatch()
        }
        ps.executeBatch()
    }
}

private fun Connection.addPlaceImages(placeId: String, photos: List<Pair<ByteArray, String>>): Int? {
    val previous = autoCommit
    autoCommit = false
    try {
        val exists = prepareStatement("select id from place where id = ? for update").use { ps ->
            ps.setString(1, placeId)
            ps.executeQuery().use { rs -> rs.next() }
        }
        if (!exists) {
            rollback()
            return null
        }
        val count = placeImageCount(placeId)
        if (count + photos.size > 5) {
            rollback()
            return -1
        }
        writePlaceImages(placeId, photos, count)
        commit()
        return count + photos.size
    } catch (ex: Exception) {
        rollback()
        throw ex
    } finally {
        autoCommit = previous
    }
}

private fun Connection.insertPlace(accountId: Long, draft: PlaceDraft, photos: List<Pair<ByteArray, String>>): String {
    val id = "place-" + System.nanoTime()
    prepareStatement(
        """
        insert into place (id, name, county, country, lat, lng, geom, account_id)
        values (?, ?, ?, 'Ireland', ?, ?, ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography, ?)
        """.trimIndent()
    ).use { ps ->
        ps.setString(1, id)
        ps.setString(2, draft.name)
        ps.setString(3, draft.county)
        ps.bindDouble(4, draft.lat)
        ps.bindDouble(5, draft.lng)
        ps.setDouble(6, draft.lng ?: 0.0)
        ps.setDouble(7, draft.lat ?: 0.0)
        ps.setLong(8, accountId)
        ps.executeUpdate()
    }
    writePlaceImages(id, photos, 0)
    return id
}

private fun Connection.updateExperience(supplierId: Long, id: String, draft: ExperienceDraft): Boolean {
    prepareStatement(
        """
        update experience
        set name = ?, county = ?, description = ?, lat = ?, lng = ?, hidden = ?, image = ?, image_type = ?, review_reason = null
        where id = ? and supplier_id = ?
        """.trimIndent()
    ).use { ps ->
        ps.setString(1, draft.name)
        ps.setString(2, draft.county)
        ps.setString(3, draft.description)
        ps.bindDouble(4, draft.lat)
        ps.bindDouble(5, draft.lng)
        ps.setBoolean(6, !passesExperienceReview(draft))
        ps.bindPhoto(7, draft.imageBase64)
        ps.setString(9, id)
        ps.setLong(10, supplierId)
        return ps.executeUpdate() == 1
    }
}

private fun Connection.insertExperience(supplierId: Long, draft: ExperienceDraft): String {
    val id = "exp-" + System.nanoTime()
    prepareStatement(
        """
        insert into experience (id, name, county, description, lat, lng, supplier_id, hidden, image, image_type)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """.trimIndent()
    ).use { ps ->
        ps.setString(1, id)
        ps.setString(2, draft.name)
        ps.setString(3, draft.county)
        ps.setString(4, draft.description)
        ps.bindDouble(5, draft.lat)
        ps.bindDouble(6, draft.lng)
        ps.setLong(7, supplierId)
        ps.setBoolean(8, !passesExperienceReview(draft))
        ps.bindPhoto(9, draft.imageBase64)
        ps.executeUpdate()
    }
    return id
}

private fun Connection.insertAccount(body: Signup): Account? {
    val email = body.email.trim().lowercase()
    if (!email.contains("@") || body.password.isBlank()) return null
    prepareStatement(
        """
        insert into account (email, password_hash, role, supplier_approved)
        values (?, ?, ?, ?) on conflict (email) do nothing returning id
        """.trimIndent()
    ).use { ps ->
        ps.setString(1, email)
        ps.setString(2, hashPassword(body.password))
        ps.setString(3, body.role)
        ps.setBoolean(4, body.role != "supplier")
        ps.executeQuery().use { rs ->
            if (!rs.next()) return null
            return Account(rs.getLong(1), email, body.role)
        }
    }
}

private fun Connection.publishStay(id: Long): Boolean {
    prepareStatement("update stay set hidden = false, review_reason = null where id = ?").use { ps ->
        ps.setLong(1, id)
        return ps.executeUpdate() == 1
    }
}

private fun Connection.rejectStay(id: Long, reason: String): Boolean {
    prepareStatement("update stay set hidden = true, review_reason = ? where id = ?").use { ps ->
        ps.setString(1, reason)
        ps.setLong(2, id)
        return ps.executeUpdate() == 1
    }
}

private fun Connection.publishExperience(id: String): Boolean {
    prepareStatement("update experience set hidden = false, review_reason = null where id = ?").use { ps ->
        ps.setString(1, id)
        return ps.executeUpdate() == 1
    }
}

private fun Connection.rejectExperience(id: String, reason: String): Boolean {
    prepareStatement("update experience set hidden = true, review_reason = ? where id = ?").use { ps ->
        ps.setString(1, reason)
        ps.setString(2, id)
        return ps.executeUpdate() == 1
    }
}

private fun Connection.publishSupplier(id: Long): Boolean {
    prepareStatement(
        "update account set supplier_approved = true, review_reason = null where id = ? and role = 'supplier'"
    ).use { ps ->
        ps.setLong(1, id)
        return ps.executeUpdate() == 1
    }
}

private fun Connection.rejectSupplier(id: Long, reason: String): Boolean {
    prepareStatement(
        "update account set supplier_approved = false, review_reason = ? where id = ? and role = 'supplier'"
    ).use { ps ->
        ps.setString(1, reason)
        ps.setLong(2, id)
        return ps.executeUpdate() == 1
    }
}

private fun Connection.nextReview(): ReviewCard? = nextStayCard() ?: nextExperienceCard() ?: nextSupplierCard()

private fun Connection.nextStayCard(): ReviewCard? {
    val card = prepareStatement(
        """
        select s.id, s.title, s.kind, s.county, s.description, s.lat, s.lng, s.website,
               (s.image is not null), a.email
        from stay s
        join account a on a.id = s.host_id
        where s.hidden = true and s.review_reason is null
        order by s.id
        limit 1
        """.trimIndent()
    ).use { ps ->
        ps.executeQuery().use { rs ->
            if (!rs.next()) return@use null
            val lat = rs.getDouble(6).let { if (rs.wasNull()) null else it }
            val lng = rs.getDouble(7).let { if (rs.wasNull()) null else it }
            val pin = if (lat != null && lng != null) "$lat, $lng" else "no pin"
            val site = rs.getString(8)?.takeIf { it.isNotBlank() }
            val subtitle = listOfNotNull(rs.getString(3), rs.getString(4), pin, site, rs.getString(10)).joinToString(" · ")
            ReviewCard(
                kind = "stay",
                id = rs.getLong(1).toString(),
                title = rs.getString(2),
                subtitle = subtitle,
                description = rs.getString(5),
                photo = rs.getBoolean(9),
            )
        }
    } ?: return null
    return card.copy(lots = lotsFor(card.id!!.toLong()))
}

private fun Connection.nextExperienceCard(): ReviewCard? {
    return prepareStatement(
        """
        select e.id, e.name, e.county, e.description, e.lat, e.lng,
               (e.image is not null), a.email
        from experience e
        left join account a on a.id = e.supplier_id
        where e.hidden = true and e.review_reason is null
        order by e.id
        limit 1
        """.trimIndent()
    ).use { ps ->
        ps.executeQuery().use { rs ->
            if (!rs.next()) return null
            val lat = rs.getDouble(5).let { if (rs.wasNull()) null else it }
            val lng = rs.getDouble(6).let { if (rs.wasNull()) null else it }
            val pin = if (lat != null && lng != null) "$lat, $lng" else "no pin"
            val subtitle = listOfNotNull("experience", rs.getString(3), pin, rs.getString(8)).joinToString(" · ")
            ReviewCard(
                kind = "experience",
                id = rs.getString(1),
                title = rs.getString(2),
                subtitle = subtitle,
                description = rs.getString(4),
                photo = rs.getBoolean(7),
            )
        }
    }
}

private fun Connection.nextSupplierCard(): ReviewCard? {
    prepareStatement(
        """
        select id, email from account
        where role = 'supplier' and supplier_approved = false and review_reason is null
        order by id
        limit 1
        """.trimIndent()
    ).use { ps ->
        ps.executeQuery().use { rs ->
            if (!rs.next()) return null
            return ReviewCard(
                kind = "supplier",
                id = rs.getLong(1).toString(),
                title = rs.getString(2),
                subtitle = "New supplier",
                description = "A new supplier waiting for review.",
                photo = false,
            )
        }
    }
}

@Serializable
data class PlaceRow(val id: String, val name: String, val county: String?, val country: String?, val lat: Double?, val lng: Double?)

@Serializable
data class ExperienceRow(val id: String, val name: String, val county: String?, val lat: Double? = null, val lng: Double? = null)

@Serializable
data class HostRow(val email: String, val stays: Long)

@Serializable
data class StayRow(
    val id: Long,
    val title: String,
    val kind: String,
    val county: String?,
    val hidden: Boolean,
    val lat: Double? = null,
    val lng: Double? = null,
    val reviewReason: String? = null,
)

@Serializable
data class LotRow(val name: String, val sleeps: Int, val priceEur: String?)

@Serializable
data class Listing(
    val id: String,
    val kind: String,
    val name: String,
    val county: String?,
    val description: String?,
    val lots: List<LotRow>,
    val photo: Boolean = false,
    val imageCount: Int = 0,
)

@Serializable
data class Login(val email: String, val password: String)

@Serializable
data class GoogleLogin(val idToken: String)

@Serializable
data class Signup(val email: String, val password: String, val role: String)

@Serializable
data class Account(val id: Long, val email: String, val role: String)

@Serializable
data class SessionIssued(val token: String, val id: Long, val email: String, val role: String, val expiresAt: String)

@Serializable
data class VisitMark(val placeId: String)

@Serializable
data class VisitRow(val placeId: String)

@Serializable
data class StayDraft(
    val kind: String,
    val title: String,
    val description: String,
    val county: String?,
    val lat: Double? = null,
    val lng: Double? = null,
    val imageBase64: String? = null,
    val website: String? = null,
    val lots: List<LotDraft> = emptyList(),
)

@Serializable
data class LotDraft(val name: String, val sleeps: Int = 2, val priceEur: Double? = null)

@Serializable
data class ExperienceDraft(
    val name: String,
    val county: String?,
    val description: String,
    val lat: Double? = null,
    val lng: Double? = null,
    val imageBase64: String? = null,
    val website: String? = null,
)

@Serializable
data class PlaceDraft(
    val name: String,
    val county: String?,
    val lat: Double?,
    val lng: Double?,
    val images: List<String> = emptyList(),
)

@Serializable
data class PlaceImages(val images: List<String> = emptyList())

private data class CheckedImages(val error: String?, val photos: List<Pair<ByteArray, String>>)

private fun checkedImages(raws: List<String>): CheckedImages {
    if (raws.size > 5) return CheckedImages("A place can have five images.", emptyList())
    val photos = mutableListOf<Pair<ByteArray, String>>()
    for (raw in raws) {
        val text = raw.trim()
        if (text.length > PHOTO_TEXT_MAX) return CheckedImages("photo is too big", emptyList())
        val bytes = try {
            Base64.getDecoder().decode(text)
        } catch (_: IllegalArgumentException) {
            return CheckedImages("PNG or JPEG only", emptyList())
        }
        if (bytes.size > PHOTO_MAX_BYTES) return CheckedImages("photo is too big", emptyList())
        val type = imageType(bytes) ?: return CheckedImages("PNG or JPEG only", emptyList())
        photos += bytes to type
    }
    return CheckedImages(null, photos)
}

@Serializable
data class ReviewDecision(val reason: String? = null)

@Serializable
data class ReviewCard(
    val empty: Boolean = false,
    val kind: String? = null,
    val id: String? = null,
    val title: String? = null,
    val subtitle: String? = null,
    val description: String? = null,
    val photo: Boolean = false,
    val lots: List<LotRow> = emptyList(),
)

private fun passesStayReview(draft: StayDraft): Boolean {
    val text = draft.title + " " + draft.description
    if (text.contains('<') || text.contains("script", ignoreCase = true)) return false
    val lat = draft.lat ?: return false
    val lng = draft.lng ?: return false
    if (lat !in 51.0..55.5 || lng !in -11.0..-5.0) return false
    if (photoOf(draft.imageBase64) == null) return false
    val site = draft.website?.trim().orEmpty()
    return site.isEmpty() || siteLoads(site)
}

private fun passesExperienceReview(draft: ExperienceDraft): Boolean {
    return passesStayReview(
        StayDraft(
            kind = "experience",
            title = draft.name,
            description = draft.description,
            county = draft.county,
            lat = draft.lat,
            lng = draft.lng,
            imageBase64 = draft.imageBase64,
            website = draft.website,
        )
    )
}

private fun siteLoads(url: String): Boolean {
    return try {
        val client = java.net.http.HttpClient.newBuilder()
            .followRedirects(java.net.http.HttpClient.Redirect.NEVER)
            .connectTimeout(java.time.Duration.ofSeconds(3))
            .build()
        val request = java.net.http.HttpRequest.newBuilder(java.net.URI.create(url))
            .timeout(java.time.Duration.ofSeconds(3))
            .GET()
            .build()
        val code = client.send(request, java.net.http.HttpResponse.BodyHandlers.discarding()).statusCode()
        code in 200..299
    } catch (_: Exception) {
        false
    }
}

private fun googleEmail(idToken: String, clientId: String): String? {
    return try {
        val client = java.net.http.HttpClient.newBuilder()
            .followRedirects(java.net.http.HttpClient.Redirect.NEVER)
            .connectTimeout(java.time.Duration.ofSeconds(3))
            .build()
        val uri = java.net.URI.create(
            "https://oauth2.googleapis.com/tokeninfo?id_token=" + java.net.URLEncoder.encode(idToken, Charsets.UTF_8)
        )
        val request = java.net.http.HttpRequest.newBuilder(uri)
            .timeout(java.time.Duration.ofSeconds(3))
            .GET()
            .build()
        val response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString())
        if (response.statusCode() != 200) return null
        val json = Json.parseToJsonElement(response.body()).jsonObject
        if (json["aud"]?.jsonPrimitive?.content != clientId) return null
        if (json["email_verified"]?.jsonPrimitive?.content != "true") return null
        json["email"]?.jsonPrimitive?.content?.trim()?.lowercase()
    } catch (_: Exception) {
        null
    }
}

private fun Connection.upsertGoogle(email: String): Account {
    val role = if (email == ADMIN_EMAIL) "admin" else "guest"
    prepareStatement(
        """
        insert into account (email, password_hash, role)
        values (?, ?, ?)
        on conflict (email) do update set email = excluded.email
        returning id, role
        """.trimIndent()
    ).use { ps ->
        ps.setString(1, email)
        ps.setString(2, hashPassword(java.util.UUID.randomUUID().toString()))
        ps.setString(3, role)
        ps.executeQuery().use { rs ->
            rs.next()
            return Account(rs.getLong(1), email, rs.getString(2))
        }
    }
}
