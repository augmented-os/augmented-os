# Copilot Context Contract

This file formalises the **JSON payload and React hook** pages use to push real‑time context to CopilotKit.

---

## 1  Why it matters
Accurate context lets the AI assistant:
* tailor suggestions (e.g., “Add retry logic to *Send Email* step”)
* jump users to the right view (`/build` ↔ `/work` rewrite)
* respect unsaved changes before executing auto‑actions.

---

## 2  Type definition
```ts
/**
 * Dispatched whenever the shell route or page state changes.
 */
export interface CopilotContext {
  /** Operating mode reflects URL prefix */
  mode: 'build' | 'work';
  /** Full pathname so Copilot can construct deep links */
  route: string;
  /** Optional primary entity in focus */
  entity?: {
    type: 'workflow' | 'task' | 'dataset' | 'doc' | string;
    id: string;
    name?: string;
  };
  /** Page‑specific selection (e.g., selected node ids on the canvas) */
  selection?: unknown;
  /** Indicates there are unsaved edits the user might lose */
  unsavedChanges?: boolean;
}
```

---

## 3  React helper
```tsx
import { createContext, useContext } from 'react';

export const CopilotCtx = createContext<{ publish: (ctx: CopilotContext) => void }>({
  publish: () => {},
});

export function useCopilotContext() {
  const { publish } = useContext(CopilotCtx);
  return { publish };
}
```
Pages call `publish()` inside `useEffect` whenever relevant state changes.

---

## 4  Lifecycle & delivery
1. Page publishes context
2. **Shell provider** diffs against last context → debounces 300 ms
3. Sends payload to Copilot sidebar via `postMessage` *or* direct prop if embedded
4. Sidebar merges with retained memory to create prompt context

---

## 5  Extensibility
* `entity.type` & `selection` are free‑form → micro‑frontends can introduce new values (e.g., `step`, `integration`).
* Keep payload under **4 KB** to avoid prompt bloat; large selections should be summarised.

---

## 6  Related docs
* [Sidebar Layout](split_view_architecture.md)
* [Navigation Structure](../../../../requirements/ux/navigation-structure.md)

