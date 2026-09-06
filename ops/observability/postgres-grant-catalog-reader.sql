-- SELECT-only for ops_reader on database catalog.
-- Initdb runs this against POSTGRES_DB=ops (see compose 02-catalog-reader.sql).
-- ./scripts/dev up reapplies it after Flyway so existing volumes pick up grants.
-- Postgres cannot SELECT across databases from one DSN; MCP uses a second
-- connection to db catalog (postgres-catalog in .cursor/mcp.json).

GRANT CONNECT ON DATABASE catalog TO ops_reader;

\c catalog

GRANT USAGE ON SCHEMA public TO ops_reader;
ALTER DEFAULT PRIVILEGES FOR ROLE ops IN SCHEMA public GRANT SELECT ON TABLES TO ops_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO ops_reader;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public FROM ops_reader;
