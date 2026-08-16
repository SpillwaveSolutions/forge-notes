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
| Blocks | list | paragraph, heading1–3, bullet, numbered, todo, toggle, quote, callout, code, mermaid, table, bookmark, ai, divider (`BLOCK_TYPES`) |
| Slash menu | popup | Type `/` for commands; keywords in block-types.ts. Paragraph placeholder is `Type '/' for commands`. |
| AI block | panel | Generate summary/todos/table/outline/diagram from page context |
| AI rewrite | dialog | Improve / Shorter / Expand / Fix grammar / custom |
| Table | grid | Slash `/table`. Markdown pipe table in `content`. Cells are editable; Add row / Add column. Import/export via convert.ts. |
| Bookmark | card | Slash `/bookmark`. `content` holds a URL (optional title on a second line). Renders a link card with editable URL field; opens in a new tab. |

## States
- **Empty page**: first paragraph block with the slash placeholder.
- **Slash open**: filtered command list.
- **Mermaid error**: in-block error, not a crash.
- **Untitled**: title field empty shows Untitled in breadcrumbs, not in the field.
- **Bookmark empty**: shows URL placeholder; no crash on invalid URL.

## Acceptance Criteria
- [ ] Title and block stack are visible for an open page.
- [ ] Slash menu lists the block types in `BLOCK_TYPES` including Bookmark.
- [ ] Table block renders an editable grid and serializes to a markdown pipe table.
- [ ] Bookmark block is insertable via `/bookmark`, stores a URL in `content`, and renders a clickable link card (`data-testid=bookmark-block`).
- [ ] Bookmark round-trips through markdown as a bare URL or `[title](url)` link.
- [ ] AI block and AI rewrite dialog are reachable from the editor.
- [ ] Mermaid block renders a diagram or an in-block error.
- [ ] Empty page still shows a first block with Type / for commands.

## Notes
- Sources: PageEditor.tsx, BlockRow.tsx, SlashMenu.tsx, block-types.ts, BookmarkBlock.tsx, convert.ts.
