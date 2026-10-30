package island

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
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
import io.ktor.server.response.respondText
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.routing
import kotlinx.serialization.Serializable
import org.flywaydb.core.Flyway
import java.security.MessageDigest
import java.sql.Connection
import javax.sql.DataSource

fun main() {
    val port = System.getenv("PORT")?.toInt() ?: 8080
    embeddedServer(Netty, port = port, module = Application::module).start(wait = true)
}

fun Application.module() {
    val ds = dataSource()
    Flyway.configure().dataSource(ds).locations("classpath:db/migration").load().migrate()
    install(ContentNegotiation) { json() }
    routing {
        get("/health") { call.respond(mapOf("ok" to "true")) }
        get("/info") {
            call.respond(mapOf("gitCommit" to (System.getenv("GIT_COMMIT") ?: "unknown")))
        }
        get("/metrics") {
            call.respondText("island_up 1\n", io.ktor.http.ContentType.parse("text/plain; version=0.0.4"))
        }
        get("/") { call.respondText(phonePage(), io.ktor.http.ContentType.Text.Html) }
        get("/places") { call.respond(ds.connection.use { it.places() }) }
        get("/stays") { call.respond(ds.connection.use { it.stays(publicOnly = true) }) }
        get("/experiences") { call.respond(ds.connection.use { it.experiences() }) }
        get("/listings/{id}") {
            val id = call.parameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val row = ds.connection.use { it.listing(id) }
            if (row == null) call.respond(HttpStatusCode.NotFound) else call.respond(row)
        }
        get("/page/{id}") {
            val id = call.parameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val row = ds.connection.use { it.listing(id) }
            if (row == null) call.respond(HttpStatusCode.NotFound)
            else call.respondText(listingPage(row), io.ktor.http.ContentType.Text.Html)
        }
        post("/sessions") {
            val body = call.receive<Login>()
            val account = ds.connection.use { it.login(body.email, body.password) }
            if (account == null) call.respond(HttpStatusCode.Unauthorized)
            else call.respond(account)
        }
        post("/visits") {
            val account = call.account(ds) ?: return@post
            val body = call.receive<VisitMark>()
            ds.connection.use { it.markVisit(account.id, body.placeId) }
            call.respond(HttpStatusCode.NoContent)
        }
        post("/supplier/experiences") {
            val account = call.account(ds) ?: return@post
            if (account.role != "supplier") {
                call.respond(HttpStatusCode.Forbidden)
                return@post
            }
            val body = call.receive<ExperienceDraft>()
            val id = ds.connection.use { it.insertExperience(account.id, body) }
            call.respond(mapOf("id" to id, "hidden" to "true"))
        }
        post("/host/stays") {
            val account = call.account(ds) ?: return@post
            if (account.role != "host") {
                call.respond(HttpStatusCode.Forbidden)
                return@post
            }
            val body = call.receive<StayDraft>()
            val id = ds.connection.use { it.insertStay(account.id, body) }
            call.respond(mapOf("id" to id.toString(), "hidden" to "true"))
        }
        get("/admin/listings") {
            val account = call.account(ds) ?: return@get
            if (account.email != "tezball86@gmail.com") {
                call.respond(HttpStatusCode.Forbidden)
                return@get
            }
            call.respond(ds.connection.use { it.stays(publicOnly = false) })
        }
    }
}

private fun dataSource(): DataSource {
    val config = HikariConfig()
    config.jdbcUrl = System.getProperty("jdbc.url") ?: System.getenv("JDBC_URL") ?: "jdbc:postgresql://localhost:5432/island"
    config.username = System.getProperty("jdbc.user") ?: System.getenv("JDBC_USER") ?: "island"
    config.password = System.getProperty("jdbc.password") ?: System.getenv("JDBC_PASSWORD") ?: "island"
    config.maximumPoolSize = 5
    return HikariDataSource(config)
}

private suspend fun ApplicationCall.account(ds: DataSource): Account? {
    val header = request.headers["Authorization"]?.removePrefix("Bearer ")?.trim()
    if (header.isNullOrBlank()) {
        respond(HttpStatusCode.Unauthorized)
        return null
    }
    val account = ds.connection.use { it.accountByEmail(header) }
    if (account == null) respond(HttpStatusCode.Unauthorized)
    return account
}

private fun sha256(value: String): String {
    val digest = MessageDigest.getInstance("SHA-256").digest(value.toByteArray())
    return digest.joinToString("") { "%02x".format(it) }
}

private fun Connection.places(): List<PlaceRow> {
    val rows = mutableListOf<PlaceRow>()
    createStatement().use { st ->
        st.executeQuery("select id, name, county, country, lat, lng from place order by name").use { rs ->
            while (rs.next()) {
                val lat = rs.getDouble(5).let { if (rs.wasNull()) null else it }
                val lng = rs.getDouble(6).let { if (rs.wasNull()) null else it }
                rows += PlaceRow(rs.getString(1), rs.getString(2), rs.getString(3), rs.getString(4), lat, lng)
            }
        }
    }
    return rows
}

private fun Connection.experiences(): List<ExperienceRow> {
    val rows = mutableListOf<ExperienceRow>()
    createStatement().use { st ->
        st.executeQuery("select id, name, county from experience where hidden = false order by name").use { rs ->
            while (rs.next()) rows += ExperienceRow(rs.getString(1), rs.getString(2), rs.getString(3))
        }
    }
    return rows
}

private fun Connection.stays(publicOnly: Boolean): List<StayRow> {
    val rows = mutableListOf<StayRow>()
    val where = if (publicOnly) "where hidden = false" else ""
    createStatement().use { st ->
        st.executeQuery("select id, title, kind, county, hidden from stay $where order by title").use { rs ->
            while (rs.next()) rows += StayRow(rs.getLong(1), rs.getString(2), rs.getString(3), rs.getString(4), rs.getBoolean(5))
        }
    }
    return rows
}

private fun Connection.listing(id: String): Listing? {
    prepareStatement("select id, name, county, description from place where id = ?").use { ps ->
        ps.setString(1, id)
        ps.executeQuery().use { rs ->
            if (rs.next()) return Listing(rs.getString(1), "place", rs.getString(2), rs.getString(3), rs.getString(4), emptyList())
        }
    }
    val stayId = id.toLongOrNull() ?: return null
    prepareStatement("select id, title, kind, county, description, hidden from stay where id = ?").use { ps ->
        ps.setLong(1, stayId)
        ps.executeQuery().use { rs ->
            if (!rs.next()) return null
            if (rs.getBoolean(6)) return null
            val lots = mutableListOf<LotRow>()
            prepareStatement("select name, sleeps, price_eur from lot where stay_id = ? order by id").use { lp ->
                lp.setLong(1, stayId)
                lp.executeQuery().use { lr ->
                    while (lr.next()) lots += LotRow(lr.getString(1), lr.getInt(2), lr.getBigDecimal(3)?.toPlainString())
                }
            }
            return Listing(stayId.toString(), rs.getString(3), rs.getString(2), rs.getString(4), rs.getString(5), lots)
        }
    }
}

private fun Connection.login(email: String, password: String): Account? {
    prepareStatement("select id, email, role, password_hash from account where email = ?").use { ps ->
        ps.setString(1, email.trim().lowercase())
        ps.executeQuery().use { rs ->
            if (!rs.next()) return null
            if (rs.getString(4) != sha256(password)) return null
            return Account(rs.getLong(1), rs.getString(2), rs.getString(3))
        }
    }
}

private fun Connection.accountByEmail(email: String): Account? {
    prepareStatement("select id, email, role from account where email = ?").use { ps ->
        ps.setString(1, email.trim().lowercase())
        ps.executeQuery().use { rs ->
            if (!rs.next()) return null
            return Account(rs.getLong(1), rs.getString(2), rs.getString(3))
        }
    }
}

private fun Connection.markVisit(accountId: Long, placeId: String) {
    prepareStatement("insert into visit (account_id, place_id) values (?, ?) on conflict do nothing").use { ps ->
        ps.setLong(1, accountId)
        ps.setString(2, placeId)
        ps.executeUpdate()
    }
}

private fun Connection.insertStay(hostId: Long, draft: StayDraft): Long {
    prepareStatement(
        "insert into stay (host_id, kind, title, description, county, hidden) values (?, ?, ?, ?, ?, true) returning id"
    ).use { ps ->
        ps.setLong(1, hostId)
        ps.setString(2, draft.kind)
        ps.setString(3, draft.title)
        ps.setString(4, draft.description)
        ps.setString(5, draft.county)
        ps.executeQuery().use { rs ->
            rs.next()
            return rs.getLong(1)
        }
    }
}

@Serializable data class PlaceRow(val id: String, val name: String, val county: String?, val country: String?, val lat: Double?, val lng: Double?)
@Serializable data class ExperienceRow(val id: String, val name: String, val county: String?)
@Serializable data class StayRow(val id: Long, val title: String, val kind: String, val county: String?, val hidden: Boolean)
@Serializable data class LotRow(val name: String, val sleeps: Int, val priceEur: String?)
@Serializable data class Listing(val id: String, val kind: String, val name: String, val county: String?, val description: String?, val lots: List<LotRow>)
@Serializable data class Login(val email: String, val password: String)
@Serializable data class Account(val id: Long, val email: String, val role: String)
@Serializable data class VisitMark(val placeId: String)
@Serializable data class StayDraft(val kind: String, val title: String, val description: String, val county: String?)
@Serializable data class ExperienceDraft(val name: String, val county: String?, val description: String)

private fun Connection.insertExperience(supplierId: Long, draft: ExperienceDraft): String {
    val id = "exp-" + System.nanoTime()
    prepareStatement(
        "insert into experience (id, name, county, description, supplier_id, hidden) values (?, ?, ?, ?, ?, true)"
    ).use { ps ->
        ps.setString(1, id)
        ps.setString(2, draft.name)
        ps.setString(3, draft.county)
        ps.setString(4, draft.description)
        ps.setLong(5, supplierId)
        ps.executeUpdate()
    }
    return id
}

private fun phonePage(): String = """
<!doctype html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Island</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<style>
  body { font-family: Georgia, serif; margin: 0; background: #f6f3ee; color: #1c2420; }
  header { background: #0B6E4F; color: white; padding: 16px; }
  main { padding: 16px; max-width: 960px; margin: 0 auto; }
  a { color: #0B6E4F; }
  .card { background: white; border-radius: 12px; padding: 12px 16px; margin: 8px 0; }
  #map { height: 320px; border-radius: 12px; }
</style>
<header>Island</header>
<main>
  <p>Places, stays, and experiences on the island of Ireland.</p>
  <div id="map"></div>
  <div id="list"></div>
</main>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
const map = L.map('map').setView([53.4, -7.9], 6);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap' }).addTo(map);
const list = document.getElementById('list');
function card(href, title, meta) {
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = '<a href="' + href + '">' + title + '</a><div>' + (meta || '') + '</div>';
  list.appendChild(el);
}
fetch('/places').then(r => r.json()).then(rows => rows.forEach(p => {
  card('/page/' + p.id, p.name, p.county || '');
  if (p.lat != null && p.lng != null) L.marker([p.lat, p.lng]).addTo(map).bindPopup(p.name);
}));
fetch('/stays').then(r => r.json()).then(rows => rows.forEach(s => card('/page/' + s.id, s.title, s.kind)));
fetch('/experiences').then(r => r.json()).then(rows => rows.forEach(e => card('/page/' + e.id, e.name, e.county || '')));
</script>
""".trimIndent()

private fun listingPage(row: Listing): String {
    val lots = row.lots.joinToString("") { "<li>${it.name} · sleeps ${it.sleeps}${it.priceEur?.let { p -> " · EUR $p" } ?: ""}</li>" }
    return """
<!doctype html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${row.name}</title>
<style>
  body { font-family: Georgia, serif; margin: 0; background: #f6f3ee; color: #1c2420; }
  header { background: #0B6E4F; color: white; padding: 16px; }
  main { padding: 16px; max-width: 720px; margin: 0 auto; }
  a { color: #0B6E4F; }
</style>
<header><a href="/" style="color:white">${row.name}</a></header>
<main>
  <p>${row.county ?: ""} · ${row.kind}</p>
  <p>${row.description ?: ""}</p>
  <ul>$lots</ul>
</main>
""".trimIndent()
}
