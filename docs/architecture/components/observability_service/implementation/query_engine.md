# Query Engine

## Overview

The Query Engine is a core component of the Observability Service responsible for enabling efficient data retrieval, analysis, and visualization across logs, metrics, and traces. It provides a unified query interface while optimizing for the specific characteristics of each data type and backend storage system.

## Key Responsibilities

* Parsing and validating query expressions
* Translating queries to storage-specific query languages
* Optimizing query plans for performance
* Executing queries across multiple data sources
* Aggregating and transforming query results
* Supporting complex analytics functions
* Implementing caching and result reuse
* Enforcing access control and data security policies

## Implementation Approach

The Query Engine system follows these design principles:

1. **Unified Interface** - Provide a consistent query interface across different data types
2. **Query Optimization** - Automatically optimize queries for performance and resource utilization
3. **Federated Execution** - Support queries that span multiple data sources
4. **Progressive Results** - Return partial results as they become available for long-running queries
5. **Resource Management** - Implement resource limits and safeguards to prevent excessive consumption

## Query Execution Lifecycle

```
┌──────────────┐
│  Query       │
│  Request     │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────────┐
│  Parse &     │────►│    Semantic      │
│  Validate    │     │    Analysis      │
└──────────────┘     └────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │    Query Plan     │
                    │    Generation     │
                    └─────────┬─────────┘
                              │
                              ▼
          ┌──────────────────┬───────────────────┬──────────────────┐
          │                  │                   │                  │
          ▼                  ▼                   ▼                  ▼
┌──────────────────┐ ┌───────────────┐ ┌─────────────────┐ ┌────────────────┐
│   Log Query      │ │ Metric Query  │ │  Trace Query    │ │   Federated    │
│   Execution      │ │   Execution   │ │   Execution     │ │   Execution    │
└────────┬─────────┘ └───────┬───────┘ └────────┬────────┘ └────────┬───────┘
         │                   │                  │                   │
         └───────────────────┼──────────────────┼───────────────────┘
                             │                  │
                             ▼                  ▼
                     ┌───────────────┐ ┌────────────────┐
                     │  Result       │ │  Result        │
                     │  Processing   │ │  Caching       │
                     └───────┬───────┘ └────────────────┘
                             │
                             ▼
                     ┌───────────────┐
                     │  Response     │
                     │  Formatting   │
                     └───────────────┘
```

## Implementation Details

### Query Language

The Query Engine supports multiple query languages to accommodate different use cases:

1. **Unified Query Language (UQL)** - A custom language designed for cross-data-type queries
2. **LogQL** - For log queries, compatible with Loki/Grafana
3. **PromQL** - For metric queries, compatible with Prometheus
4. **TraceQL** - For trace queries, based on Jaeger query language

```typescript
// Query parser implementation
class QueryParser {
  parse(query: string, type: QueryType): QueryAst {
    switch (type) {
      case QueryType.LOG:
        return this.logParser.parse(query);
      case QueryType.METRIC:
        return this.metricParser.parse(query);
      case QueryType.TRACE:
        return this.traceParser.parse(query);
      case QueryType.UNIFIED:
        return this.unifiedParser.parse(query);
      default:
        throw new Error(`Unsupported query type: ${type}`);
    }
  }
}
```

Example UQL query:
```
// Find all error logs and related traces for a specific service
logs.service("auth-service").level("ERROR").last(15m)
| join traces on traceId
| where traces.duration > 500ms
| sort by timestamp desc
| limit 100
```

### Query Planning and Optimization

The Query Engine implements several key optimizations:

1. **Predicate Pushdown**: Filter conditions are pushed to the lowest possible layer
2. **Projection Pushdown**: Only required fields are retrieved from storage
3. **Time-based Pruning**: Queries are narrowed to relevant time partitions
4. **Parallel Execution**: Independent sub-queries are executed concurrently
5. **Result Reuse**: Intermediate results are cached for reuse across similar queries

```typescript
// Simplified query planner
interface QueryPlan {
  steps: QueryStep[];
  optimization: Optimization[];
  estimatedCost: Cost;
}

class QueryPlanner {
  plan(ast: QueryAst, metadata: Metadata): QueryPlan {
    // Convert AST to logical plan
    const logicalPlan = this.createLogicalPlan(ast);
    
    // Apply optimizations
    const optimizedPlan = this.optimizePlan(logicalPlan, metadata);
    
    // Estimate execution cost
    const cost = this.estimateCost(optimizedPlan);
    
    return {
      steps: optimizedPlan.steps,
      optimization: optimizedPlan.appliedOptimizations,
      estimatedCost: cost
    };
  }
}
```

### Cross-Data Type Federation

The Query Engine supports federated queries across different data types:

1. **Log-to-trace correlation**: Join logs with related trace spans
2. **Metric-to-log correlation**: Find logs occurring during metric anomalies
3. **Trace-to-metric correlation**: Correlate high latency traces with system metrics

Federation is implemented through specialized operators:

* **join**: Correlate datasets using common fields
* **lookup**: Enrich data from one source with another
* **union**: Combine results from multiple queries
* **correlate**: Find temporal correlations across datasets

### Time Series Analysis

For metrics, the engine provides advanced time series functions:

* **Aggregations**: sum, avg, min, max, count, percentile
* **Transformations**: rate, delta, increase, derivative
* **Windows**: sliding windows, tumbling windows
* **Statistical**: outlier detection, trend analysis, forecasting
* **Alerting**: threshold comparison, anomaly detection

### Edge Cases and Error Handling

The implementation addresses the following edge cases:

| Scenario | Handling Approach |
|----|----|
| Query timeout | Resource budgeting with partial results and cancellation |
| Missing data | Graceful null handling with configurable gap-filling policies |
| High cardinality | Dynamic sampling and cardinality limits for protection |
| Cross-shard consistency | Two-phase execution with timestamp alignment |
| Result truncation | Clear indication of truncation with continuation tokens |
| Backend failures | Partial results from available sources with error details |

## Performance Considerations

The Query Engine is optimized for interactive query performance:

* **Dynamic Query Planning**: Adapts execution strategy based on data size and distribution
* **Resource Limits**: Per-query resource budgets (CPU, memory, I/O)
* **Progressive Results**: Stream results as they become available for large queries
* **Query Caching**: Multi-level caching for raw data and computed results
* **Query Compilation**: Key queries are compiled to optimized execution plans

### Benchmarks

| Operation | Average Performance | P99 Performance |
|----|----|----|
| Simple log query (last 15min) | < 100ms | < 500ms |
| Complex log query (last 24h, multiple filters) | < 1s | < 5s |
| Simple metric query (last 1h) | < 50ms | < 200ms |
| Complex metric query (multi-series, functions) | < 500ms | < 2s |
| Trace query (by trace ID) | < 100ms | < 300ms |
| Federated query (logs + traces) | < 2s | < 8s |

## Related Documentation

* [Data Model](../data_model.md)
* [Storage Manager](./storage_manager.md)
* [API Reference](../interfaces/api.md)
* [Dashboard Integration](../../web_application_service/implementation/observability_dashboard.md)


