# UI specs, wireframes & rubrics

Ground truth for what each screen should look like, in a form an agent can check.

The loop: read a screen's doc, follow its **capture recipe** to reach the state,
screenshot the running app, then compare against the wireframe and the four rubric
lists — reporting per-item pass/fail with a reason. It is an LLM checklist review,
not a pixel diff.

## Layout

```
docs/ui/README.md              this file
docs/ui/TEMPLATE.md            copy this to start a new screen
docs/ui/<screen>.md            spec + addressability + capture recipe + rubric
docs/ui/wireframes/*.puml      PlantUML Salt sources
docs/ui/wireframes/png/*.png   rendered, committed
```

One document per screen **family**, not per state. Spec and rubric live in the same
file because they are read together and rot together.

## Commands

```bash
npm run ui:render   # all .puml -> png/
npm run ui:check    # syntax only, no output written
```

Requires `plantuml` and `graphviz` (`brew install plantuml graphviz`).

**PNGs are committed** — agents, GitHub's markdown preview, and anyone without Java
need them. They are marked `binary -diff` in `.gitattributes`.

There is deliberately **no pre-commit freshness gate** on the PNGs, unlike
`docs/roadmap.md`. PlantUML embeds version metadata in its output, so the bytes are
not reproducible across PlantUML versions and such a hook would false-fail for
anyone on a different `brew` build. `npm run ui:check` validates syntax instead,
which is version-stable.

## Relationship to the worklog docs

`docs/ui/**` is **invisible to the worklog IA**. `bin/ia.py` globs a fixed, flat
allow-list (`docs/plans/*.md`, `docs/designs/*.md`, `docs/adr/*.md`, …) and
`classify()` returns `None` for anything else.

That means: no frontmatter, no `wiki_key`, no `ia-normalize`, no pre-commit
staleness warnings. Zero coupling, deliberately — these are agent-facing working
documents, not published artifacts.

> Note `docs/designs/` (plural) is **reserved** by worklog's own design-doc and
> code-walkthrough feature. Hence `docs/ui/`.

## Screens

| Screen | Doc | States |
|---|---|---|
| AI Setup Wizard | [ai-setup-wizard.md](ai-setup-wizard.md) | 7 |

Everything else is still to be written — see phase 6 of epic
`01KYZ8X1X1V76HYNK8B5JYMD9W`. Roughly in value order: login, app shell, sidebar and
command palette, page editor and the 14 block types, the remaining dialogs, then the
AI panels.

## Capture prerequisites

Both mechanisms are seeded through `localStorage`, so an agent can set them **before
the page loads** — no click path, no URL parameter, and it works with any capture
tool including the MCP browser tools, which have no `mask` option.

| Key | Effect |
|---|---|
| `workspace-v1` | Theme. `{"state":{"theme":"dark"},"version":0}` |
| `forgenotes-ui-freeze` | Stops animations/transitions, hides toasts, hides `[data-volatile]`, blanks the caret |
| `forgenotes-ui-reveal` | Forces `[data-hover-reveal]` affordances visible |

Capture mode is **DEV-only** — production ignores the flags entirely.

Screens with hover-gated affordances need **two** captures, `-rest` and `-reveal`.
The rest-state rubric lists those affordances under *Must NOT Appear*, which is how
an `opacity-0` → `hidden` regression gets caught: they are clickable either way, so
only a screenshot notices.
