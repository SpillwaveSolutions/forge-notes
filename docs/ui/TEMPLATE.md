# &lt;Screen name&gt;

**Source:** `src/components/.../Foo.tsx` (lines N–M)
**Reach:** `/` → click X → click Y
**States:** a, b, c

> Copy this file to `docs/ui/<screen>.md` and fill it in. One document per screen
> *family* — spec and rubric live together because they are read together and rot
> together.

## Spec

What the screen is for. Its layout regions. What data comes in, what actions go
out. Keyboard affordances. Empty, loading, and error states.

## Addressability

How an agent targets things here. Prefer roles and names; add a testid only where
visible text is absent or ambiguous.

| What | Selector |
|---|---|
| container | `[data-testid="foo-root"]` |
| primary action | `role=button[name="Save"]` |

## Capture recipe

**Mandatory, not optional.** Almost nothing in this app has a URL — every panel and
dialog is `AppShell`-internal state — so a screen that does not document its click
path cannot be captured by anyone who did not write it.

1. Seed `localStorage["workspace-v1"] = {"state":{"theme":"dark"},"version":0}` for the dark variant
2. Seed `localStorage["forgenotes-ui-freeze"] = "1"` — and `"forgenotes-ui-reveal"` for revealed variants
3. Load `/`, viewport 1280×800
4. &lt;click sequence&gt;
5. `webview_wait_for` on the state marker, e.g. `[data-wizard-step="provider"]`
6. `webview_screenshot`

## Wireframe

![](wireframes/png/foo-01-default.png) — source `wireframes/foo-01-default.puml`

## Rubric

Keep **Must Match** to 6–10 items. A thirty-item rubric gets skimmed, and a skimmed
rubric is worse than none because it reports confidence it does not have.

### Must Match
- [ ] Structure, ordering, presence — the things a bad redesign would break

### Acceptable Differences
- Font hinting, sub-pixel spacing, scrollbar presence
- Dynamic data (names, timestamps, counts)

Write this section **honestly**. An over-strict list means every run reports noise,
and a rubric that cries wolf gets ignored within a week.

### Must NOT Appear
- Hover affordances while capturing a rest state
- Spinners, toasts, raw volatile values

This is how the `opacity-0` → `hidden` regression gets caught: an affordance that
starts appearing in rest captures means someone changed how it is hidden.

### Failure Criteria
- Overlapping or clipped content, unreadable contrast, a control off-screen
- Wrong theme tokens (light surface in dark mode)
