# Pipeline

The MVP is not done until this path is boring.

1. Jenkins on this machine polls `origin/main`. Nobody clicks Build. There is no GitHub Actions job.
2. The job fast-forwards the checkout, runs the test suite, then recreates the app container with that commit. Flyway runs on startup. A red test does not replace the app.
3. Gatling then runs against that deploy: 100 users browse, check off a place, edit a stay, and open admin. A red Gatling run fails the job.
4. The served commit is `GET /info` and the `island_up` metric label `git_commit`. It matches `main` after a green job.
5. Grafana MCP is on localhost port 8000. An agent uses it to read Prometheus, Loki, and alerts, including that commit. The bearer token stays in `ops/observe/grafana-mcp.env`, which is not in git. Agents do not SSH.
6. A second Jenkins timer dumps the database once an hour. See `docs/backup.md`. The dump is not in git.

Worktrees do not share ports. The pipeline job uses its own compose project name, the same way a second worktree does.

Agents watch the workflow. They do not SSH to the host. They read the live commit, the Gatling report, and the database through MCP. Logs, metrics, and alerts are Loki, Prometheus, and Alertmanager on localhost, opened in Grafana. No password is stored in git.
