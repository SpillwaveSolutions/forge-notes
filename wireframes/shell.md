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

Desktop: sidebar collapses to width 0; a PanelLeft control (aria-label Open sidebar) restores it.  
Mobile: hamburger (`md:hidden`, aria-label Open sidebar) opens a left drawer (`min(280px, 88vw)`) over a dimmed backdrop.

## Key Elements

| Element | Type | Behavior / Notes |
|---------|------|------------------|
| Sidebar | tree | Favorites, nested pages, linked markdown mounts, trash, New page, Link markdown. Hidden when collapsed (md+). |
| Mobile menu | icon | aria-label Open sidebar. md:hidden. |
| Breadcrumbs | buttons | Page chain with icons. Last crumb is current. Mount shows Link2 plus name / relPath. |
| Empty header | copy | No page selected |
| Sync chip | badge | Guest: Local only. Signed-in: Saving… / Saved to DB / Sync error. Hidden below `sm`. |
| Theme | icon | Label names the destination: Switch to light/dark theme |
| Import/export | icon | FileDown, only when a page or mount is open |
| Favorite | star | aria-label Favorite / Unfavorite. Page only, not mounts. |
| Sign in | link | **Sign in to sync** → `/login` when auth enabled and signed out. Hidden below `sm`. |
| Loading | full screen | Loading workspace… or Loading workspace from database… |
| Empty main | CTA | No page open; New page + Open sidebar. Copy also mentions linking a folder without importing. |

## States
- **Hydrating / auth / remote load**: Centered pulse, no chrome.
- **Guest**: Local only chip; data in this browser.
- **Signed in**: Postgres sync chip.
- **No page**: Empty workspace CTAs.
- **Mount selected**: Markdown view instead of PageEditor.
- **Narrow viewport**: sync chip and sign-in hidden; hamburger drawer for nav.

## Acceptance Criteria
- [ ] Desktop shows sidebar + header + main; mobile uses hamburger drawer.
- [ ] Breadcrumbs walk parent pages; last crumb is current.
- [ ] Theme control names the destination theme, not the current one.
- [ ] Sync chip distinguishes local-only vs Saving… / Saved to DB / Sync error.
- [ ] Empty state offers New page and Open sidebar.
- [ ] Linked folder selection replaces the page editor with mounted markdown.
- [ ] Sign-in control, when shown, reads Sign in to sync.

## Notes
- Source: src/components/layout/AppShell.tsx, Sidebar.tsx.
