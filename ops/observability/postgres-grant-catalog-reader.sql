-- WF-016: SELECT-only for ops_reader on db catalog.
-- Not Flyway (catalog Testcontainers has no ops_reader).
-- Compose init: docker-entrypoint-initdb.d/02-catalog-reader.sql
-- Existing volumes: re-applied by ./scripts/dev up (ensure_catalog_reader_grants).

GRANT CONNECT ON DATABASE catalog TO ops_reader;

\connect catalog

GRANT USAGE ON SCHEMA public TO ops_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO ops_reader;
ALTER DEFAULT PRIVILEGES FOR ROLE ops IN SCHEMA public GRANT SELECT ON TABLES TO ops_reader;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public FROM ops_reader;
