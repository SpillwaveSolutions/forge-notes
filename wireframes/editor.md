# Screen: Page editor

## Goal
Edit a Notion-style page: title, icon/cover, and a stack of blocks. Slash-insert new types. Rewrite a block with AI or generate from page context.

## Layout

```
+--------------------------------------------------------------+
| [cover image]                                                |
| [icon] Title                                                 |
+--------------------------------------------------------------+
| Block handle | block body | AI rewrite                       |
| / slash menu                                                 |
+--------------------------------------------------------------+
```

## Key Elements

| Element | Type | Behavior / Notes |
|---------|------|------------------|
| Cover / icon | media | Optional page chrome |
| Title | heading field | Untitled placeholder |
| Blocks | list | paragraph, h1-h3, bullet, numbered, todo, toggle, quote, callout, code, mermaid, ai, divider |
| Slash menu | popup | Type / for commands; keywords in block-types.ts |
| AI block | panel | Generate summary/todos/table/outline/diagram from page context |
| AI rewrite | dialog | Improve / Shorter / Expand / Fix grammar / custom |
| Mermaid | diagram | Renders from block source |

## Acceptance Criteria
- [ ] Title and block stack are visible for an open page.
- [ ] Slash menu lists the block types in BLOCK_TYPES.
- [ ] AI block and AI rewrite dialog are reachable from the editor.
- [ ] Mermaid block renders a diagram or an in-block error.
- [ ] Empty page still shows a first block with Type / for commands.

## Notes
- Sources: PageEditor.tsx, BlockRow.tsx, SlashMenu.tsx, block-types.ts.
