# Adversarial Review: ForgeNotes shell (running app)

**Wireframe:** `wireframes/shell.md`  
**Verdict:** PASS WITH NOTES

Launched the Vite web server as a guest. Walked shell AC at 1280×800 and 390×844.

## Criteria

- [x] Desktop sidebar + header + main — PASS
- [x] Theme control names the destination — PASS (`Switch to dark theme`)
- [x] Guest sync chip is Local only — PASS
- [x] Empty state offers New page and Open sidebar — PASS when no page is selected (first paint). A persisted workspace auto-opens a page, so the empty CTA is not on every load.
- [x] Sign in to sync copy present — PASS
- [x] Mobile hamburger Open sidebar opens a drawer — PASS
- [x] At ~390px no horizontal overflow — PASS
- [x] No uncaught console errors — PASS

## Notes

- Linked-folder → mounted markdown not exercised this pass.
- Breadcrumb parent walk not exercised (needs a nested page selected).
