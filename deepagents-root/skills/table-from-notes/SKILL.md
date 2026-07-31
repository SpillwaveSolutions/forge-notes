---
name: table-from-notes
description: Turn page content into a markdown table. Use when the user asks for a table, matrix, or comparison grid.
---

# Table from notes

## Steps
1. Infer useful columns from the content (e.g. Topic | Detail | Status).
2. Emit:
   - heading2: short table title
   - code block containing a GitHub-flavored markdown table

## Rules
- Escape `|` inside cells.
- Include a header row and separator row.
- 3–10 data rows max.
