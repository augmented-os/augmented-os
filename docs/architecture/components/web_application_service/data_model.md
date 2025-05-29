# Web Application Service Data Model

## Overview

The Web Application Service component interacts with various data models that represent the core entities and their relationships within the AugmentedOS platform. This document outlines the primary data structures used in the web application, their relationships, and how they are managed on the client side.

The Web Application Service primarily interacts with these data schemas:

* [Workflows Schema](./schemas/workflows.md): For workflow definitions and instances
* [Tasks Schema](./schemas/tasks.md): For task definitions and instances
* [Integrations Schema](./schemas/integrations.md): For integration configurations
* [Analytics Schema](./schemas/analytics.md): For reporting and visualization data
* [User Schema](./schemas/users.md): For user profiles and preferences
* [UI Components Schema](./schemas/ui_components.md): For dynamic UI component definitions
* [Universal Flag System](../../../universal-flag-system.md): For semantic row styling and status indication

This document focuses on how the Web Application Service component specifically implements and extends these canonical schemas for client-side usage. For complete schema definitions, please refer to the linked documentation.

## Client-Side Data Model Implementation

The Web Application Service extends the canonical schemas with additional client-specific structures and optimizations to support efficient rendering, state management, and user interactions.

### Workflow Data Model

The client-side workflow model extends the server-side model with UI-specific properties:

```typescript
interface ClientWorkflow {
  // Core properties from server model
  id: string;
  name: string;
  description: string;
  version: number;
  status: WorkflowStatus;
  createdAt: string;
  updatedAt: string;
  
  // Client-specific extensions
  isSelected: boolean;
  isExpanded: boolean;
  uiState: {
    canvasPosition: { x: number, y: number };
    zoom: number;
    selectedStepId: string | null;
    viewMode: 'design' | 'test' | 'monitor';
  };
  validationErrors: ValidationError[];
  localChanges: boolean;
}

interface WorkflowStep {
  id: string;
  type: StepType;
  name: string;
  description: string;
  configuration: Record<string, any>;
  position: { x: number, y: number };
  nextSteps: string[];
  
  // Client-specific extensions
  isSelected: boolean;
  isValid: boolean;
  validationErrors: ValidationError[];
  uiState: {
    isExpanded: boolean;
    isConfiguring: boolean;
  };
}
```

### Task Data Model

The client-side task model includes UI state and universal flag system integration:

```typescript
// Universal flag types for semantic row styling
type FlagType = 'error' | 'warning' | 'success' | 'info' | 'pending' | null;

interface ExtractedTerm {
  term: string;
  value: string;
  standard: string;
  flag: FlagType; // Semantic flag instead of boolean
}

interface ClientTask {
  // Core properties from server model
  id: string;
  workflowInstanceId: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Enhanced task data with flag system
  input: {
    submissionData: {
      company: string;
      valuation: string;
      investment: string;
      equity: string;
      extractedTerms: ExtractedTerm[]; // Uses semantic flags
    };
  };
  
  // Client-specific extensions
  isSelected: boolean;
  isExpanded: boolean;
  uiState: {
    isEditing: boolean;
    showDetails: boolean;
    showHistory: boolean;
  };
  localChanges: boolean;
}
```

### Integration Data Model

The client-side integration model includes configuration state:

```typescript
interface ClientIntegration {
  // Core properties from server model
  id: string;
  name: string;
  type: IntegrationType;
  status: IntegrationStatus;
  configuration: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  
  // Client-specific extensions
  isSelected: boolean;
  isExpanded: boolean;
  uiState: {
    isConfiguring: boolean;
    testStatus: 'idle' | 'testing' | 'success' | 'failure';
    testResults: TestResult | null;
  };
  validationErrors: ValidationError[];
  localChanges: boolean;
}
```

### UI Components Data Model

The client-side UI components model supports the dynamic UI system with flag configuration:

```typescript
interface ClientUIComponent {
  // Core properties from server model
  componentId: string;
  name: string;
  description: string;
  componentType: 'Form' | 'Modal' | 'Display' | 'Custom';
  title: string;
  fields?: FormField[];
  actions?: ActionButton[];
  layout?: LayoutConfig;
  customProps?: {
    displayType?: 'table' | 'card' | 'actions';
    flagConfig?: FlagConfiguration;
    [key: string]: any;
  };
  
  // Client-specific extensions
  isLoaded: boolean;
  isLoading: boolean;
  error?: string;
  cachedAt?: string;
}

interface FlagConfiguration {
  field: string;
  configName: string;
  styles: Record<FlagType, string>;
  badgeConfigs: Record<FlagType, {class: string; text: string}>;
}
```

### User Preferences Model

Client-specific user preferences that affect the UI:

```typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  dashboardLayout: WidgetLayout[];
  notificationSettings: {
    email: boolean;
    browser: boolean;
    desktop: boolean;
  };
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  recentItems: {
    workflows: RecentItem[];
    tasks: RecentItem[];
    integrations: RecentItem[];
  };
  // Flag system preferences
  flagPreferences: {
    defaultConfig: string;
    highlightProblematic: boolean;
    showBadges: boolean;
  };
}

interface RecentItem {
  id: string;
  name: string;
  type: string;
  accessedAt: string;
}
```

## Universal Flag System Integration

The Web Application Service integrates with the Universal Flag System to provide consistent semantic row styling across the application.

### Flag Type System

```typescript
// Core flag types
type FlagType = 'error' | 'warning' | 'success' | 'info' | 'pending' | null;

// Flag configuration reference
interface FlagConfigReference {
  configName: string;
  styles: Record<FlagType, string>;
  badgeConfigs: Record<FlagType, {class: string; text: string}>;
}

// Common flag configurations
const FLAG_CONFIGURATIONS = {
  default: 'General purpose styling',
  financial_review: 'Financial data review styling',
  compliance: 'Compliance and legal review styling'
} as const;
```

### Flag-Enhanced Data Structures

Data structures throughout the application use semantic flags:

```typescript
// Task data with semantic flags
interface TaskSubmissionData {
  company: string;
  valuation: string;
  investment: string;
  equity: string;
  extractedTerms: Array<{
    term: string;
    value: string;
    standard: string;
    flag: FlagType; // Semantic flag
  }>;
}

// Generic flagged item interface
interface FlaggedItem {
  id: string;
  name: string;
  value: string;
  status: string;
  flag: FlagType;
  [key: string]: any;
}
```

## Data Relationships

The following diagram illustrates the relationships between the primary data entities in the Web Application Service:

```
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│               │       │               │       │               │
│     User      │───────│   Workflow    │───────│  Integration  │
│               │       │               │       │               │
└───────────────┘       └───────────────┘       └───────────────┘
                               │                       │
                               │                       │
                        ┌──────┴──────┐        ┌──────┴──────┐
                        │             │        │             │
                        │    Task     │        │ UI Component │
                        │             │        │             │
                        └─────────────┘        └─────────────┘
                               │                       │
                               │                       │
                        ┌──────┴──────┐        ┌──────┴──────┐
                        │             │        │             │
                        │  Analytics  │        │ Flag Config │
                        │             │        │             │
                        └─────────────┘        └─────────────┘
```

## Client-Side Data Management

The Web Application Service manages these data models using several strategies:

### State Management

* **Global State**: Application-wide state managed by Redux
* **Local State**: Component-specific state managed by React hooks
* **Server State**: Remote data managed by React Query
* **UI Component Cache**: Cached UI component schemas for performance
* **Flag Configuration Cache**: Cached flag configurations for consistent styling

### Data Synchronization

* **Optimistic Updates**: Immediate UI updates with background synchronization
* **Conflict Resolution**: Strategies for handling conflicting changes
* **Offline Support**: Local storage of data for offline operation
* **Schema Versioning**: Support for UI component schema evolution
* **Flag Data Migration**: Automatic migration from boolean to semantic flags

### Caching Strategies

* **Memory Cache**: Short-term caching for session data
* **Persistent Cache**: Long-term caching using IndexedDB
* **Cache Invalidation**: Rules for refreshing stale data
* **Component Schema Cache**: Intelligent caching of UI component definitions
* **Flag Configuration Cache**: Efficient storage of flag styling configurations

### Flag System Data Flow

The flag system data flow ensures consistent styling across components:

1. **Flag Data Source**: Task instances contain flagged data with semantic flag values
2. **Configuration Lookup**: Components reference flag configurations by name
3. **Style Application**: Dynamic styling based on flag type and configuration
4. **Cache Management**: Flag configurations are cached for performance
5. **Updates**: Flag data updates trigger consistent re-rendering across components

## Related Documentation

* [Technical Architecture Overview](./technical_architecture/overview.md)
* [State Management](./technical_architecture/state_management.md)
* [Data Management](./technical_architecture/data_management.md)
* [API Integration](./technical_architecture/api_integration.md)
* [UI Components Schema](./schemas/ui_components.md)
* [Universal Flag System](../../../universal-flag-system.md) 