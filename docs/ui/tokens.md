# Design tokens

**Source:** `src/styles.css` — the `@theme` block and the `.dark` override block
**Applies to:** every screen. This file is the shared vocabulary the other rubrics
point at, so a rubric can say *"surfaces use `--color-card`"* instead of naming a hex.

Tailwind v4 here is **CSS-first**: there is no `tailwind.config.*` and no
`postcss.config.*`. A token added anywhere but `@theme` does not exist.

## Palette

Every colour is defined twice — once in `@theme` (light) and once in `.dark`. The
`.dark` class lands on `<html>` from `useTheme()` in `src/routes/__root.tsx`.

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--color-background` | `#ffffff` | `#191919` | page canvas |
| `--color-foreground` | `#1a1a1a` | `#e8e8e8` | body text |
| `--color-card` | `#ffffff` | `#202020` | raised surfaces |
| `--color-popover` | `#ffffff` | `#252525` | menus, popovers, dialogs |
| `--color-primary` | `#1a1a1a` | `#e8e8e8` | primary button fill |
| `--color-primary-foreground` | `#fafafa` | `#191919` | text on primary |
| `--color-secondary` / `--color-muted` / `--color-accent` | `#f2f1ee` | `#2a2a2a` | quiet fills — all three are the same value |
| `--color-muted-foreground` | `#6b6b6b` | `#9b9b9b` | secondary text, placeholders |
| `--color-destructive` | `#c2410c` | `#ea580c` | errors, destructive actions |
| `--color-border` / `--color-input` | `#e8e7e4` | `#333333` | hairlines and field borders |
| `--color-ring` | `#a3a3a3` | `#6b6b6b` | focus ring |

**Sidebar has its own five tokens** — it is a distinct surface, not `card` reused:

| Token | Light | Dark |
|---|---|---|
| `--color-sidebar` | `#f7f6f3` | `#202020` |
| `--color-sidebar-fg` | `#3f3f3f` | `#cfcfcf` |
| `--color-sidebar-border` | `#ebeae6` | `#2e2e2e` |
| `--color-sidebar-hover` | `#efeee9` | `#2a2a2a` |
| `--color-sidebar-active` | `#e8e7e2` | `#2f2f2f` |

Note in dark mode `--color-sidebar` (`#202020`) is *lighter* than
`--color-background` (`#191919`), and in light mode it is *darker* than white. The
sidebar reads as recessed either way, but by opposite means — a rubric that asserts
"sidebar is darker than the canvas" is wrong half the time. Assert *contrast exists*,
not its direction.

## Type and shape

| Token | Value |
|---|---|
| `--font-sans` | `"Segoe UI", "Helvetica Neue", ui-sans-serif, system-ui, -apple-system, sans-serif` |
| `--font-mono` | `ui-monospace, "SF Mono", Menlo, Consolas, monospace` |
| `--radius-sm` / `md` / `lg` / `xl` | `0.375` / `0.5` / `0.75` / `1` rem |

`Segoe UI` is not present on macOS, so the desktop app and local WebKit captures
resolve to `Helvetica Neue`. Wireframes and screenshots will differ in metrics from
any Windows capture. **Font rendering is always an Acceptable Difference.**

## Base-layer behaviour worth knowing before writing a rubric

- **Everything gets `border-border`.** `@layer base { * { @apply border-border } }`
  means an element with `border` but no colour class is *not* unstyled — it inherits
  the theme hairline.
- **Empty `contenteditable` shows `data-placeholder`** via a `::before` rule at 55%
  muted-foreground. Editor placeholder text is CSS, not a DOM node — it will not
  appear in an accessibility snapshot, only in a screenshot.
- **Scrollbars are `scrollbar-width: thin`** and semi-transparent. Presence and
  width vary by platform and by whether content overflows; always acceptable.
- **`prefers-reduced-motion` already collapses animation to 0.01 ms.** A CI runner or
  VM with that setting reproduces most of `.ui-freeze` for free — which is why a
  screenshot that looks frozen is not evidence that freeze mode is on.

## Capture mode

Two classes on `<html>`, set by `useCaptureMode()` (`src/lib/use-capture-mode.ts`)
from `localStorage`, and **gated on `import.meta.env.DEV`** — production ignores both.

| Class | localStorage key | Effect |
|---|---|---|
| `.ui-freeze` | `forgenotes-ui-freeze` | `animation`/`transition: none`; `caret-color: transparent`; hides `[data-sonner-toaster]`; `[data-volatile]` → `visibility: hidden` |
| `.ui-reveal` | `forgenotes-ui-reveal` | `[data-hover-reveal]` → `opacity: 1` |

Theme is seeded separately through the zustand `persist` key:

```js
localStorage["workspace-v1"] = '{"state":{"theme":"dark"},"version":0}'
```

Three details that cost time if you don't know them:

- **`[data-volatile]` uses `visibility`, not `display`.** The box keeps its size, so
  the layout does not reflow. A hidden duration still occupies its slot — that is
  deliberate, and a rubric should not read the gap as a missing element.
- **`.ui-freeze` is appearance-only, never behaviour.** It stubs no component, so a
  frozen screenshot still reflects the real render tree. It cannot hide a bug.
- **`.ui-reveal` exists because hover affordances are `opacity-0`, not unmounted.**
  They are clickable in both states, so only a *screenshot* can tell whether someone
  converted `opacity-0` into a real `hidden` and silently broke nothing testable.

## Rubric fragment — reusable

Paste these into any screen rubric rather than re-deriving them.

### Acceptable Differences (always)
- Font family and hinting — `Segoe UI` is absent on macOS, so captures use `Helvetica Neue`
- Sub-pixel spacing, scrollbar presence and width
- Dynamic data: page titles, timestamps, counts, user names

### Failure Criteria (always)
- A light surface while `.dark` is on `<html>` — means the theme class did not reach that subtree
- Body text on background below roughly 4.5:1 — `--color-muted-foreground` on
  `--color-background` is the tightest pair in the system and is intended for
  secondary text only
- A focus ring that is invisible or absent on a keyboard-reachable control
