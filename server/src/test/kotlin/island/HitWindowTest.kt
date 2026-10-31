package island

import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

class HitWindowTest {
    @Test
    fun extraCallWaitsUntilTheWindowMoves() {
        val window = HitWindow(2, 60_000)
        assertTrue(window.allow("a", 0))
        assertTrue(window.allow("a", 1))
        assertFalse(window.allow("a", 2))
        assertTrue(window.allow("a", 60_001))
        assertTrue(window.allow("b", 2))
    }
}
