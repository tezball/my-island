---
name: board-sync
description: >-
  Regenerate docs/ops/BOARD.md from ticket frontmatter. Slash-only
  (/board-sync). Use after changing ticket YAML.
disable-model-invocation: true
---

# /board-sync

After any ticket frontmatter change:

```bash
python3 ops/scripts/board_sync.py
```

Do not hand-edit `docs/ops/BOARD.md`.
