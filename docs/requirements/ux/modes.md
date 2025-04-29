# Operating Modes: Design‑Time vs Run‑Time

---

## 1  Why two modes?

Augmented OS serves two very different moments in the product lifecycle:

| Moment          | Mental Question                             | Typical User Frame of Mind             |
| --------------- | ------------------------------------------- | -------------------------------------- |
| **Design‑Time** | *“How do I model or change the system?”*    | Creative / exploratory / configuration |
| **Run‑Time**    | *“What work needs my attention right now?”* | Focused execution / monitoring         |

Keeping the concerns separate prevents screen clutter, simplifies permissions, and lets the UI surface the right context for the job.

---

## 2  Side‑by‑side comparison

| Dimension                | **Design‑Time**                                                                                                            | **Run‑Time**                                                                                                             |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Primary audience**     | Workflow builders, integrators, ops engineers, template authors                                                            | Task performers, approvers, operators, business users                                                                    |
| **Key goals**            | • Create / edit workflows• Register integrations & data schemas• Define documents/templates• Configure notifications, SLAs | • See & complete tasks• Monitor workflow runs & exceptions• Chat with agents / view generated docs & data• Triage alerts |
| **Core UI artifacts**    | *Workflow Designer*, *Trigger Editor*, *Data & Doc schema panels*, *Integration wizard*                                    | *Task Inbox & Board*, *Workflow Run Monitor*, *Agent Chat*, *Exception Queue*                                            |
| **Typical write‑paths**  | Writes definitions to Business‑Store‑Service (versioned)                                                                   | Writes state updates & outputs to runtime DBs; reads definitions read‑only                                               |
| **Navigation hierarchy** | Project ▶︎ Definition ▶︎ Version ▶︎ Details                                                                                | Work Queue ▶︎ Item ▶︎ Action screen                                                                                      |
| **Cadence**              | Irregular — bursts during build phases                                                                                     | Daily / hourly                                                                                                           |
| **Permission accent**    | CRUD on definitions, can publish versions                                                                                  | Mostly read/update on instances; limited to own/role scope                                                               |

---

## 2.5 Persona focus

| Persona                                        | Primary mode(s)              | Typical use cases                                                                                    |
| ---------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Mark Reynolds — AI Automation Agency Owner** | Design‑time **and** Run‑time | • Builds reusable workflow templates for clients• Monitors task exceptions when automations escalate |
| **Sarah Wilson — Short‑Term Rental Manager**   | Run‑time                     | • Clears daily Task Inbox (guest comms & maintenance)• Checks workflow runs for problem stays        |
| **Workflow Designer (internal)**               | Design‑time                  | • Models enterprise workflows, schemas, integrations                                                 |
| **System Integrator**                          | Design‑time                  | • Registers connectors, sets up triggers & auth                                                      |
| **Knowledge Worker / Approver**                | Run‑time                     | • Completes manual tasks, approvals, exception handling                                              |

## 3  What lives in **both** modes?  What lives in **both** modes?

- **Home / Dashboards** – high‑level KPIs surface aggregates from both layers.
- **AI Copilot (CopilotKit)** – context‑aware overlay that follows the user everywhere.
- **Search / Command Palette** – global quick‑open that can jump to either mode.

---

## 4  Practical implications for the Web‑App shell

- **Mode switcher:** a small toggle (or URL prefix) swaps the visible IA.
- **No permanent sidebar:** free up space for Copilot overlay. Primary navigation lives in a top bar + in‑context breadcrumbs/command palette.
- **URL structure example:**
  - `/build/…` → Design‑time routes (definitions)
  - `/work/…`  → Run‑time routes (instances/tasks)

---

## 5  Glossary (first cut)

| Term                       | Meaning                                                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Definition**             | A version‑controlled asset edited in design‑time (workflow, data schema, document template, integration config). |
| **Instance**               | A live entity produced at run‑time (workflow run, task, document version, dataset record).                       |
| **Business Store Service** | Unified storage backing both modes: holds versioned definitions **and** runtime artefacts (data/docs).           |

---

