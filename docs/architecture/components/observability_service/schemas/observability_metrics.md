# Observability Metrics

## Overview

The Observability Metrics schema defines the structure for time-series metrics data collected across the system. It enables monitoring, alerting, and performance analysis for all system components.

## Key Concepts

* **Metric** - A quantifiable measure of system behavior or performance
* **Metric Type** - Counter, gauge, histogram, or summary
* **Dimensions** - Key-value pairs for categorizing and filtering metrics
* **Time Series** - Sequence of data points indexed by time
* **Aggregation** - Statistical combination of metrics (sum, average, percentiles)

## Schema Structure

```json
{
  "metric": {
    "id": "string",                  // UUID for this metric entry
    "name": "string",                // Metric name (e.g., "http_requests_total")
    "type": "string",                // COUNTER, GAUGE, HISTOGRAM, SUMMARY
    "description": "string",         // Human-readable description
    "unit": "string",                // Unit of measurement (e.g., "seconds", "bytes")
    "timestamp": "string",           // ISO8601 timestamp
    "value": "number",               // The metric value (for COUNTER, GAUGE)
    "values": {                      // For HISTOGRAM, SUMMARY types
      "min": "number",
      "max": "number",
      "sum": "number",
      "count": "number",
      "mean": "number",
      "median": "number",
      "p95": "number",
      "p99": "number"
    },
    "dimensions": {                  // Metric dimensions for filtering/grouping
      "component": "string",         // Source component name
      "service": "string",           // Service instance identifier
      "instance_id": "string",       // Container/pod ID
      "environment": "string",       // Environment (dev, test, prod)
      "host": "string",              // Host machine
      "additional_dimensions": {}    // Custom dimensions
    },
    "metadata": {                    // Additional information about the metric
      "collection_interval": "string", // How often it's collected
      "version": "string"            // Schema version
    }
  }
}
```

## Metric Types

| Type | Description | Example Use Case |
|------|-------------|-----------------|
| COUNTER | Cumulative value that only increases | Request counts, completed tasks |
| GAUGE | Value that can go up or down | Memory usage, active connections |
| HISTOGRAM | Sample observations with configurable buckets | Request duration distribution |
| SUMMARY | Similar to histogram but focuses on quantiles | Service response time percentiles |

## Database Schema

**Table: observability_metrics**

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(100) | Metric name |
| type | VARCHAR(20) | COUNTER, GAUGE, HISTOGRAM, SUMMARY |
| description | TEXT | Human-readable description |
| unit | VARCHAR(20) | Unit of measurement |
| timestamp | TIMESTAMP(6) | When metric was recorded (microsecond precision) |
| value | DOUBLE PRECISION | Metric value (for COUNTER, GAUGE) |
| values | JSONB | Statistical values (for HISTOGRAM, SUMMARY) |
| dimensions | JSONB | Dimensions for filtering/grouping |
| metadata | JSONB | Additional information |

## Downsampling and Aggregation

The metrics system implements automatic downsampling to manage data growth:

| Retention Period | Resolution | Aggregation |
|------------------|------------|-------------|
| Last 24 hours | Raw data | None |
| Last 7 days | 1-minute | Average, Min, Max |
| Last 30 days | 5-minute | Average, Min, Max |
| Last 90 days | 1-hour | Average, Min, Max |
| Beyond 90 days | 1-day | Average, Min, Max |

## Database Optimization

The Observability Metrics table implements these optimizations:

1. **Time-Series Optimization** - Specialized time-series storage format
2. **Automatic Partitioning** - Data partitioned by time ranges
3. **Dimension Indexing** - Efficient queries across metric dimensions
4. **Downsampling** - Automatic data reduction for older metrics
5. **Materialized Views** - Pre-aggregated views for common queries

## Related Documentation

* [Observability Service Architecture](../overview.md)
* [Metrics Collection Implementation](../implementation/metrics_collection.md)
* [Metrics Query API](../interfaces/api.md)
* [Alerting Configuration](../operations/alerting.md) 