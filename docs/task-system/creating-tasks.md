# Creating Tasks

## Overview

This document provides guidelines for creating well-structured tasks in the Augmented OS project. Following these guidelines ensures that tasks are clear, actionable, and contain all the necessary information for successful execution.

## When to Create a Task

Create a new task when:

1. A new feature needs to be implemented
2. An existing feature needs significant modification
3. A bug needs to be fixed
4. Documentation needs to be created or updated
5. Research needs to be conducted
6. Testing needs to be performed
7. Design work needs to be done

## Task Creation Process

### 1. Determine the Task Type

First, determine the appropriate type for your task:

- **DEV**: Development tasks (coding, implementation)
- **DOC**: Documentation tasks
- **RES**: Research tasks
- **TST**: Testing tasks
- **DES**: Design tasks

### 2. Assign a Task ID

Task IDs follow the format `[TYPE]-[###]`, where `[###]` is a sequential number within that type. For example, the first development task would be `DEV-001`, the second would be `DEV-002`, and so on.

To determine the next available ID:

1. Check the existing tasks in the relevant directories
2. Find the highest existing ID for the chosen type
3. Increment by 1 to get the new ID

### 3. Create the Task File

Create a new Markdown file in the appropriate directory with the naming convention:

```
[TYPE]-[ID]-[short-descriptive-name].md
```

For example: `DEV-001-implement-user-authentication.md`

The appropriate directory depends on the task's priority and status:

- **1-now/**: High-priority tasks that are currently being worked on
- **2-next/**: Tasks that are queued to be worked on next
- **3-later/**: Lower-priority tasks for future consideration
- **4-completed/**: Tasks that have been successfully completed

### 4. Fill in the Task Template

Use the [task template](./task-format.md#task-template) to structure your task. Fill in each section with the appropriate information.

## Guidelines for Each Section

### Title

- Be concise but descriptive
- Use action verbs (Implement, Create, Update, Fix, etc.)
- Focus on the primary objective

### Metadata

- **ID**: Use the ID determined in step 2
- **Type**: Use the type determined in step 1
- **Estimated Effort**: 
  - For story points, use the Fibonacci sequence (1, 2, 3, 5, 8, 13)
  - For time estimates, be realistic and include buffer time
- **Created**: Use the current date in YYYY-MM-DD format
- **Priority**: Assign based on importance and urgency
  - **High**: Critical for project progress, needed immediately
  - **Medium**: Important but not blocking other work
  - **Low**: Nice to have, can be deferred
- **Status**: Initially set to "Not Started" (or "In Progress" if work is beginning immediately)

### Description

- Be clear and specific about what needs to be done
- Focus on the "what" rather than the "how"
- Keep it concise (1-3 sentences)
- Avoid technical jargon unless necessary

### Context

- Explain why the task is necessary
- Provide background information
- Connect to broader project goals
- Include any relevant history or decisions

### Dependencies

- List all tasks that must be completed first
- Include external dependencies (e.g., third-party services)
- Reference dependencies by their task ID when possible

### Acceptance Criteria

- Make criteria specific, measurable, and testable
- Use the checklist format (- [ ] for each criterion)
- Include both functional and non-functional requirements
- Cover edge cases and error conditions
- Avoid vague language like "works well" or "looks good"

### Implementation Steps

- Break the task into logical, sequential steps
- Make each step actionable
- Include enough detail for someone unfamiliar with the task
- Use sub-bullets for detailed instructions within a step
- For complex tasks, consider breaking them into smaller tasks

### Resources

- Include links to relevant documentation
- Reference related code or components
- Provide examples or templates when helpful
- Link to external resources that may assist with the task

### Notes

- Include any additional information that doesn't fit elsewhere
- Note potential challenges or considerations
- Mention alternative approaches that were considered
- Add any special instructions or warnings

## Task Granularity

Finding the right size for tasks is important:

- **Too Large**: Tasks that would take more than a few days should be broken down into smaller tasks
- **Too Small**: Tasks that would take less than an hour might be too granular and create unnecessary overhead
- **Just Right**: Tasks should be completable within a few hours to a couple of days

When breaking down large tasks:

1. Identify logical components or phases
2. Create separate tasks for each component
3. Establish clear dependencies between the tasks
4. Consider creating a "parent" task that links to the sub-tasks

## Examples

See the [Task Format](./task-format.md#examples) document for examples of well-structured tasks.

## Related Documentation

- [Task System Overview](./README.md)
- [Task Format](./task-format.md)
- [Executing Tasks](./executing-tasks.md) 