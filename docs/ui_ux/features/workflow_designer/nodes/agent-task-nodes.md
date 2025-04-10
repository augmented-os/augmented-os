# AI Agent Task Nodes

## Overview

AI Agent Task nodes enable users to incorporate AI-powered automation capabilities into their workflows. These nodes represent steps where an AI agent performs tasks like text generation, content analysis, decision making, or other cognitive operations. The visual design reflects the unique nature of AI operations while providing clear feedback about configuration and execution state.

## Visual Design

### Base Appearance

```
+---------------------------------------------+
|  🧠  AI Agent Task            ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  System: You are a helpful assistant        |
|  that processes customer inquiries.         |
|                                             |
|  User: Process this inquiry: {{input.query}}|
|                                             |
+---------------------------------------------+
|  Model: GPT-4              [ Configure ]    |
+---------------------------------------------+
```

* **Shape**: Rounded rectangle with 6px corner radius
* **Size**: Default 240px width × 140px height (resizable)
* **Header**: Purple (#A142F4) background with white text
* **Header Icon**: Brain (🧠) icon on the left side
* **Header Actions**: Menu, validation status, and delete buttons on the right
* **Content Area**: White background with prompt preview
* **Footer**: Light gray background (#F8F8F8) with model information

### Connection Points

* **Inputs**: One or more input ports on the left side
  * Main input port at the vertical center
  * Additional input ports can be added for different input types
  * Ports are labeled to indicate purpose (e.g., "Query", "Context")
* **Outputs**: One or more output ports on the right side
  * Main output port at the vertical center
  * Additional output ports for different output types or error handling
  * Ports are labeled to indicate purpose (e.g., "Response", "Error")

### Content Area Design

The content area provides a preview of the AI agent configuration:

* **Prompt Preview**: Shows truncated versions of:
  * System prompt (instructions to the AI)
  * User prompt template (with variable placeholders)
  * Optional examples or few-shot samples
* **Variable Highlighting**: Template variables (e.g., `{{input.query}}`) highlighted in blue
* **Formatting**:
  * System/User role labels in bold
  * Content in regular text
  * Variable placeholders in monospace font with highlight

## Node States

AI Agent Task nodes display these states:

| State | Visual Appearance |
|----|----|
| **Default** | Standard appearance as described above |
| **Selected** | Blue outline (2px) with resize handles |
| **Hover** | Slight elevation increase (shadow enhancement) |
| **Focused** | Blue dashed outline (for keyboard navigation) |
| **Executing** | Purple pulsing border with animated particles/waves suggesting AI "thinking" |
| **Successful Execution** | Momentary green outline pulse with checkmark in header |
| **Failed Execution** | Persistent red outline with error icon in header |
| **Invalid Configuration** | Red warning icon in the header with hover tooltip explaining the issue |
| **Rate Limited** | Yellow warning with clock icon indicating rate limit issues |

## Model Variations

AI Agent Task nodes provide visual differentiation based on the AI model type:

### Large Language Model (LLM)

* **Model Indicator**: "LLM" or specific model name (e.g., "GPT-4") in footer
* **Icon Variation**: Standard brain icon
* **Content Preview**: Shows prompt templates

### Image Generation Model

* **Model Indicator**: "Image Gen" or specific model name in footer
* **Icon Variation**: Brain with image icon
* **Content Preview**: Shows prompt and small image placeholder or example

### Multimodal Model

* **Model Indicator**: "Multimodal" or specific model name in footer
* **Icon Variation**: Brain with multiple input/output icons
* **Content Preview**: Shows mixed text/image prompt structure

### Fine-tuned Model

* **Model Indicator**: Custom model name with "Fine-tuned" badge
* **Icon Variation**: Brain with customization indicator
* **Content Preview**: Shows specialized prompt format

## Expanded States

AI Agent nodes have special expanded states for detailed configuration:

### Expanded Prompt View

When double-clicked or explicitly expanded:

```
+---------------------------------------------+
|  🧠  AI Agent Task            ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  System:                                    |
|  You are a helpful assistant that           |
|  processes customer inquiries. Always       |
|  maintain a professional tone and provide   |
|  accurate information based on context.     |
|                                             |
|  User:                                      |
|  Process this customer inquiry:             |
|  {{input.query}}                            |
|                                             |
|  Consider the following company policies:   |
|  {{context.policies}}                       |
|                                             |
|  Format your response with these sections:  |
|  - Summary of inquiry                       |
|  - Recommended action                       |
|  - Relevant policy information              |
|                                             |
+---------------------------------------------+
|  Model: GPT-4 | Temp: 0.7    [ Configure ]  |
+---------------------------------------------+
```

* **Size**: Expands to show more of the prompt configuration (e.g., 400px height)
* **Scroll**: Vertical scrollbar appears for longer prompts
* **Formatting**: Full formatting of different message roles
* **Variables**: All template variables visible with highlighting

### Full Configuration Mode

When "Configure" is clicked or "Edit Prompts" is selected from the context menu:

* **View**: Opens the properties panel with detailed AI agent configuration
* **Features**: Full configuration interface with:
  * Complete prompt editing
  * Model selection
  * Parameter tuning
  * Tool configuration
  * Testing interface

## Configuration Options Visual Indicators

The visual representation changes based on configuration:

### Tool Usage Indicators

* **Tool Icons**: Small tool icons appear in the footer when tools are enabled
  * Function icon for function calling
  * Database icon for retrieval
  * Calculator icon for math capabilities
  * Web icon for web browsing

### Parameter Indicators

* **Temperature Setting**: Thermometer icon with value in footer
* **Max Tokens**: Text limit indicator in footer
* **Context Window**: Window size indicator for models with different context sizes

### Special Capabilities

* **Vision Enabled**: Eye icon for models with image understanding
* **Streaming Enabled**: Stream icon for real-time response streaming
* **Memory Enabled**: Memory icon for conversational memory/history

## Interactive Elements

AI Agent Task nodes provide these interactive elements:

* **Header Menu**: Click the menu icon (⋮) to access node-specific options
* **Prompt Preview**: Click to select node, double-click to expand prompt view
* **Configure Button**: Click to open configuration panel in the properties sidebar
* **Model Selector**: Dropdown in the footer when clicked
* **Input/Output Ports**: Hover highlights available connections

## Properties Panel Integration

When an AI Agent Task node is selected, the properties panel shows:

* **General Settings Tab**:
  * Node name field
  * Description field
  * Model selection dropdown
  * Base parameter sliders (temperature, max tokens)
* **Prompt Editor Tab**:
  * System prompt editor
  * User prompt editor with variable insertion
  * Example messages for few-shot learning
  * Variable binding configuration
* **Tools Tab**:
  * Tool enablement toggles
  * Tool configuration options
  * Tool parameters and schema editors
* **Input/Output Tab**:
  * Input parameter configuration
  * Output parsing and mapping
  * Response schema definition

## Accessibility Considerations

* **Color Independence**: The brain icon and node shape ensure it's recognizable without relying solely on color
* **Screen Reader Support**:
  * Announces "AI Agent Task Node" with model and status information
  * Prompt sections have appropriate ARIA roles and labels
  * Configuration status properly communicated
* **Keyboard Navigation**:
  * Tab stops for all interactive elements
  * Keyboard shortcuts for common operations
  * Arrow key navigation in expanded views

## Usage Guidelines

* **Prompt Visibility**: Balance between showing enough prompt for recognition while maintaining node compactness
* **Configuration Clarity**: Clearly indicate AI model type and key parameters
* **Variable Highlighting**: Make template variables stand out to show data flow
* **Execution Feedback**: Provide visual feedback during AI "thinking" and processing
* **Naming**: Use descriptive names that indicate the AI agent's purpose in the workflow

## Related Components

* [Canvas Appearance](../canvas/appearance.md): Overall canvas styling context
* [Properties Panel](../panels/properties-panel.md): Where detailed AI agent configuration occurs
* [Code Task Nodes](./code-task-nodes.md): Alternative for script-based custom logic


