# Linting Resolution Report

The following lint issues remain unresolved and require technical guidance to address correctly:

- Numerous `@typescript-eslint/no-explicit-any` errors in `src/nodes/*.ts` files (`EventWaitNodes.ts`, `HumanTaskNodes.ts`, `IntegrationNodes.ts`, `StartEndNodes.ts`). These files define node data structures and runtime logic. Clarification on the intended typing for payloads and props is needed before replacing `any`.

Other obvious issues in configuration and shared components have been addressed.
