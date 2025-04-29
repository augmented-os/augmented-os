# Workflow Designer Structure

> **Mode:** Design-Time

docs/requirements/features/workflow_management/
├── README.md (Overview of workflow management features)
├── workflow-designer/
│   ├── README.md (Core feature overview and main concepts)
│   ├── layout/
│   │   ├── header.md (Top bar with workflow name and menu items)
│   │   └── overall-structure.md (Layout arrangement of all components)
│   ├── canvas/
│   │   ├── appearance.md (Visual styling, node representation, colors)
│   │   ├── interaction.md (Zoom, pan, selection behaviors)
│   │   ├── validation.md (Visual validation indicators)
│   │   └── organization.md (Groups, layout tools, annotations)
│   ├── nodes/
│   │   ├── README.md (Overview of node types)
│   │   ├── code-task-nodes.md
│   │   ├── agent-task-nodes.md
│   │   ├── integration-task-nodes.md
│   │   ├── human-task-nodes.md
│   │   ├── decision-nodes.md
│   │   ├── parallel-nodes.md
│   │   ├── event-wait-nodes.md
│   │   └── start-end-nodes.md
│   └── panels/
│       ├── README.md (Panel behavior and transitions)
│       ├── node-palette.md (Node selection and categorization)
│       ├── properties-panel.md (Node/edge configuration when selected)
│       ├── settings-panel.md (Workflow-level settings when selected)
│       ├── testing-panel.md (Test definition and execution when selected)
│       ├── runs-panel.md (Execution history when selected)
│       └── ai-assistant-panel.md (AI guidance when selected)
├── workflow-monitor.md (Existing file)