package island

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.util.Collections
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

class SeederTest {
    @Test
    fun usernamesAreUniqueAcrossThreads() {
        val seeder = Seeder()
        val names = Collections.synchronizedSet(mutableSetOf<String>())
        val pool = Executors.newFixedThreadPool(8)
        repeat(200) {
            pool.submit { names.add(seeder.getUsername()) }
        }
        pool.shutdown()
        pool.awaitTermination(20, TimeUnit.SECONDS)
        assertEquals(200, names.size)
    }

    @Test
    fun insertedGuestsDoNotCollide() {
        val seeder = Seeder(SharedDatabase.dataSource)
        val emails = Collections.synchronizedSet(mutableSetOf<String>())
        val pool = Executors.newFixedThreadPool(8)
        repeat(40) {
            pool.submit { emails.add(seeder.insertGuest()) }
        }
        pool.shutdown()
        pool.awaitTermination(20, TimeUnit.SECONDS)
        assertEquals(40, emails.size)
    }
}
