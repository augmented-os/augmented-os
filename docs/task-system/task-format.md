# Task Format

## Overview

This document details the standardized format for tasks in the Augmented OS project. Following this format ensures that all tasks contain the necessary information for effective execution by both human developers and AI assistants.

## Task File Structure

Each task is defined in a Markdown file with the following naming convention:

```
[TYPE]-[ID]-[short-descriptive-name].md
```

For example: `DEV-001-implement-user-authentication.md` or `DOC-003-update-api-documentation.md`

## Task Template

Below is the complete task template with all sections:

```markdown
# Task: [Task Title]

## Metadata

* **ID**: [TYPE-###]
* **Type**: [Development/Documentation/Research/Testing/Design]
* **Estimated Effort**: [story points or time estimate]
* **Created**: [YYYY-MM-DD]
* **Priority**: [High/Medium/Low]
* **Status**: [Not Started/In Progress/Blocked/Completed]

## Description

[A clear, concise description of the task and its objectives]

## Context

[Background information and context for why this task is necessary]

## Dependencies

[List of dependencies that must be completed before this task can be started]

## Acceptance Criteria

- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]
...

## Implementation Steps

1. **[Step 1 Title]**
   * [Detailed description of step 1]
   * [Sub-steps if necessary]
2. **[Step 2 Title]**
   * [Detailed description of step 2]
   * [Sub-steps if necessary]
...

## Resources

* [Link to relevant documentation]
* [Link to related code]
* [Other helpful resources]

## Notes

[Additional notes, considerations, or special instructions]
```

## Section Details

### Metadata

The metadata section provides key information about the task at a glance:

* **ID**: A unique identifier for the task, consisting of a type prefix and a sequential number (e.g., DEV-001)
* **Type**: The category of the task:
  * **DEV**: Development tasks (coding, implementation)
  * **DOC**: Documentation tasks
  * **RES**: Research tasks
  * **TST**: Testing tasks
  * **DES**: Design tasks
* **Estimated Effort**: Story points (1, 2, 3, 5, 8, 13) or time estimate
* **Created**: The date the task was created (YYYY-MM-DD)
* **Priority**: The importance of the task (High, Medium, Low)
* **Status**: The current state of the task (Not Started, In Progress, Blocked, Completed)

### Description

A clear, concise description of what the task entails. This should be specific enough that anyone reading it understands what needs to be accomplished.

### Context

Background information that explains why the task is necessary and how it fits into the broader project. This helps executors understand the purpose and importance of the task.

### Dependencies

A list of other tasks, components, or resources that must be completed or available before this task can be started. This helps with task sequencing and planning.

### Acceptance Criteria

A checklist of specific, measurable conditions that must be met for the task to be considered complete. These criteria should be unambiguous and testable.

### Implementation Steps

A detailed, step-by-step guide for completing the task. Each step should be clear and actionable, with sub-steps where necessary. This section is particularly helpful for complex tasks.

### Resources

Links to relevant documentation, code, or other resources that may be helpful for completing the task.

### Notes

Any additional information, considerations, or special instructions that don't fit into the other sections.

## Examples

### Example 1: Development Task

```markdown
# Task: Implement User Authentication API

## Metadata

* **ID**: DEV-005
* **Type**: Development
* **Estimated Effort**: 5 story points
* **Created**: 2023-06-10
* **Priority**: High
* **Status**: Not Started

## Description

Implement a secure user authentication API that supports email/password login and OAuth providers.

## Context

The system requires a robust authentication system to secure user data and provide personalized experiences.

## Dependencies

* Database schema for user accounts (DEV-002)
* API framework setup (DEV-001)

## Acceptance Criteria

- [ ] API supports email/password registration and login
- [ ] API supports at least two OAuth providers (Google, GitHub)
- [ ] Authentication tokens are securely generated and validated
- [ ] Password reset functionality is implemented
- [ ] All endpoints are properly documented
- [ ] Unit tests achieve >90% coverage

## Implementation Steps

1. **Set up authentication routes**
   * Create route handlers for registration, login, logout
   * Implement middleware for protected routes
2. **Implement email/password authentication**
   * Create user registration logic with validation
   * Implement secure password hashing
   * Create login logic with proper error handling
3. **Add OAuth provider support**
   * Integrate Google OAuth
   * Integrate GitHub OAuth
4. **Implement token management**
   * Create JWT generation and validation
   * Set up refresh token rotation
5. **Add password reset functionality**
   * Create forgot password endpoint
   * Implement secure reset token generation
   * Add password reset confirmation endpoint
6. **Write tests**
   * Unit tests for all authentication functions
   * Integration tests for the complete flow

## Resources

* [JWT Documentation](https://jwt.io/introduction)
* [OAuth 2.0 Specification](https://oauth.net/2/)
* [Password Hashing Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

## Notes

* Consider rate limiting for login attempts to prevent brute force attacks
* Ensure all authentication errors return generic messages to prevent information leakage
```

## Related Documentation

* [Task System Overview](./README.md)
* [Creating Tasks](./creating-tasks.md)
* [Executing Tasks](./executing-tasks.md)


