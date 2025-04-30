# Web‑App Shell Concept

## 1  Purpose
The shell is the **permanent chrome** that frames every screen of Augmented OS. It provides:

* **Global navigation** between the two operating modes — **Build** (`/build/…`) and **Work** (`/work/…`).
* A stable mount‑point for **CopilotKit** so the AI assistant is available everywhere.
* A consistent **Search/Command Palette** / quick‑open, replacing a traditional sidebar.
* Session‑wide context (org switcher, environment badge, notifications).

Keeping the chrome ultra‑thin avoids stealing space from complex canvases while letting mode‑specific micro‑apps load inside.

---

## 2  High‑level layout

```
┌──────────────────────────────────────────────────────────────────┐
│ Top Bar                                                          │
│ ┌────┬───────────┐  ─────────────────────────────  ────────────┐ │
│ │ ☰ │   Logo     │  (breadcrumbs)    │ Mode 🔄 │ │
│ └────┴───────────┘                                       ──────┘ │
│ [ Search ⌘K ]    [ User Menu ]    [ Env Tag ]              │
├──────────────────────────────────────────────────────────────────┤
│ CopilotKit Sidebar  (collapsible, resizable)                    │
│ ┌───────────────────┐┬────────────────────────────────────────┐ │
│ │  AI chat, tips,   ││                                        │ │
│ │  actions, history ││    Application Canvas (route outlet)   │ │
│ │                   ││                                        │ │
│ └───────────────────┘┴────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

*The **left sidebar** is a dedicated mount‑point for **CopilotKit**. Users can collapse/expand it with `⌥ ⌘ ←` and `⌥ ⌘ →` shortcuts.*

## 3  Mode switch mechanics  Mode switch mechanics

| Action | Result | UX affordance |
|--------|--------|---------------|
| Toggle button in top‑bar | **Rewrite prefix** `location.replace('/work' ⇄ '/build')` preserving the remainder of the path (`/work/workflows/abc` ↔ `/build/workflows/abc`) | Visible pill with Build 🛠 / Work ⚡ label |
| Keyboard (`⌥M`) | Same rewrite | Quick context flip without mouse |
| Search/Command Palette entry | Navigate to parallel route | Palette search picks counterpart entity |

The shell itself never re‑mounts; only the **router outlet** swaps modules, letting React keep global context (theme, auth) intact.

---

## 4  CopilotKit integration points

| Layer | Hook | Data passed |
|-------|------|-------------|
| *Top‑bar* | `<CopilotActionMenu/>` | Current route meta, selected entity ID |
| *Overlay* | `<CopilotPanel/>` (portal) | Full page context (mode, entity JSON, selection) |
| *Search/Command Palette* | Plug‑in exposes “Ask Copilot” command | Free‑form prompt |

The shell provides **`CopilotProvider`** high up in the tree so nested features can register context injectors.

---

## 5  Bundle & route structure (Next.js App Router example)

```
app/
  build/
    layout.tsx   ← lazy‑loaded only in Build mode
    [...slug]/page.tsx
  work/
    layout.tsx   ← lazy‑loaded only in Work mode
    [...slug]/page.tsx
  (shell)/
    layout.tsx   ← global Shell (top‑bar, provider)
```
*Chunking*: routes under `/build` and `/work` compile to separate JS chunks, cutting initial payload ~40‑50 %.

---

## 6  Accessibility & responsiveness

* **Focus order**: Top‑bar first, then content canvas; overlay steals focus only when open.
* **Skip link**: “Skip to main content” visibly appears for keyboard users.
* **Breakpoints**: At ≤1024 px, top‑bar compresses: breadcrumbs collapse, Environment tag hides behind “more” menu; palette becomes primary nav.
* **Reduced motion**: Shell animations respect user `prefers‑reduced‑motion`.

---

## 7  Open questions
1. Do we expose environment/org switcher inline with mode toggle or separate menu?  
2. Should Copilot overlay remember last‑open width/position per mode?  
3. Where do we surface global alerts (e.g., system maintenance) without a sidebar?
