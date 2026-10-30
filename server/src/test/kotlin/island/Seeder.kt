package island

import java.util.concurrent.atomic.AtomicLong
import javax.sql.DataSource

class Seeder(private val dataSource: DataSource? = null) {
    private val next = AtomicLong(0)

    fun getUsername(): String {
        val n = next.incrementAndGet()
        return "user-$n-${Thread.currentThread().threadId()}"
    }

    fun insertGuest(): String {
        val email = "${getUsername()}@example.com"
        val db = dataSource ?: error("no database")
        db.connection.use { c ->
            c.prepareStatement(
                "insert into account (email, password_hash, role) values (?, ?, 'guest')"
            ).use { ps ->
                ps.setString(1, email)
                ps.setString(2, "test")
                ps.executeUpdate()
            }
        }
        return email
    }
}
