# Place secrets here (gitignored except this file).

- `env.prod` — copied from `.env.prod` / `.env.prod.example` by `./scripts/start-jenkins.sh`. Required for Deploy Prod.
- `github-token` — GitHub PAT (`repo` scope) used to scan PRs, post AI reviews, push autofixes, and squash-merge. Optional: export `GITHUB_TOKEN` instead.
