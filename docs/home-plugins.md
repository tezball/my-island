---
title: Home plugins
type: moc
cssclasses:
  - moc
---

# Home plugins

What the three candidate homes use. Nothing here is a new install. Core items are already enabled in `.obsidian/core-plugins.json`. Community items are already named in `.obsidian/community-plugins.json`.

[[home-signal]] · [[home-desk]] · [[home-atlas]] · live home [[HOME]]

Ticket rows come from frontmatter (`id`, `status`, `type`, `priority`, `owner`, `area`, `pr`) through **Bases**. Full install notes stay in [[ops/PLUGINS]].

## Core

| Plugin | On this home | Vault |
|---|---|---|
| Bases | Open, implement, and review. The ticket and database layer. | Core, enabled |
| Properties | The fields those views read. | Core, enabled |
| Page preview | Hover a ticket or a path without leaving the home. | Core, enabled |
| Outline | Scan the desk and the longer sections. | Core, enabled |
| Bookmarks | Pin the home you keep. | Core, enabled |

## Visual

| Plugin | On this home | Vault |
|---|---|---|
| Graph | Coloured map of the vault (groups already in `.obsidian/graph.json`). A picture of the place, not the queue. | Core, enabled |
| Canvas | Workshop drawings on the architecture and workflow paths. | Core, enabled |
| Excalidraw | A drawing when a path needs one. The homes themselves are markdown, callouts, and Bases. | Community, listed (`obsidian-excalidraw-plugin`) |

Colour on the three homes is the `company-os` snippet (`cssclasses` `home-signal`, `home-desk`, `home-atlas`), already enabled. That is not a plugin.

## Navigation

| Plugin | On this home | Vault |
|---|---|---|
| Quick switcher | Jump to a ticket, the board, or a path. | Core, enabled (`switcher`) |
| Search | Find a note by name or phrase. | Core, enabled (`global-search`) |
| Backlinks | See what points at the home. | Core, enabled (`backlink`) |
| Outgoing links | See the paths the home opens. | Core, enabled (`outgoing-link`) |
| Homepage | Open one note when the vault opens. Leave it on [[HOME]] until a candidate is chosen, then point it at that note. | Community, listed (`homepage`) |

## Dataview

Dataview is community and already listed (`dataview`). It is not a second ticket board.

[[home-desk]] uses one Dataview block: a count per `status`, with the notes left out. Bases lists one note per row (and can group those notes). It does not replace that list with a tally. [[home-signal]] and [[home-atlas]] stay on Bases.

## Left off

Already in the vault, and not part of this home:

| Plugin | Why it stays off the home |
|---|---|
| Kanban (`obsidian-kanban`) | Another board of the same tickets. Bases is the view. [[ops/BOARD]] stays the generated kanban. |
| Tasks, Calendar, Templater | Checklists, dailies, and templates. Core Templates already covers new notes. |
| Advanced Canvas | Core Canvas covers the workshop pictures. |
| Omnisearch | Quick switcher and Search cover the jump. |
| Smart Connections | Graph and backlinks cover “what is related”. |
| Advanced Tables | Hand-editing markdown tables. The queues are Bases. |
