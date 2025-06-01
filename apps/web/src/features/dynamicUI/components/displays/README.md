# DynamicUI Display Components

This directory contains the display components for the DynamicUI system, along with comprehensive Storybook stories for each component.

## Components

### Core Display Components

1. **TextDisplay** (`TextDisplay.tsx`)
   - Simple text display with optional labels
   - Handles various data types (strings, numbers, booleans, dates)
   - Supports custom styling

2. **ActionButtons** (`ActionButtons.tsx`)
   - Renders action buttons with different styles (primary, secondary, danger)
   - Supports custom data context for action handlers
   - Flexible layout and styling options

3. **CardDisplay** (`CardDisplay.tsx`)
   - Displays data in a structured card format
   - Supports grid and list layouts
   - Custom field rendering capabilities
   - Conditional title rendering

4. **TableDisplay** (`TableDisplay.tsx`)
   - Renders data in table format with configurable columns
   - Custom cell rendering support
   - Row-level styling based on data
   - Responsive design considerations

5. **DisplayField** (`DisplayField.tsx`)
   - Versatile wrapper component that can render any display type
   - Type-safe configuration system
   - Unified interface for all display types

6. **DynamicDisplay** (`DynamicDisplay.tsx`)
   - Main orchestrator component for schema-driven UI rendering
   - Supports multiple layout types (grid, single, conditional)
   - Template-based rendering
   - Integration with form components
   - **Requires React Query (TanStack Query) for schema fetching**

## Storybook Stories

Each component has comprehensive Storybook stories that demonstrate:

### TextDisplay Stories (`TextDisplay.stories.tsx`)
- Basic text display with and without labels
- Different data types (strings, numbers, booleans, dates, URLs)
- Empty and undefined value handling
- Custom styling examples
- Responsive behavior
- Multiple instances comparison

### ActionButtons Stories (`ActionButtons.stories.tsx`)
- Single button variants (primary, secondary, danger)
- Multiple button combinations
- CRUD operation patterns
- Form action patterns
- Long label handling
- Custom styling and layout
- Responsive behavior
- All styles comparison

### CardDisplay Stories (`CardDisplay.stories.tsx`)
- Basic card with grid layout
- List layout variant
- Cards without titles
- Custom field rendering (status badges, progress bars, formatted values)
- Missing data handling
- Empty configuration fallbacks
- Many fields scenarios
- Custom styling
- Controlled context behavior
- Responsive design
- Layout comparisons

### TableDisplay Stories (`TableDisplay.stories.tsx`)
- Basic table with simple data
- Employee data with multiple columns
- Custom cell rendering (currency, dates, status badges, progress bars)
- Project data with complex rendering
- Row-level styling based on data
- Empty table states
- Missing configuration handling
- Long content wrapping
- Custom table styling
- Responsive behavior
- Complex data types (arrays, objects, booleans)

### DisplayField Stories (`DisplayField.stories.tsx`)
- Text display integration
- Table display with custom rendering
- Card display with different layouts
- Action buttons integration
- Empty data handling
- Unsupported type error handling
- Responsive table example

### DynamicDisplay Stories (`DynamicDisplay.stories.tsx`)
- Schema-driven table rendering
- Schema-driven card rendering
- Form integration
- Grid layout demonstrations
- Single component layouts
- Conditional layouts
- Table with custom rendering and flagging
- Row styling based on data
- Template-based display
- Actions-only display
- Empty schema fallback
- Custom styling
- Complex nested data structures
- Responsive display

## Key Features Demonstrated

### Data Handling
- Various data types (strings, numbers, booleans, dates, arrays, objects)
- Empty and undefined value handling
- Complex nested data structures
- Missing field graceful degradation

### Styling & Layout
- Grid vs list layouts for cards
- Responsive design patterns
- Custom CSS class integration
- Conditional styling based on data
- Row-level table styling

### Custom Rendering
- Status badges with color coding
- Progress bars and completion indicators
- Currency and number formatting
- Date formatting
- Tag/chip displays for arrays
- Custom icons and indicators

### Interactive Features
- Action button handling
- Form integration
- Schema-driven configuration
- Template-based rendering
- Conditional visibility

### Error Handling
- Graceful fallbacks for missing data
- Error states for unsupported configurations
- Empty state handling
- Type safety with TypeScript

## Usage Examples

### Basic Text Display
```tsx
<TextDisplay 
  label="User Name" 
  value="John Doe" 
/>
```

### Table with Custom Rendering
```tsx
<TableDisplay
  data={employees}
  config={{
    columns: [
      { key: 'name', label: 'Name' },
      { 
        key: 'status', 
        label: 'Status',
        render: (value) => <StatusBadge status={value} />
      }
    ]
  }}
/>
```

### Schema-Driven Display
```tsx
<DynamicDisplay
  schema={{
    componentType: 'Display',
    customProps: {
      displayType: 'table',
      columns: [...]
    }
  }}
  data={tableData}
  onAction={handleAction}
/>
```

## Development Notes

- All components are fully typed with TypeScript
- Stories include comprehensive prop controls for interactive testing
- Responsive design is tested across different viewport sizes
- Error boundaries and fallback states are properly handled
- Components follow the project's naming conventions and code organization
- Linting and type checking pass for all new code
- **DynamicDisplay requires React Query context** - see troubleshooting section below

## Testing

Run Storybook to interact with all components:
```bash
npm run storybook
```

The stories provide a comprehensive testing environment for:
- Visual regression testing
- Interaction testing
- Responsive design validation
- Error state verification
- Performance testing with large datasets

## Troubleshooting

### "No QueryClient set" Error

If you encounter the error "No QueryClient set, use QueryClientProvider to set one" when using DynamicDisplay components:

**Problem**: The DynamicDisplay component uses React Query (TanStack Query) for schema fetching, but no QueryClient is available in the component tree.

**Solution**: Ensure your application is wrapped with a QueryClientProvider. In Storybook, this has been configured in `.storybook/preview.ts`:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries in Storybook
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

// In your app, wrap with QueryClientProvider
<QueryClientProvider client={queryClient}>
  <YourApp />
</QueryClientProvider>
```

**For Storybook Stories**: When creating DynamicDisplay stories, prefer passing schemas directly via the `schema` prop rather than using `componentId` to avoid unnecessary API calls in the Storybook environment.

### "No data available" in Table Display

If you see "No data available" in table display stories:

**Problem**: The DynamicDisplay component's table display expects data to be provided either as a direct array or via a specific key in the data object.

**Solutions**:

1. **Using dataKey** (recommended for complex data structures):
   ```tsx
   {
     schema: {
       customProps: {
         displayType: 'table',
         dataKey: 'users', // Specify which property contains the table data
         columns: [...]
       }
     },
     data: { users: arrayOfUserData } // Data is nested under 'users' key
   }
   ```

2. **Direct array data**:
   ```tsx
   {
     schema: {
       customProps: {
         displayType: 'table',
         columns: [...]
       }
     },
     data: arrayOfUserData // Data is provided directly as an array
   }
   ```

**Common Issues**:
- Missing `dataKey` when data is nested in an object
- Data key mismatch (e.g., `dataKey: 'users'` but data is `{ employees: [...] }`)
- Data not being an array when expected

### "No display configuration found" Error

If you see "No display configuration found for component: [component-id]":

**Problem**: The schema doesn't contain a valid display configuration.

**Solutions**:

1. **For table displays**:
   ```tsx
   customProps: {
     displayType: 'table',
     dataKey: 'items', // Optional, if data is nested
     columns: [...]
   }
   ```

2. **For card displays**:
   ```tsx
   customProps: {
     displayType: 'card',
     fields: [...],
     layout: 'grid' // or 'list'
   }
   ```

3. **For actions-only displays**:
   ```tsx
   customProps: {
     displayType: 'actions'
   },
   actions: [...]
   ```

4. **For template displays**:
   ```tsx
   displayTemplate: 'Welcome {{firstName}} {{lastName}}!'
   ```

### Schema Fetching vs Direct Schema

The DynamicDisplay component supports two modes:

1. **Direct Schema** (recommended for Storybook):
   ```tsx
   <DynamicDisplay schema={mySchema} data={data} />
   ```

2. **Schema Fetching** (for production):
   ```tsx
   <DynamicDisplay componentId="my-component" data={data} />
   ```

When a `schema` prop is provided, it takes precedence over `componentId` fetching.

## Story Creation Best Practices

When creating new DynamicDisplay stories:

### 1. Table Display Stories
```tsx
export const MyTableStory: Story = {
  args: {
    schema: {
      componentId: 'my-table',
      componentType: 'Display',
      title: 'My Table Title',
      customProps: {
        displayType: 'table',
        dataKey: 'items', // Required if data is nested
        columns: [
          { key: 'id', label: 'ID', width: 'w-20' },
          { key: 'name', label: 'Name', width: 'w-1/3' },
          // Custom rendering
          { 
            key: 'status', 
            label: 'Status', 
            render: 'status-badge' 
          }
        ],
        // Optional: Custom rendering configuration
        flagConfig: {
          field: 'status',
          badgeConfigs: {
            'Active': { class: 'bg-green-100 text-green-800', text: 'Active' }
          }
        }
      }
    },
    data: { items: myTableData } // Match the dataKey
  }
};
```

### 2. Card Display Stories
```tsx
export const MyCardStory: Story = {
  args: {
    schema: {
      componentId: 'my-card',
      componentType: 'Display',
      title: 'My Card Title',
      customProps: {
        displayType: 'card',
        fields: [
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' }
        ],
        layout: 'grid' // or 'list'
      }
    },
    data: myObjectData // Direct object data
  }
};
```

### 3. Actions-Only Stories
```tsx
export const MyActionsStory: Story = {
  args: {
    schema: {
      componentId: 'my-actions',
      componentType: 'Display',
      title: 'Available Actions',
      customProps: {
        displayType: 'actions'
      },
      actions: [
        { actionKey: 'edit', label: 'Edit', style: 'primary' },
        { actionKey: 'delete', label: 'Delete', style: 'danger' }
      ]
    },
    data: myContextData
  }
};
``` 