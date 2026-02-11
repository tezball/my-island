---
name: fullstack-check
description: Run TypeScript build check and Maven compile to verify both frontend and backend layers build successfully
disable-model-invocation: true
allowed-tools: Bash
---

Run both checks and report results:

1. **Frontend**: `cd /home/tezball/projects/my-island/my-island-web && npm run build`
2. **Backend**: `cd /home/tezball/projects/my-island/my-island-api && ./mvnw test-compile -q`

Run both in parallel. Report pass/fail for each layer with any error output.
