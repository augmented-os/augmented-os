# Integration Task Nodes

## Overview

Integration Task nodes enable users to connect workflows to external systems, APIs, and services. These nodes represent integration points for data exchange, triggering external actions, or consuming external events. The visual design reflects the connected nature of these nodes while providing clear feedback about configuration and connection status.

## Visual Design

### Base Appearance

```
+---------------------------------------------+
|  🔗  API Integration           ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  GET https://api.example.com/data          |
|                                             |
|  Headers:                                   |
|    Authorization: Bearer {{env.API_KEY}}    |
|                                             |
+---------------------------------------------+
|  Service: Custom API       [ Configure ]    |
+---------------------------------------------+
```

* **Shape**: Rounded rectangle with 6px corner radius
* **Size**: Default 240px width × 120px height (resizable)
* **Header**: Teal blue (#00A7B5) background with white text
* **Header Icon**: Link (🔗) icon on the left side
* **Header Actions**: Menu, validation status, and delete buttons on the right
* **Content Area**: White background with integration details
* **Footer**: Light gray background (#F8F8F8) with service information

### Connection Points

* **Inputs**: One or more input ports on the left side
  * Main input port at the vertical center
  * Additional input ports for different parameter types
  * Ports are labeled to indicate purpose (e.g., "Parameters", "Auth")
* **Outputs**: One or more output ports on the right side
  * Main output port at the vertical center for successful responses
  * Error output port for handling errors
  * Ports are labeled to indicate purpose (e.g., "Response", "Error")

### Content Area Design

The content area provides a preview of the integration configuration:

* **Endpoint Information**: Shows HTTP method and URL for API calls
* **Parameter Preview**: Shows key request parameters or payload summary
* **Authentication Preview**: Indicates authentication method being used
* **Variable Highlighting**: Template variables (e.g., `{{input.id}}`) highlighted in blue

## Integration Type Variations

### REST API

```
+---------------------------------------------+
|  🔗  REST API                 ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  POST https://api.example.com/users        |
|                                             |
|  Body:                                      |
|  {                                          |
|    "name": "{{input.name}}",                |
|    "email": "{{input.email}}"               |
|  }                                          |
|                                             |
+---------------------------------------------+
|  Content-Type: application/json             |
+---------------------------------------------+
```

* **Icon**: API or endpoint icon
* **Content**: Shows HTTP method, URL, and payload preview
* **Footer**: Shows content type and status info

### Database

```
+---------------------------------------------+
|  🛢️  Database                 ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  SELECT * FROM users                        |
|  WHERE email = {{input.email}}              |
|  LIMIT 10                                   |
|                                             |
+---------------------------------------------+
|  Database: PostgreSQL       [ Configure ]   |
+---------------------------------------------+
```

* **Icon**: Database (🛢️) icon
* **Content**: Shows SQL query or database operation
* **Footer**: Shows database type and connection info

### Message Queue

```
+---------------------------------------------+
|  📮  Message Queue            ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Publish to: orders.processing              |
|                                             |
|  Message:                                   |
|  {                                          |
|    "orderId": "{{input.orderId}}",          |
|    "status": "processing"                   |
|  }                                          |
|                                             |
+---------------------------------------------+
|  Queue: RabbitMQ            [ Configure ]   |
+---------------------------------------------+
```

* **Icon**: Queue (📮) icon
* **Content**: Shows queue name and message preview
* **Footer**: Shows queue service type

### Webhook

```
+---------------------------------------------+
|  🪝  Webhook                  ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Incoming webhook trigger                   |
|  Path: /api/workflows/inventory-update      |
|                                             |
|  Expected payload:                          |
|  { "productId", "quantity", "location" }    |
|                                             |
+---------------------------------------------+
|  Method: POST              [ Configure ]    |
+---------------------------------------------+
```

* **Icon**: Webhook (🪝) icon
* **Content**: Shows trigger information and payload schema
* **Footer**: Shows HTTP method info

### Third-Party SaaS

```
+---------------------------------------------+
|  🧩  Salesforce              ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Operation: Create Contact                  |
|                                             |
|  Fields:                                    |
|  - FirstName: {{input.firstName}}           |
|  - LastName: {{input.lastName}}             |
|  - Email: {{input.email}}                   |
|                                             |
+---------------------------------------------+
|  Connected account: sales@company.com       |
+---------------------------------------------+
```

* **Icon**: Service-specific logo or puzzle piece (🧩) icon
* **Content**: Shows operation and field mapping
* **Footer**: Shows connected account information

## Node States

Integration nodes display these states:

| State | Visual Appearance |
|----|----|
| **Default** | Standard appearance as described above |
| **Selected** | Blue outline (2px) with resize handles |
| **Hover** | Slight elevation increase (shadow enhancement) |
| **Focused** | Blue dashed outline (for keyboard navigation) |
| **Executing** | Teal pulsing border with animated dots suggesting data transfer |
| **Successful Execution** | Momentary green outline pulse with checkmark in header |
| **Failed Execution** | Persistent red outline with error icon in header |
| **Connection Error** | Red warning with network error icon |
| **Auth Error** | Orange warning with lock icon |
| **Rate Limited** | Yellow warning with clock icon |
| **Invalid Configuration** | Red warning icon in the header with hover tooltip explaining the issue |

## Connection Status Indicators

Special indicators show the connection status:

* **Connected**: Green dot in footer with connection time
* **Disconnected**: Red dot in footer with retry option
* **Authentication Required**: Orange key icon in header
* **Limited Access**: Yellow shield icon in header

## Expanded Configuration View

When "Configure" is clicked, the properties panel opens with:

* **General Settings Tab**:
  * Node name field
  * Description field
  * Service selection dropdown
  * Operation selection dropdown
* **Authentication Tab**:
  * Authentication method selection
  * Credential management
  * OAuth flow initiation
  * API key configuration
* **Request/Operation Tab**:
  * Endpoint/operation configuration
  * Method selection for APIs
  * Headers configuration
  * Parameter mapping
  * Body template editor
* **Response Handling Tab**:
  * Response mapping
  * Error handling configuration
  * Retry settings
  * Transformation options

## Interactive Elements

Integration nodes provide these interactive elements:

* **Header Menu**: Click the menu icon (⋮) to access node-specific options
* **Configure Button**: Click to open configuration panel in the properties sidebar
* **Test Connection**: Button in properties panel to test the integration
* **Service Selection**: Dropdown in the footer when clicked
* **Input/Output Ports**: Hover highlights available connections
* **Auth Status**: Clickable auth indicators for quick credential updates

## Properties Panel Integration

When an Integration node is selected, the properties panel shows tabs specific to the integration type:

* **API Properties**:
  * HTTP method dropdown
  * URL/endpoint field
  * Header configuration
  * Request body editor with variable insertion
  * Response schema editor
* **Database Properties**:
  * Connection string/details
  * Query editor with syntax highlighting
  * Parameter binding configuration
  * Result set handling
* **Queue Properties**:
  * Queue selection
  * Message format configuration
  * Delivery settings
  * Acknowledgment handling

## Accessibility Considerations

* **Color Independence**: The integration-specific icons and node shapes ensure they're recognizable without relying solely on color
* **Screen Reader Support**:
  * Announces "Integration Node" with service type and status information
  * Connection status properly communicated
  * Error states clearly verbalized
* **Keyboard Navigation**:
  * Tab stops for all interactive elements
  * Keyboard shortcuts for common operations
  * Arrow key navigation in configuration panels

## Usage Guidelines

* **Configuration Clarity**: Clearly indicate the type of integration and key parameters
* **Error Visibility**: Provide clear visual feedback for connectivity issues
* **Authentication Status**: Make authentication status immediately visible
* **Service Naming**: Use official service names and logos where applicable
* **Endpoint Security**: Mask sensitive authentication information in previews

## Related Components

* [Canvas Appearance](../canvas/appearance.md): Overall canvas styling context
* [Properties Panel](../panels/properties-panel.md): Where detailed integration configuration occurs
* [Code Task Nodes](./code-task-nodes.md): Alternative for custom API interaction logic
* [Environment Variables](../panels/environment-variables.md): For storing secure API keys and credentials


