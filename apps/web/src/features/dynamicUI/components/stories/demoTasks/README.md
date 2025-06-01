# Demo Tasks - Business Domain Scenarios

This directory contains business domain-specific demonstrations of the Dynamic UI system. Each domain folder showcases real-world scenarios across different industries and use cases.

## 📁 Organization Structure

```
demoTasks/
├── overview/           # Welcome and navigation guide
├── coding/            # Software development workflows
├── ecommerce/         # Online retail and commerce
├── finance/           # Banking and financial services
├── yc/               # Startup and venture scenarios
└── README.md         # This documentation
```

## 🎯 Domain Overview

### Overview
**Path:** `demoTasks/overview/`
- **Purpose:** Introduction and navigation guide for demo tasks
- **Stories:** Welcome overview explaining the demo system

### Coding Domain
**Path:** `demoTasks/coding/`
- **Purpose:** Software development and tech company workflows
- **Stories:**
  - **Code Review** - Pull request lifecycle (pending → approved → merged)
  - **Bug Reporting** - Issue tracking with different severity levels
  - **Sprint Planning** - Agile planning process from backlog to active sprint
  - **Deployment Pipeline** - CI/CD workflow from build to production

### E-commerce Domain
**Path:** `demoTasks/ecommerce/`
- **Purpose:** Online retail, inventory, and customer management
- **Stories:**
  - **Order Processing** - Complete order lifecycle from payment to delivery
  - **Product Catalog** - Product management with inventory states
  - **Customer Service** - Support ticket handling and resolution
  - **Inventory Management** - Stock tracking and supply chain

### Finance Domain
**Path:** `demoTasks/finance/`
- **Purpose:** Banking, investments, and financial planning
- **Stories:**
  - **Loan Application** - Credit assessment and approval process
  - **Investment Portfolio** - Asset management and performance tracking
  - **Expense Reporting** - Corporate expense submission and approval

### YC (Startup) Domain
**Path:** `demoTasks/yc/`
- **Purpose:** Y Combinator-style startup and venture scenarios
- **Stories:**
  - **YC Application** - Accelerator application process
  - **Investor Updates** - Monthly progress reports to investors
  - **Pitch Deck Submission** - Fundraising presentation workflows

## 🔄 Story Structure

Each story file follows this pattern:

### Multi-State Stories
Each scenario includes multiple story exports representing different states:

```typescript
// Example: OrderProcessing.stories.tsx
export const NewOrder: Story = { /* Pending payment */ };
export const PaymentConfirmed: Story = { /* Ready for fulfillment */ };
export const InFulfillment: Story = { /* Being packed */ };
export const Shipped: Story = { /* In transit */ };
export const Delivered: Story = { /* Successfully delivered */ };
```

### Story Metadata
- **Component Documentation:** Explains the business scenario
- **Story Descriptions:** Details the specific state or stage
- **Action Handlers:** Interactive demonstrations of user workflows

## 🎨 Storybook Navigation

The stories appear in Storybook with hierarchical titles:

```
Demo Tasks/
├── Overview/
│   └── Welcome Overview
├── Coding/
│   ├── Code Review/
│   │   ├── Pending Review
│   │   ├── Approved - Ready to Merge
│   │   ├── Changes Requested
│   │   └── Successfully Merged
│   ├── Bug Reporting/
│   └── Sprint Planning/
├── E-commerce/
│   ├── Order Processing/
│   └── Product Catalog/
├── Finance/
│   └── Loan Application/
└── YC/
    └── YC Application/
```

## 💡 Usage Patterns

### For Developers
- **Component Testing:** See how UI components handle different data states
- **Workflow Understanding:** Learn business logic and state transitions
- **Integration Examples:** Real-world usage patterns with authentic data

### For Product Managers
- **Feature Validation:** Validate user experience flows
- **Stakeholder Demos:** Show realistic business scenarios
- **Requirements Gathering:** Use as templates for new features

### for QA Teams
- **Test Case Generation:** Use states as test scenarios
- **Edge Case Identification:** See error and validation states
- **User Journey Testing:** End-to-end workflow validation

## 🛠️ Adding New Demo Scenarios

### Create New Domain
1. Create domain folder: `demoTasks/newDomain/`
2. Add scenario files: `NewScenario.stories.tsx`
3. Update this README with domain description

### Add Scenario to Existing Domain
1. Create new `.stories.tsx` file in domain folder
2. Follow naming convention: `ScenarioName.stories.tsx`
3. Include multiple states for the workflow
4. Add comprehensive documentation

### Story File Template
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from '../../../DynamicUIRenderer';
import { UIComponentSchema } from '../../../../types/schemas';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Demo Tasks/Domain/Scenario Name',
  component: DynamicUIRenderer,
  parameters: {
    docs: {
      description: {
        component: `
# Scenario Name

Brief description of the business scenario and what it demonstrates.

**States Include:**
- State 1 - Description
- State 2 - Description
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof DynamicUIRenderer>;

// Schema and stories...
```

## 📈 Metrics & Analytics

### Story Usage
- Track which domains are most viewed
- Monitor story interaction patterns
- Identify popular workflows

### Business Value
- Demonstrate system capabilities across industries
- Provide realistic testing scenarios
- Enable stakeholder understanding

---

**Last Updated:** October 2024  
**Maintainers:** Dynamic UI Team  
**Related:** Component stories, System integration, Schema patterns 