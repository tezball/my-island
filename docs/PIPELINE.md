# Pipeline

The MVP is not done until this path is boring.

1. A change lands on `main` only through a pull request. The four checks are unit, API, web, and the compose stack.
2. Merge to `main` starts the deploy. Feature branches never deploy.
3. The deploy boots the compose stack for the public site, runs Flyway, and only then serves traffic.
4. Jenkins runs Gatling against that deploy: 100 users browse, check off a place, edit a stay, and open admin. There is no GitHub Actions job.
5. The live site’s commit matches `main`. If Gatling fails, the pipeline is red.

Worktrees do not share ports. The pipeline job uses its own compose project name, the same way a second worktree does.

Agents watch the workflow. They do not SSH to the host. They read the live commit, the Gatling report, and the database through MCP.
