# Executing Tasks

## Overview

This document provides guidelines for executing tasks in the Augmented OS project. It includes specific instructions for both human developers and AI assistants to ensure consistent and effective task execution.

## General Execution Guidelines

### 1. Task Selection

1. Start with tasks in the `1-now/` directory
2. Select tasks based on priority (High > Medium > Low)
3. Consider dependencies before starting a task
4. If blocked on a high-priority task, move to the next available task

### 2. Task Preparation

1. Read the entire task document thoroughly
2. Understand the context and objectives
3. Review all acceptance criteria
4. Check that all dependencies are satisfied
5. Gather necessary resources mentioned in the task

### 3. Execution Process

1. Update the task's status to "In Progress"
2. Follow the implementation steps in order
3. Document any deviations from the planned steps
4. Update the task document with progress notes if needed
5. Commit code changes frequently with descriptive messages

### 4. Completion and Verification

1. Verify that all acceptance criteria have been met
2. Conduct self-review of the implementation
3. Update the task's status to "Completed"
4. Move the task file to the `4-completed/` directory
5. Document any lessons learned or follow-up tasks

## Guidelines for Human Developers

### Development Environment Setup

1. Ensure your development environment is properly configured
2. Pull the latest changes from the repository
3. Create a new branch for the task (format: `task/[TASK-ID]`)

### Code Quality Standards

1. Follow the project's coding style guidelines
2. Write clean, maintainable, and well-documented code
3. Include appropriate error handling
4. Write unit tests for new functionality
5. Ensure all tests pass before considering the task complete

### Collaboration

1. Communicate blockers or issues promptly
2. Update task status in project management tools
3. Request code reviews when appropriate
4. Provide constructive feedback on others' tasks
5. Document any decisions or changes to the original plan

### Handling Unexpected Issues

1. If a task is more complex than estimated:
   * Break it down into smaller sub-tasks
   * Update the estimated effort
   * Communicate the change to the team
2. If blocked by an unforeseen dependency:
   * Document the dependency
   * Update the task's status to "Blocked"
   * Move to another task while waiting

## Guidelines for AI Assistants

### Understanding Context

1. Analyze the task document thoroughly
2. Review related code and documentation
3. Understand the project architecture and patterns
4. Consider the broader impact of the task

### Code Generation

1. Generate code that follows project conventions
2. Include appropriate comments and documentation
3. Consider edge cases and error handling
4. Optimize for readability and maintainability
5. Provide explanations for complex logic

### Problem Solving

1. Break down complex problems into manageable steps
2. Consider multiple approaches before implementation
3. Evaluate trade-offs between different solutions
4. Document your reasoning for chosen approaches
5. Provide alternatives when appropriate

### Communication

1. Explain your understanding of the task before execution
2. Provide clear, concise explanations of your implementation
3. Highlight any assumptions you've made
4. Ask clarifying questions when the task is ambiguous
5. Summarize your work upon completion

### Limitations and Handoffs

1. Clearly identify any aspects of the task you cannot complete
2. Provide detailed context for human developers to continue
3. Suggest alternative approaches for challenging aspects
4. Document progress made and remaining work
5. Highlight areas that require human judgment or verification

## Handling Common Issues

### Ambiguous Requirements

1. Identify specific areas of ambiguity
2. Propose reasonable interpretations
3. Request clarification if necessary
4. Document assumptions made

### Scope Changes

1. Evaluate the impact of the scope change
2. Update the task document accordingly
3. Reassess effort estimates
4. Communicate changes to stakeholders

### Technical Challenges

1. Research potential solutions
2. Consult project documentation and external resources
3. Prototype different approaches if necessary
4. Document findings and decisions

### Integration Issues

1. Verify compatibility with existing components
2. Test integration points thoroughly
3. Document any API changes or new dependencies
4. Update related documentation

## Task Execution Workflow

```
┌─────────────────┐
│  Select Task    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Review Task    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Check Dependencies
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Update Status   │
│ to "In Progress"│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Execute Task    │◄─────┐
└────────┬────────┘      │
         │               │
         ▼               │
┌─────────────────┐      │
│ Verify Against  │      │
│ Acceptance      │      │
│ Criteria        │      │
└────────┬────────┘      │
         │               │
         ▼               │
┌─────────────────┐      │
│ All Criteria    │  No  │
│ Met?            ├──────┘
└────────┬────────┘
         │ Yes
         ▼
┌─────────────────┐
│ Update Status   │
│ to "Completed"  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Move to         │
│ Completed Tasks │
└─────────────────┘
```

## Related Documentation

- [Task System Overview](./README.md)
- [Task Format](./task-format.md)
- [Creating Tasks](./creating-tasks.md) 