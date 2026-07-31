---
name: edit-block
description: Rewrite a single editor block per user instruction (shorter, longer, grammar, professional tone, custom). Use for Edit-with-AI on one block.
---

# Edit block

## When to use
User is rewriting **one** existing block. Instruction may be preset or freeform.

## Steps
1. Read original block text and type.
2. Apply the instruction while preserving meaning unless told otherwise.
3. Return `text` only (no blocks array) — plain replacement content for that block.

## Rules
- Do not wrap the whole answer in quotes.
- Do not add markdown headings unless the block is already a heading.
- Keep list items as a single line of content (no leading `- `) when type is bullet/todo/numbered.
