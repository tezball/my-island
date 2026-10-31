# Password hash

Passwords are stored with PBKDF2-HMAC-SHA256: 100000 iterations, a random 16-byte salt, and a 32-byte hash. The stored text is `pbkdf2-sha256$100000$<salt>$<hash>`, with salt and hash in Base64. A plain SHA-256 of the password does not match.

Demo accounts keep the password `guest`. Flyway rewrites the old SHA-256 digest of that word to one PBKDF2 hash. New accounts get a new salt. A stored iteration count outside 50000..200000 is rejected so a row cannot force a huge hash.

Tools: JDK `SecretKeyFactory` (`PBKDF2WithHmacSHA256`), Flyway `V4__harden.sql`.
