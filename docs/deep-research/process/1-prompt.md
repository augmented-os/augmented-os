# Step 1: Craft the Initial Prompt

## Overview

The initial prompt is the foundation of effective deep research. A well-crafted prompt clearly defines the research question, provides necessary context, and sets appropriate parameters for the AI's response.

## Key Elements of an Effective Initial Prompt


1. **Clear Research Question**: Precisely define what you're trying to learn or solve
2. **Relevant Context**: Provide background information necessary for understanding the problem
3. **Scope Definition**: Establish boundaries for the research to maintain focus
4. **Technical Level**: Indicate the desired depth and technical sophistication
5. **Output Format**: Specify how you want the information structured (if applicable)

## Prompt Structure Template

```
# Research Topic: [Brief title of the research area]

## Background
[2-3 sentences providing context about the project, system, or problem]

## Research Question
[Clear, specific question or problem statement]

## Relevant Information
- [Current approach or understanding]
- [Constraints or requirements]
- [Previous attempts or known alternatives]
- [Technologies or frameworks in use]

## Desired Outcome
[What you hope to learn or achieve through this research]

## Technical Depth
[Indicate desired level of technical detail: conceptual overview, implementation details, etc.]
```

## Example: Effective Initial Prompt

```
# Research Topic: Event Processing Architecture Evaluation

## Background
We're building an event processing system for Augmented OS that needs to handle high-volume event streams with complex correlation patterns.

## Research Question
What is the most appropriate event processing architecture considering our requirements for processing 10,000+ events per second with complex correlation patterns, guaranteed delivery, horizontal scalability, and low latency?

## Relevant Information
- Currently considering Kafka-based stream processing, event sourcing with CQRS, and cloud-native serverless approaches
- Must support complex event correlation across multiple event types
- System needs to scale horizontally to handle variable load
- Critical events must be processed with low latency (<100ms)
- We have experience with Java and Python, but are open to other technologies

## Desired Outcome
A comparative analysis of architectural approaches with recommendations based on our specific requirements.

## Technical Depth
Detailed technical analysis including implementation considerations, performance characteristics, and specific technology recommendations.
```

## Common Pitfalls to Avoid


1. **Vague Questions**: "What's the best way to handle events?" is too broad
2. **Missing Context**: Omitting critical information about your system or constraints
3. **Leading Questions**: Framing that pushes toward a predetermined answer
4. **Excessive Constraints**: Over-specifying and limiting valuable exploration
5. **Technical Mismatch**: Requesting a technical depth that doesn't match your needs

## Tips for Refining Your Prompt


1. **Be Specific**: Clearly articulate what you're trying to learn
2. **Provide Context**: Include relevant background information
3. **Define Parameters**: Establish scope and constraints
4. **Avoid Assumptions**: Don't assume the AI knows your specific context
5. **Invite Exploration**: Allow room for unexpected insights

## Next Steps

After crafting your initial prompt:


1. Review it for clarity, specificity, and completeness
2. Consider whether it might lead to biased or limited responses
3. Ensure it provides sufficient context for meaningful research
4. Be prepared to engage in the clarification phase (Step 2)

## Related Resources

* [2-clarify.md](./2-clarify.md): Guidelines for the clarification phase
* [Format Guidelines](../format.md): Documentation format standards


