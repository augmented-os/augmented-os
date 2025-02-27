# Documentation Format Guidelines

This document defines the standard format for all markdown documentation files in the Augmented OS documentation. Following these guidelines ensures consistency, improves readability, and enables better AI-assisted documentation generation.

## Standard Document Structure

All documentation files should follow this general structure:

```
# Title (Component or Schema Name)

## Overview

Brief description of the component/schema and its purpose in the system.
Include key characteristics and design principles.

## Structure

JSON schema definition with comments explaining each field.
For components, include architectural diagrams if applicable.

## Implementation Details

More detailed explanation of how the component/schema works.
Include subsections as needed for different aspects.

## Examples

Practical examples showing how the component/schema is used.
Include code snippets in JSON format with comments.

## Schema (for schema files only)

Database schema definition including:
- Table name and description
- Column definitions (name, type, description)
- Indexes and constraints
- JSON schema for complex fields

## Related Components (for component files only)

List of related components and how they interact.
```

## Formatting Guidelines


1. **Headings**:
   * Use title case for all headings
   * Main title is H1 (`#`), sections are H2 (`##`), subsections are H3 (`###`)
   * Keep headings concise and descriptive
2. **Code Blocks**:
   * Use triple backticks with language specification (`json, `sql, etc.)
   * Include comments in code blocks to explain key elements
   * For JSON schemas, use // comments for field explanations
3. **Lists**:
   * Use bullet points (\*) for unordered lists
   * Use numbers (1.) for ordered lists or sequences
   * Indent sublists consistently (2 spaces)
4. **Tables**:
   * Use markdown tables for structured data
   * Include headers for all columns
   * Align content for readability
5. **Links**:
   * Use relative links to reference other documentation files
   * Format: `[Link Text](relative/path/to/file.md)`
   * Include descriptive link text
6. **Images**:
   * Store images in the `assets` directory
   * Use meaningful filenames
   * Include alt text for accessibility

## Content Guidelines


1. **Clarity**:
   * Write in clear, concise language
   * Define technical terms on first use
   * Use active voice when possible
2. **Completeness**:
   * Cover all essential aspects of the component/schema
   * Include both "what" and "why" information
   * Document edge cases and limitations
3. **Consistency**:
   * Use consistent terminology throughout
   * Maintain consistent level of technical detail
   * Follow the same pattern for similar components
4. **Examples**:
   * Provide realistic, practical examples
   * Include both simple and complex use cases
   * Explain the purpose of each example

## AI-Friendly Documentation

To ensure documentation is optimized for AI processing:


1. **Structured Sections**:
   * Use consistent section headings across documents
   * Maintain predictable information hierarchy
2. **Semantic Markup**:
   * Use appropriate heading levels to indicate information hierarchy
   * Use code blocks with language specification
3. **Explicit Relationships**:
   * Clearly state relationships between components
   * Use consistent terminology for relationships
4. **Metadata**:
   * Include version information when applicable
   * Reference related documentation explicitly

## Version Control


1. **Change Documentation**:
   * Document significant changes in a changelog section
   * Include date and nature of changes
2. **Version Compatibility**:
   * Note compatibility requirements with other components
   * Highlight breaking changes

## Review Process

All documentation should be reviewed for:


1. Technical accuracy
2. Adherence to this format
3. Completeness of information
4. Clarity and readability

## Templates

Starter templates are available in the `.templates` directory:

* [Component Template](./.templates/component-template.md)
* [Schema Template](./.templates/schema-template.md)


