# Step 3: Perform the Deep Research

## Overview

The research phase is where the AI conducts in-depth exploration of your topic based on the initial prompt and clarifications. This phase may involve multiple exchanges as you guide the research toward your specific needs.

## Guiding Effective Research

### Iterative Exploration

Deep research often works best as an iterative process. Start with broader questions, then progressively narrow focus based on initial findings.

**Example Progression:**


1. "Provide an overview of event processing architectures suitable for high-throughput systems."
2. "Let's focus on the three most promising approaches for our requirements."
3. "For the Kafka-based approach, what are the specific implementation considerations?"

### Directing the Research

Use specific prompts to guide the research in productive directions:


1. **Comparative Analysis**: "Compare approaches A, B, and C based on our requirements."
2. **Deep Dive**: "Let's explore approach A in more technical detail."
3. **Challenge Assumptions**: "What might we be overlooking in this approach?"
4. **Practical Application**: "How would this approach work in our specific context?"
5. **Trade-off Analysis**: "What are the key trade-offs between these options?"

### Requesting Evidence and Reasoning

Ask the AI to support its analysis with evidence and reasoning:


1. **Request Justification**: "Why do you recommend this approach over the alternatives?"
2. **Ask for Examples**: "Can you provide examples of similar systems using this approach?"
3. **Seek Technical Details**: "What specific mechanisms make this approach suitable?"
4. **Question Assertions**: "You mentioned X is better than Y - what evidence supports this?"

## Research Techniques

### Multi-Angle Analysis

Examine the topic from different perspectives:

```
Let's analyze the Kafka-based architecture from multiple perspectives:
1. Performance characteristics
2. Operational complexity
3. Development experience
4. Failure scenarios
5. Cost implications
```

### Scenario-Based Evaluation

Use concrete scenarios to test approaches:

```
How would each architecture handle these scenarios:
1. A sudden spike of 50,000 events in 10 seconds
2. A network partition between processing nodes
3. The need to add a new event type with different processing requirements
4. A requirement to replay historical events
```

### Expert Perspective

Ask the AI to adopt specific expert perspectives:

```
As an experienced architect who has implemented all three approaches in production:
1. Which would you recommend for our specific requirements?
2. What implementation pitfalls should we be aware of?
3. What would you do differently if implementing this today?
```

### Constraint Analysis

Evaluate how different constraints affect recommendations:

```
How would your recommendations change if:
1. We needed to process 100,000 events/second instead of 10,000
2. We had strict latency requirements of under 50ms
3. We needed to deploy in a resource-constrained environment
4. We had regulatory requirements for data retention
```

## Managing Research Depth

### Balancing Breadth and Depth

* Start with breadth to understand the landscape
* Progressively focus on promising areas
* Go deep on critical aspects
* Return to breadth to ensure nothing is missed

### Recognizing Diminishing Returns

Know when to conclude a particular line of inquiry:


1. When multiple approaches converge on the same conclusion
2. When additional detail doesn't meaningfully impact decision-making
3. When you have sufficient information to move forward

## Documenting the Research

Keep track of key findings throughout the research phase:


1. **Save Important Outputs**: Preserve valuable insights and analysis
2. **Note Decision Points**: Record where and why the research direction changed
3. **Track Open Questions**: Maintain a list of questions for further exploration
4. **Capture Emerging Patterns**: Note recurring themes or insights

## Moving to the Findings Phase

You're ready to move to the findings phase (Step 4) when:


1. You have sufficient information to address your research question
2. Key alternatives have been thoroughly explored
3. Critical technical details have been examined
4. You have a clear understanding of trade-offs and implications

## Related Resources

* [2-clarify.md](./2-clarify.md): Guidelines for the clarification phase
* [4-findings.md](./4-findings.md): Methods for summarizing findings effectively


