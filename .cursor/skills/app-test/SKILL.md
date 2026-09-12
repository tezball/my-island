---
name: app-test
description: >-
  Run the house local test contract (pytest + catalog mvn + HTTP smoke).
  Slash-only (/app-test).
disable-model-invocation: true
---

# /app-test

Read `.cursor/skills/clone-run/SKILL.md`. Then:

```bash
./scripts/app test
```

Same contract as CI `unit` + `catalog` + `stack` locally. Fast vault-only: `python3 -m pytest ops/tests -q -m "not stack"`.
