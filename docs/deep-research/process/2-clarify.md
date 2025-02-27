# Step 2: Respond to Clarifying Questions

## Overview

The clarification phase is a critical step where the AI may ask questions to better understand your research needs. Providing thoughtful, detailed responses during this phase significantly improves the quality and relevance of the deep research.

## Purpose of Clarification


1. **Resolve Ambiguities**: Address unclear aspects of the initial prompt
2. **Provide Missing Context**: Fill gaps in background information
3. **Refine Scope**: Better define the boundaries of the research
4. **Align Expectations**: Ensure mutual understanding of the desired outcome
5. **Surface Assumptions**: Identify and address hidden assumptions

## Effective Clarification Responses

### Be Specific and Direct

When the AI asks for clarification, provide clear, specific answers that directly address the question. Avoid vague or tangential responses.

**Example:**

```
AI: Could you clarify what you mean by "complex event correlation patterns"?

Good Response: By complex event correlation patterns, I mean identifying relationships between events from different sources that occur within specific time windows. For example, detecting when a user logs in from a new device, changes their password, and then makes a large transaction within a 10-minute window.

Poor Response: We need to handle complex patterns in our events.
```

### Provide Context, Not Just Answers

When clarifying, provide additional context that helps the AI understand why the information is relevant.

**Example:**

```
AI: What is your current technology stack?

Good Response: Our current stack is primarily Java-based with Spring Boot microservices. We use PostgreSQL for persistent storage and Redis for caching. This is relevant because any new event processing solution needs to integrate well with our existing Java ecosystem, though we're open to polyglot solutions if necessary.

Poor Response: We use Java and Spring Boot.
```

### Correct Misunderstandings Promptly

If the AI has misunderstood something, correct it clearly and provide the right information.

**Example:**

```
AI: Based on your mention of AWS Lambda, it seems you're committed to an AWS-based solution?

Good Response: That's a misunderstanding. We mentioned AWS Lambda as one possible approach we're considering, but we're actually evaluating both cloud-based and self-hosted solutions. Our primary concern is finding the right architecture for our requirements, regardless of where it's hosted.

Poor Response: Yes, we're using AWS.
```

### Acknowledge Limitations

Be honest about constraints, limitations, or areas where you lack information.

**Example:**

```
AI: What is your budget for this solution?

Good Response: We haven't established a specific budget yet, as we're still in the architecture evaluation phase. However, we're a mid-sized company and need a solution that balances performance with reasonable operational costs. Cost efficiency is important but not at the expense of meeting our technical requirements.

Poor Response: We have a good budget.
```

## Common Clarification Topics

Be prepared to address questions about:


1. **Technical Requirements**: Performance, scalability, reliability needs
2. **Constraints**: Budget, timeline, technology restrictions
3. **Current State**: Existing systems, approaches, pain points
4. **Team Capabilities**: Experience levels, available skills
5. **Success Criteria**: How you'll evaluate the research outcome
6. **Implementation Context**: Where and how findings will be applied

## Clarification Process Tips


1. **Respond Promptly**: Quick responses maintain momentum in the research process
2. **Be Comprehensive**: Answer all parts of multi-part questions
3. **Add Relevant Details**: Include information that might help, even if not explicitly asked
4. **Ask Your Own Questions**: If the AI's question is unclear, ask for clarification
5. **Document Exchanges**: Keep a record of clarification exchanges for future reference

## When to Move to Research Phase

You're ready to move to the research phase (Step 3) when:


1. All critical ambiguities have been resolved
2. The AI has sufficient context to conduct meaningful research
3. The scope and objectives are clearly defined
4. Both you and the AI have a shared understanding of the desired outcome

## Related Resources

* [1-prompt.md](./1-prompt.md): Guidelines for crafting the initial prompt
* [3-research.md](./3-research.md): Approaches for conducting deep research


