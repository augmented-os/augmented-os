# Event Processing Service Troubleshooting Guide

## Overview

This document provides guidance for diagnosing and resolving common issues with the Event Processing Service. It includes troubleshooting procedures, common error scenarios, diagnostic tools, and recovery strategies.

## Diagnostic Tools

### Health Check Endpoints

Use the health check endpoints to quickly assess service status:

```bash
# Check overall health
curl -X GET http://localhost:3000/health

# Check component health
curl -X GET http://localhost:3000/health/components

# Check database health
curl -X GET http://localhost:3000/health/database
```

### Log Analysis

The Event Processing Service logs are structured in JSON format and can be analyzed using standard tools:

```bash
# View recent logs
tail -f logs/event-service.log | jq

# Filter for error logs
grep -i "level\":\"error" logs/event-service.log | jq

# Count errors by type
grep -i "level\":\"error" logs/event-service.log | jq '.error.code' | sort | uniq -c | sort -nr
```

### Metrics Endpoints

Access metrics for real-time performance analysis:

```bash
# Prometheus metrics
curl -X GET http://localhost:3000/metrics

# JSON metrics summary
curl -X GET http://localhost:3000/admin/metrics
```

### Diagnostic Commands

The service provides diagnostic commands for troubleshooting:

```bash
# Check service version and build info
curl -X GET http://localhost:3000/admin/info

# Get current configuration (redacted)
curl -X GET http://localhost:3000/admin/config

# Check subscription status
curl -X GET http://localhost:3000/admin/subscriptions/status

# View event processing statistics
curl -X GET http://localhost:3000/admin/events/stats
```

## Common Issues and Solutions

### Service Won't Start

#### Symptoms

* Service process exits immediately after startup
* Error logs show configuration or initialization failures

#### Possible Causes and Solutions


1. **Invalid Configuration**
   * **Cause**: Configuration file contains invalid values or is malformed
   * **Solution**: Validate configuration file format and values

   ```bash
   # Validate configuration file
   node scripts/validate-config.js config/production.json
   ```
2. **Database Connection Failure**
   * **Cause**: Cannot connect to the database
   * **Solution**: Verify database credentials and connectivity

   ```bash
   # Test database connection
   node scripts/test-db-connection.js
   ```
3. **Port Already in Use**
   * **Cause**: Another process is using the configured port
   * **Solution**: Change the port or stop the conflicting process

   ```bash
   # Find process using the port
   lsof -i :3000
   ```
4. **Insufficient Permissions**
   * **Cause**: Service lacks permissions to access required resources
   * **Solution**: Check file and directory permissions

   ```bash
   # Check permissions
   ls -la logs/
   ls -la config/
   ```

### High Event Processing Latency

#### Symptoms

* Events take longer than expected to be processed
* `events.end_to_end.latency` metric shows increasing values
* Subscribers report delayed event delivery

#### Possible Causes and Solutions


1. **Queue Backlog**
   * **Cause**: Events are being produced faster than they can be processed
   * **Solution**: Scale the service or optimize processing

   ```bash
   # Check queue depth
   curl -X GET http://localhost:3000/admin/queue/stats
   ```
2. **Database Performance Issues**
   * **Cause**: Slow database queries or connection pool exhaustion
   * **Solution**: Optimize queries, increase connection pool, or scale database

   ```bash
   # Check database performance
   curl -X GET http://localhost:3000/admin/database/stats
   ```
3. **Resource Constraints**
   * **Cause**: CPU, memory, or disk I/O limitations
   * **Solution**: Increase resources or optimize resource usage

   ```bash
   # Check resource usage
   curl -X GET http://localhost:3000/admin/system/resources
   ```
4. **Network Latency**
   * **Cause**: High network latency to subscribers
   * **Solution**: Investigate network issues or deploy service closer to subscribers

   ```bash
   # Check network latency to subscribers
   curl -X GET http://localhost:3000/admin/subscribers/latency
   ```

### Event Delivery Failures

#### Symptoms

* Events are not being delivered to subscribers
* `events.failed.rate` metric is high
* Dead letter queue is growing

#### Possible Causes and Solutions


1. **Subscriber Unavailability**
   * **Cause**: Subscriber endpoints are unreachable or returning errors
   * **Solution**: Check subscriber health and connectivity

   ```bash
   # Check subscriber status
   curl -X GET http://localhost:3000/admin/subscribers/status
   ```
2. **Event Validation Failures**
   * **Cause**: Events fail schema validation
   * **Solution**: Fix event producers to comply with schemas

   ```bash
   # Check validation error rates
   curl -X GET http://localhost:3000/admin/events/validation/errors
   ```
3. **Circuit Breaker Open**
   * **Cause**: Circuit breaker has tripped due to repeated failures
   * **Solution**: Investigate and fix subscriber issues, then reset circuit breaker

   ```bash
   # Check circuit breaker status
   curl -X GET http://localhost:3000/admin/circuit-breakers
   
   # Reset circuit breaker for a subscriber
   curl -X POST http://localhost:3000/admin/circuit-breakers/reset/subscriber-id
   ```
4. **Authentication Failures**
   * **Cause**: Invalid or expired authentication credentials
   * **Solution**: Update authentication configuration

   ```bash
   # Check authentication failures
   curl -X GET http://localhost:3000/admin/auth/failures
   ```

### Memory Leaks

#### Symptoms

* Increasing memory usage over time
* Service becomes unresponsive after running for a while
* Eventual out-of-memory errors

#### Possible Causes and Solutions


1. **Event Cache Growth**
   * **Cause**: Event cache not properly evicting old entries
   * **Solution**: Adjust cache TTL or size limits

   ```bash
   # Check cache statistics
   curl -X GET http://localhost:3000/admin/cache/stats
   
   # Clear cache
   curl -X POST http://localhost:3000/admin/cache/clear
   ```
2. **Subscription Leaks**
   * **Cause**: Subscriptions not being properly cleaned up
   * **Solution**: Clean up stale subscriptions

   ```bash
   # List inactive subscriptions
   curl -X GET http://localhost:3000/admin/subscriptions/inactive
   
   # Clean up stale subscriptions
   curl -X POST http://localhost:3000/admin/subscriptions/cleanup
   ```
3. **Event Listener Leaks**
   * **Cause**: Event listeners not being properly removed
   * **Solution**: Restart the service and monitor for recurrence

   ```bash
   # Check event listener count
   curl -X GET http://localhost:3000/admin/diagnostics/event-listeners
   ```

### Database Issues

#### Symptoms

* Slow queries
* Connection pool exhaustion
* Database-related error logs

#### Possible Causes and Solutions


1. **Connection Pool Exhaustion**
   * **Cause**: Too many concurrent database operations
   * **Solution**: Increase connection pool size or optimize query patterns

   ```bash
   # Check connection pool status
   curl -X GET http://localhost:3000/admin/database/connections
   ```
2. **Missing Indexes**
   * **Cause**: Queries running without proper indexes
   * **Solution**: Add indexes for common query patterns

   ```bash
   # Check slow queries
   curl -X GET http://localhost:3000/admin/database/slow-queries
   ```
3. **Database Growth**
   * **Cause**: Tables growing too large
   * **Solution**: Implement data archiving or partitioning

   ```bash
   # Check table sizes
   curl -X GET http://localhost:3000/admin/database/table-sizes
   ```

## Recovery Procedures

### Service Restart

If the service needs to be restarted, follow these steps to minimize disruption:


1. **Graceful Shutdown**

   ```bash
   # Send SIGTERM to allow graceful shutdown
   kill -TERM <pid>
   ```
2. **Verify Queue State**

   ```bash
   # Check if queue was persisted properly
   curl -X GET http://localhost:3000/admin/queue/status
   ```
3. **Start Service**

   ```bash
   # Start the service
   npm run start:production
   ```
4. **Verify Recovery**

   ```bash
   # Check health after restart
   curl -X GET http://localhost:3000/health/components
   ```

### Event Replay

To replay events that may have been lost or failed:


1. **Identify Failed Events**

   ```bash
   # List events in dead letter queue
   curl -X GET http://localhost:3000/admin/dead-letter-queue
   ```
2. **Replay Specific Events**

   ```bash
   # Replay a specific event
   curl -X POST http://localhost:3000/admin/events/replay/event-id
   ```
3. **Replay Events by Time Range**

   ```bash
   # Replay events from a time range
   curl -X POST http://localhost:3000/admin/events/replay \
     -H "Content-Type: application/json" \
     -d '{"startTime": "2023-01-01T00:00:00Z", "endTime": "2023-01-02T00:00:00Z"}'
   ```

### Database Recovery

If database issues occur:


1. **Check Database Connectivity**

   ```bash
   # Test database connection
   node scripts/test-db-connection.js
   ```
2. **Verify Schema Integrity**

   ```bash
   # Run schema validation
   npm run db:validate
   ```
3. **Run Migrations if Needed**

   ```bash
   # Apply any pending migrations
   npm run db:migrate
   ```
4. **Restore from Backup if Necessary**

   ```bash
   # Restore database from backup
   node scripts/restore-db.js --backup=backup_20230101.sql
   ```

## Debugging Techniques

### Enable Debug Logging

Temporarily increase log verbosity for troubleshooting:

```bash
# Set log level to debug
curl -X PUT http://localhost:3000/admin/config/log-level \
  -H "Content-Type: application/json" \
  -d '{"value": "debug"}'
```

### Component-Specific Debugging

Enable debugging for specific components:

```bash
# Enable detailed logging for event router
curl -X PUT http://localhost:3000/admin/config/component-log-level \
  -H "Content-Type: application/json" \
  -d '{"component": "event-router", "level": "debug"}'
```

### Request Tracing

Enable request tracing to debug specific requests:

```bash
# Enable tracing for a specific event type
curl -X PUT http://localhost:3000/admin/tracing/event-type \
  -H "Content-Type: application/json" \
  -d '{"eventType": "user.created", "enabled": true}'
```

### Memory Snapshots

Take memory snapshots to diagnose memory issues:

```bash
# Generate memory snapshot
curl -X POST http://localhost:3000/admin/diagnostics/memory-snapshot
```

## Preventive Maintenance

### Regular Health Checks

Set up regular health checks to detect issues early:

```bash
# Example cron job to check service health
*/5 * * * * curl -s http://localhost:3000/health > /dev/null || send-alert.sh "Event Service Unhealthy"
```

### Log Rotation

Ensure logs are properly rotated to prevent disk space issues:

```bash
# Check log rotation configuration
cat /etc/logrotate.d/event-service
```

### Database Maintenance

Schedule regular database maintenance:

```bash
# Example database maintenance script
0 2 * * 0 /opt/event-service/scripts/db-maintenance.sh
```

### Monitoring Alerts

Set up alerts for key metrics:


1. **High Latency Alert**
   * Trigger when `events.end_to_end.latency` exceeds threshold
   * Example threshold: > 1000ms for 5 minutes
2. **Queue Depth Alert**
   * Trigger when `queue.depth` exceeds threshold
   * Example threshold: > 5000 for 10 minutes
3. **Error Rate Alert**
   * Trigger when `events.failed.rate` exceeds threshold
   * Example threshold: > 5% for 5 minutes
4. **Resource Usage Alert**
   * Trigger when CPU or memory usage exceeds threshold
   * Example threshold: > 85% for 15 minutes

## Troubleshooting Decision Tree

Use this decision tree to diagnose issues:


1. **Is the service running?**
   * No → Check startup logs and configuration
   * Yes → Continue to next step
2. **Is the service healthy?**
   * No → Check component health endpoints
   * Yes → Continue to next step
3. **Are events being received?**
   * No → Check event receiver component and client connectivity
   * Yes → Continue to next step
4. **Are events being processed?**
   * No → Check event processor component and queue status
   * Yes → Continue to next step
5. **Are events being delivered?**
   * No → Check subscriber status and event router
   * Yes → Issue may be intermittent or resolved

## Related Documentation

* [Monitoring Guide](./monitoring.md)
* [Configuration Guide](./configuration.md)
* [Scaling Guide](./scaling.md)
* [Event Router Implementation](../implementation/event_router.md)
* [Internal Event Queue](../implementation/internal_queue.md)


