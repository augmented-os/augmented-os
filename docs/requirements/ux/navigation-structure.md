# Navigation Structure — Build vs Work

---

## 1  Overview

This navigation structure expresses the app’s navigation as **two sibling trees** — one for **Build** mode and one for **Work** mode — instead of a single sidebar. Each tree is surfaced through:

- the **Search ⌘K overlay** (type‑ahead commands)
- context links inside pages (e.g., breadcrumbs, action buttons)
- optional top‑bar menus for first‑time discoverability.

---

## 2  Build mode tree (`/build/*`)

```
/build
├─ Home  📊  (dashboard: drafts, test failures, perf hints)
├─ Workflows
│   ├─ Definitions      (/build/workflows)
│   ├─ Designer         (/build/workflows/{id})
│   ├─ Tests            (/build/workflows/{id}/tests)
│   └─ Triggers         (/build/workflows/{id}/triggers)
├─ Data
│   ├─ Entities         (/build/data/entities)
│   ├─ Datasets         (/build/data/datasets)
│   └─ Schemas          (/build/data/schemas)
├─ Documents
│   ├─ Templates        (/build/docs/templates)
│   └─ Schemas          (/build/docs/schemas)
├─ Integrations
│   ├─ Catalog          (/build/integrations)
│   └─ Connection Setup (/build/integrations/{id})
├─ Store 📦  (/build/store)      (discover/install components)
└─ Admin ⚙︎  (/build/admin)      (roles, feature flags, env vars)
```

*Primary persona*: **Mark Reynolds** (builder/integrator).

---

## 3  Work mode tree (`/work/*`)

```
/work
├─ Home  🏠  (tasks due today, recent runs, alerts)
├─ Tasks
│   ├─ Inbox            (/work/tasks)
│   ├─ Team Board       (/work/tasks/team)
│   └─ Exception Queue  (/work/tasks/exceptions)
├─ Workflow Runs        (/work/runs)
│   └─ Run Detail       (/work/runs/{id})
├─ Data                 (/work/data)          (read‑only)
├─ Documents            (/work/docs)          (read‑only + download)
├─ Agent Chat 🤖        (/work/agent)         (CopilotKit context)
└─ Notifications 🔔     (/work/notifications)
```

*Primary persona*: **Sarah Wilson** (task performer).

---

## 4  How Search ⌘K presents the trees

| User keystrokes | Result                                             |
| --------------- | -------------------------------------------------- |
| “desi…”         | `Build > Workflows > Designer` suggestions first   |
| “my tasks”      | highlights `Work > Tasks > Inbox`                  |
| “store”         | opens **Store** regardless of mode (unique anchor) |

Search overlay prefixes every result with **B** or **W** badge so users know which mode it will open.

---

## 5  Linking rules between modes

| Resource type | Build page → Work page                                                                      |
| ------------- | ------------------------------------------------------------------------------------------- |
| Workflow      | Designer `/build/workflows/{id}` → `View Runs` action sends to `/work/runs?workflowId={id}` |
| Task          | N/A (tasks don’t exist in Build)                                                            |
| Data entity   | Schema editor → `Preview instances` opens read‑only entity list in Work                     |
| Document      | Template editor → `Preview docs` opens run‑time doc list                                    |

Cross‑links always open in **new tab** to preserve builder’s place.

---

## 6  Next evolution ideas

- Tagged **favourites** list in Search overlay for ultra‑quick access.
- **Mode‑aware deep links** from CopilotKit suggestions.
- Permission‑based pruning of tree nodes (non‑designers never see Build pages).