# Screen: App chrome (shell)

## Goal
Navigate nested pages and linked markdown, see sync state, toggle theme, and open the current page or mount in the main column.

## Layout

```
+------------------+----------------------------------------------+
| Sidebar 260px    | Header: hamburger / breadcrumbs / sync /     |
| Favorites        | theme / import-export / favorite / sign-in   |
| Nested pages     |----------------------------------------------|
| Linked folders   | Page editor OR mounted markdown OR empty     |
| Trash            |                                              |
+------------------+----------------------------------------------+
```

Mobile: hamburger opens a left drawer over a dimmed backdrop.

## Key Elements

| Element | Type | Behavior / Notes |
|---------|------|------------------|
| Sidebar | tree | Favorites, nested pages, linked markdown mounts, trash. Hidden when collapsed (md+). |
| Mobile menu | icon | aria-label Open sidebar. md:hidden. |
| Breadcrumbs | buttons | Page chain with icons. Mount shows Link2 plus name / relPath. |
| Empty header | copy | No page selected |
| Sync chip | badge | Local only (guest) or Saving / Saved to DB / Sync error |
| Theme | icon | Label names the destination: Switch to light/dark theme |
| Import/export | icon | Opens Markdown I/O when a page or mount is open |
| Favorite | star | aria-label Favorite / Unfavorite |
| Sign in | link | /login when auth enabled and signed out |
| Loading | full screen | Loading workspace... or Loading workspace from database... |
| Empty main | CTA | No page open; New page + Open sidebar |

## States
- **Hydrating / auth / remote load**: Centered pulse, no chrome.
- **Guest**: Local only chip; data in this browser.
- **Signed in**: Postgres sync chip.
- **No page**: Empty workspace CTAs.
- **Mount selected**: Markdown view instead of PageEditor.

## Acceptance Criteria
- [ ] Desktop shows sidebar + header + main; mobile uses hamburger drawer.
- [ ] Breadcrumbs walk parent pages; last crumb is current.
- [ ] Theme control names the destination theme, not the current one.
- [ ] Sync chip distinguishes local-only vs database save/error.
- [ ] Empty state offers New page and Open sidebar.
- [ ] Linked folder selection replaces the page editor with mounted markdown.

## Notes
- Source: src/components/layout/AppShell.tsx, Sidebar.tsx.
