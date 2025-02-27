Clarifying Questions

* **Inngest Capabilities:**
  * Are you looking for a direct comparison between your current JSON-based workflow structure and Inngest’s native step function implementation, or just a deep dive into Inngest’s best practices?
* **Data Schema Design:**
  * Should the proposed schemas be backwards compatible with your current system, or are you open to a full redesign if necessary?
  * Should the schemas prioritize ease of use for developers (e.g., simpler JSON structures) or flexibility for dynamic configurations?
* **Dynamic UI Architecture:**
  * Do you have existing frontend libraries or frameworks in use that should be leveraged, or is the UI architecture open for a complete revamp?
  * Would you prefer a configuration-driven UI (e.g., JSON-defined components) or a more code-driven approach with standardized components?
* **Migration Strategy:**
  * Do you need a phased migration plan that allows incremental adoption, or are you open to a single large migration with feature flags for rollback?
  * Are there specific workflows that must be preserved as-is due to legacy dependencies?

## Clarifying Answers


1. No, our current architecture relies on ingest for orchestration and execution. The two are closely integrated, and so researching ingest is really key in order to ensure the architecture is optimal. You should also give direct consideration to replacing Ingest's capabilities with our own orchestration stack and the level of complexity that might involve.
2. No, essentially we have a proof of concept and we're quite happy to start from scratch when it comes to all of the proposed schemas. We do feel there's some value in what we've done, and the approaches that we've taken, but there's a lot of improvements which could be
3. We're currently using a shad CN and Tailwind within Next.js. We would be open to alternatives, but this seems to be a very easy tech choice to work with both for a human engineer coding and for AI to generate and iterate code code.
4. Essentially ignore a migration strategy. What we would look to do is build out a completely new architectural template and then kind of pour everything over. So ignore anything about migration, really we want to treat this as a fresh project building on all of the work that we've done so far, but in... Improving it in any way that we think is going to be valuable.


