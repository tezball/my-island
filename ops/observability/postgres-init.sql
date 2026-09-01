CREATE USER ops_reader WITH PASSWORD 'ops_reader';
GRANT CONNECT ON DATABASE ops TO ops_reader;
GRANT USAGE ON SCHEMA public TO ops_reader;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ops_reader;

CREATE TABLE IF NOT EXISTS mcp_ping (
  id integer PRIMARY KEY,
  note text NOT NULL
);

INSERT INTO mcp_ping (id, note)
VALUES (1, 'local ops — grafana/postgres MCP')
ON CONFLICT (id) DO NOTHING;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO ops_reader;
