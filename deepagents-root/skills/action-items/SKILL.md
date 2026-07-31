---
name: action-items
description: Extract actionable todos from page notes. Use when the user wants tasks, checklist, or action items.
---

# Action items

## Steps
1. Scan page for commitments, next steps, owners, deadlines.
2. Emit:
   - heading2: `Action items`
   - todo blocks for each item (unchecked)
3. If no clear actions, invent **no** tasks — return one todo: "Capture next steps on this page".

## Rules
- Prefer imperative phrasing ("Ship X", "Email Y").
- Max 8 todos.
