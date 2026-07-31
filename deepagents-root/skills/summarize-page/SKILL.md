---
name: summarize-page
description: Summarize a notes page into a short overview plus key bullets. Use when the user asks for a summary, TL;DR, or page digest.
---

# Summarize page

## When to use
User wants a concise summary of the full page context.

## Steps
1. Read the page title and body.
2. Identify 3–7 key points.
3. Emit blocks:
   - heading2: `Summary — {title}`
   - paragraph: 1–3 sentence overview
   - bullet: each key point

## Rules
- Do not invent facts not present in the page.
- Prefer the user's language/tone.
- Keep bullets under ~20 words each.
