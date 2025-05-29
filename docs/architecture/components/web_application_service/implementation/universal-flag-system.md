# Universal Flag System

## Overview

The Universal Flag System provides a semantic, extensible approach to row styling and status indication across different business scenarios. It replaces the previous boolean flag system with meaningful semantic flags that can be consistently applied across the entire application.

## Core Concepts

### Flag Types

The system defines five core flag types that cover most business scenarios:

```typescript
type FlagType = 'error' | 'warning' | 'success' | 'info' | 'pending' | null;
```

- **`error`**: Critical issues, violations, failures (Red styling)
- **`warning`**: Needs attention, non-standard items (Orange/Yellow styling)  
- **`success`**: Approved, compliant, good status (Green styling)
- **`info`**: Informational, neutral highlight (Blue styling)
- **`pending`**: Awaiting action, in progress (Gray styling)
- **`null`**: No special status, standard/default state

### Flag Configurations

The system supports multiple predefined styling configurations for different business contexts:

#### Default Configuration
General purpose styling suitable for most scenarios.

#### Financial Review Configuration  
Optimized for financial data review with enhanced color schemes.

#### Compliance Configuration
Specialized for compliance and legal review processes.

## Database Schema

### Flag Type Enum

```sql
CREATE TYPE flag_type AS ENUM (
  'error',    -- Red: critical issues, violations, failures
  'warning',  -- Orange/Yellow: needs attention, non-standard  
  'success',  -- Green: approved, compliant, good
  'info',     -- Blue: informational, neutral highlight
  'pending'   -- Gray: awaiting action, in progress
);
```

### Flag Configurations Table

```sql
CREATE TABLE flag_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_name text NOT NULL UNIQUE,
  description text,
  flag_styles jsonb NOT NULL DEFAULT '{}'::jsonb,
  badge_configs jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## Data Structure Examples

### Before (Boolean Flags)
```json
{
  "term": "Liquidation Preference",
  "value": "2x Non-participating",
  "standard": "1x Non-participating",
  "flag": true
}
```

### After (Semantic Flags)
```json
{
  "term": "Liquidation Preference", 
  "value": "2x Non-participating",
  "standard": "1x Non-participating",
  "flag": "warning"
}
```

## Cross-Scenario Applications

### Financial Review
```json
{
  "metric": "Debt-to-Equity Ratio",
  "value": "2.5",
  "benchmark": "< 1.5",
  "flag": "error"
}
```

### Compliance Check
```json
{
  "requirement": "SOX Compliance",
  "status": "In Progress", 
  "dueDate": "2024-03-01",
  "flag": "pending"
}
```

### Code Review
```json
{
  "file": "auth.service.ts",
  "securityScan": "Passed",
  "coverage": "95%",
  "flag": "success"
}
```

### Inventory Management
```json
{
  "product": "Widget A",
  "stock": "5 units",
  "reorderPoint": "10 units", 
  "flag": "warning"
}
```

## UI Component Configuration

### Table Display Configuration

```json
{
  "displayType": "table",
  "flagConfig": {
    "field": "flag",
    "configName": "compliance",
    "styles": {
      "error": "bg-red-50 border-l-4 border-red-600",
      "warning": "bg-amber-50 border-l-4 border-amber-600",
      "success": "bg-green-50 border-l-4 border-green-600",
      "info": "bg-cyan-50 border-l-4 border-cyan-600", 
      "pending": "bg-neutral-50 border-l-4 border-neutral-600"
    },
    "badgeConfigs": {
      "error": {"class": "bg-red-100 text-red-900", "text": "Violation"},
      "warning": {"class": "bg-amber-100 text-amber-900", "text": "Non-standard"},
      "success": {"class": "bg-green-100 text-green-900", "text": "Compliant"},
      "info": {"class": "bg-cyan-100 text-cyan-900", "text": "Reference"},
      "pending": {"class": "bg-neutral-100 text-neutral-900", "text": "Under Review"}
    }
  }
}
```

## TypeScript Integration

### Type Definitions

```typescript
// Universal flag types
export type FlagType = 'error' | 'warning' | 'success' | 'info' | 'pending' | null;

// Updated interface
export interface ExtractedTerm {
  term: string;
  value: string;
  standard: string;
  flag: FlagType; // Changed from boolean
}
```

### Helper Functions

```typescript
// Check if flag indicates a problem
export function isFlagProblematic(flag: FlagType): boolean {
  return flag === 'error' || flag === 'warning';
}

// Get flag priority for sorting
export function getFlagPriority(flag: FlagType): number {
  switch (flag) {
    case 'error': return 4;
    case 'warning': return 3;
    case 'pending': return 2;
    case 'info': return 1;
    case 'success': return 0;
    default: return -1;
  }
}

// Get styling classes
export function getTermFlagClass(
  flag: FlagType, 
  configName: 'default' | 'compliance' = 'default'
): string {
  if (!flag) return '';
  return FLAG_STYLES[configName][flag] || '';
}
```

## Migration Guide

### Data Migration

1. **Schema Update**: The flag_type enum and flag_configurations table are automatically created
2. **Data Conversion**: Existing boolean flags are converted to semantic flags:
   - `false` → `"success"` (standard/compliant terms)
   - `true` → `"warning"` or `"error"` (based on severity)

### Code Updates

1. **Type Definitions**: Update interfaces to use `FlagType` instead of `boolean`
2. **Filtering Logic**: Update filter functions to check for specific flag values
3. **Display Logic**: Update components to use semantic flag values
4. **Styling**: Leverage new flag configuration system

### Example Migration

```typescript
// Before
if (term.flag) {
  // Handle flagged term
}

// After  
if (term.flag === 'error' || term.flag === 'warning') {
  // Handle problematic term
}
```

## Benefits

### Universal Application
- Works across any domain (finance, compliance, operations, etc.)
- Consistent visual language throughout the application
- Semantic meaning regardless of context

### Extensibility
- Easy to add new flag types without code changes
- Configurable styling per business context
- Database-driven configuration

### Maintainability
- Clear semantic meaning in code and data
- Centralized styling configuration
- Type-safe implementation

### Performance
- Efficient database queries with enum types
- Indexed flag configurations
- Optimized rendering with cached styles

## Future Enhancements

### Planned Features
- Dynamic flag configuration management UI
- Flag analytics and reporting
- Custom flag types per organization
- Flag workflow automation
- Integration with notification systems

### Extensibility Points
- Additional flag configurations for new business domains
- Custom badge rendering logic
- Flag-based automation triggers
- Advanced filtering and sorting capabilities 