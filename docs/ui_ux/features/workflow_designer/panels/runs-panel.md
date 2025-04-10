# Runs Panel

## Overview

The Runs Panel provides a comprehensive interface for monitoring and analyzing workflow execution history. This panel enables users to track active runs, review historical executions, analyze performance metrics, and debug workflow issues in real-time.

## Visual Design

### Panel Layout
- Fixed-width panel (400px) docked on the right side of the workflow designer
- Vertically scrollable content area with sticky header
- Tabbed interface for Active Runs and History
- Collapsible sections for detailed run information

### Header Section
- Panel title with "Runs" and active run count badge
- Filter controls:
  - Date range picker
  - Status filter dropdown
  - Search by run ID/name
- View toggle: List/Timeline view

### Run List View
- Vertically stacked run cards displaying:
  - Run ID and trigger source
  - Start time and duration
  - Current status with color coding
  - Progress indicator for active runs
  - Quick action buttons
- Sort options:
  - Start time
  - Duration
  - Status
  - Completion time

### Timeline View
- Horizontal timeline showing:
  - Run distribution over time
  - Status color coding
  - Concurrent execution visualization
  - Duration bars
- Zoom controls for time scale
- Hover tooltips with run details

### Run Detail View
- Comprehensive run information:
  - Execution path visualization
  - Node-by-node status
  - Input/output data
  - Error details
  - Performance metrics
  - Logs viewer

## Interactive Elements

### Run Controls
- Stop button for active runs
- Retry button for failed runs
- Download run data
- Copy run ID
- Share run link

### Timeline Navigation
- Pan and zoom controls
- Time period presets
- Jump to specific date
- Real-time update toggle

### Data Inspection
- Expandable JSON viewers
- Log level filters
- Search within logs
- Node state inspection
- Variable tracking

## States and Transitions

### Run States
- Queued: Gray pulse
- Running: Blue animated progress
- Completed: Green checkmark
- Failed: Red X
- Stopped: Orange square
- Timeout: Yellow warning

### Panel States
- Empty State: No runs available
- Loading State: Fetching run data
- Error State: Data fetch failed
- Active State: Showing run information
- Real-time Update State: Live data streaming

## Data Display

### Run Information
- Execution metadata
  - Trigger details
  - User context
  - Environment info
  - Version data
- Performance metrics
  - Node execution times
  - Resource usage
  - API call statistics
  - Memory utilization
- Error information
  - Stack traces
  - Error messages
  - Failed node details
  - Recovery attempts

### Analytics
- Success/failure rates
- Average duration
- Resource utilization trends
- Common failure points
- Performance bottlenecks

## Accessibility

- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader announcements for status changes
- High contrast mode compatibility
- Focus management
- Semantic HTML structure

## Error Handling

### Display Patterns
- Clear error message formatting
- Contextual error information
- Recovery suggestions
- Debug information access
- Error categorization

### Data Loading
- Graceful loading states
- Error retry options
- Partial data display
- Offline mode handling
- Data integrity checks

## Performance Considerations

- Virtualized list rendering
- Incremental data loading
- Efficient real-time updates
- Data caching strategies
- Background data prefetch
- Optimized timeline rendering

## Integration Features

### Export Options
- Run data export (JSON/CSV)
- Log export
- Performance report generation
- Audit trail export
- Metrics dashboard integration

### External System Integration
- Log aggregation systems
- Monitoring platforms
- Analytics services
- Notification systems
- Debugging tools

## Usage Guidelines

### Best Practices
- Regular run history review
- Performance monitoring
- Error pattern analysis
- Resource usage tracking
- Audit compliance

### Organization
- Run categorization
- Filtering strategies
- Search optimization
- Data retention policies
- Access control

## Related Components

- [Testing Panel](./testing-panel.md)
- [Properties Panel](./properties-panel.md)
- [Settings Panel](./settings-panel.md)
- [AI Assistant Panel](./ai-assistant-panel.md) 