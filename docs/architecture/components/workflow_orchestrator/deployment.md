# Deployment Guide

## Overview

This guide provides instructions for deploying the Workflow Orchestrator Service in various environments. It covers prerequisites, deployment options, configuration, and post-deployment verification steps.

## Prerequisites

Before deploying the Workflow Orchestrator Service, ensure the following prerequisites are met:

### System Requirements

| Component | Minimum | Recommended |
|----|----|----|
| CPU | 2 cores | 4+ cores |
| Memory | 4GB RAM | 8GB+ RAM |
| Disk | 20GB | 50GB+ |
| Operating System | Linux (Ubuntu 20.04+, RHEL 8+) | Linux (Ubuntu 22.04, RHEL 9) |

### Dependencies


1. **Database**:
   * PostgreSQL 14+ with the following extensions:
     * `pgcrypto`
     * `pg_trgm`
     * `btree_gin`
   * Connection details (host, port, credentials, database name)
2. **Message Broker** (optional but recommended):
   * Kafka 3.0+ or RabbitMQ 3.9+
   * Connection details and authentication
3. **Infrastructure**:
   * Kubernetes 1.22+ (for container deployment)
   * Docker 20.10+ (for container builds)
   * Helm 3.8+ (for Kubernetes deployments)
4. **Network**:
   * Outbound internet access for dependency downloads
   * Inbound access on service ports (default: 8080, 8081)
   * Access to database and message broker
5. **Security**:
   * TLS certificates for HTTPS endpoints
   * Service account with appropriate permissions
   * Secrets management solution (e.g., Kubernetes Secrets, HashiCorp Vault)

## Deployment Options

### Docker Container

```bash
# Pull the container image
docker pull company-registry/workflow-orchestrator:latest

# Run with basic configuration
docker run -d \
  --name workflow-orchestrator \
  -p 8080:8080 \
  -p 8081:8081 \
  -e DATABASE_URL=jdbc:postgresql://db-host:5432/workflows \
  -e DATABASE_USERNAME=workflow_user \
  -e DATABASE_PASSWORD=secure_password \
  -e LOG_LEVEL=INFO \
  company-registry/workflow-orchestrator:latest
```

### Kubernetes with Helm

```bash
# Add the Helm repository
helm repo add company-charts https://charts.company.com/
helm repo update

# Install the chart
helm install workflow-orchestrator company-charts/workflow-orchestrator \
  --namespace workflow-system \
  --create-namespace \
  --set database.host=db-host \
  --set database.name=workflows \
  --set database.user=workflow_user \
  --set database.password=secure_password \
  --set replicaCount=3
```

### Manual Deployment

```bash
# Download the release package
curl -LO https://releases.company.com/workflow-orchestrator/latest/workflow-orchestrator.zip
unzip workflow-orchestrator.zip

# Configure the service
cd workflow-orchestrator
cp config/application.yaml.example config/application.yaml
# Edit application.yaml with your configuration

# Start the service
./bin/start.sh
```

## Configuration

### Core Configuration File

Create a configuration file `application.yaml` with the following structure:

```yaml
server:
  port: 8080
  managementPort: 8081
  contextPath: /api
  
database:
  url: jdbc:postgresql://localhost:5432/workflows
  username: workflow_user
  password: ${DATABASE_PASSWORD}  # Use environment variable
  poolSize: 20
  
eventProcessing:
  source: kafka  # Options: kafka, rabbitmq, database
  kafka:
    bootstrapServers: kafka:9092
    consumerGroup: workflow-orchestrator
    topics:
      - business-events
      - system-events
  
scheduler:
  enabled: true
  threadPoolSize: 5
  
logging:
  level: INFO
  appenders:
    console:
      enabled: true
    file:
      enabled: true
      path: /var/log/workflow-orchestrator/service.log
      rollingPolicy:
        maxSize: 100MB
        maxHistory: 10
        
metrics:
  enabled: true
  prometheus:
    enabled: true
```

### Environment Variables

The following environment variables can be used to override configuration:

| Variable | Description | Default |
|----|----|----|
| `SERVER_PORT` | HTTP port for API | 8080 |
| `MANAGEMENT_PORT` | HTTP port for management endpoints | 8081 |
| `DATABASE_URL` | JDBC URL for database connection | - |
| `DATABASE_USERNAME` | Database username | - |
| `DATABASE_PASSWORD` | Database password | - |
| `DATABASE_POOL_SIZE` | Connection pool size | 20 |
| `KAFKA_BOOTSTRAP_SERVERS` | Kafka bootstrap servers | - |
| `LOG_LEVEL` | Application log level | INFO |
| `METRICS_ENABLED` | Enable metrics collection | true |

### Secrets Management

For production deployments, use a secrets management solution:

#### Kubernetes Secrets

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: workflow-orchestrator-secrets
  namespace: workflow-system
type: Opaque
data:
  database-password: <base64-encoded-password>
  kafka-password: <base64-encoded-password>
```

Reference in deployment:

```yaml
env:
  - name: DATABASE_PASSWORD
    valueFrom:
      secretKeyRef:
        name: workflow-orchestrator-secrets
        key: database-password
```

#### HashiCorp Vault

```bash
# Store secrets in Vault
vault kv put secret/workflow-orchestrator/prod \
  database-password=secure_password \
  kafka-password=secure_kafka_password

# Configure service to use Vault
export VAULT_ADDR=https://vault.company.com
export VAULT_TOKEN=s.xxxxxxxx
```

## Database Setup

### Schema Initialization

```bash
# Using the provided schema tool
./bin/init-schema.sh \
  --url jdbc:postgresql://db-host:5432/workflows \
  --username workflow_user \
  --password secure_password

# Or manually with SQL files
psql -h db-host -U workflow_user -d workflows -f schema/init.sql
```

### Migration

```bash
# Run database migrations
./bin/migrate.sh \
  --url jdbc:postgresql://db-host:5432/workflows \
  --username workflow_user \
  --password secure_password
```

## Deployment Environments

### Development

```yaml
# development.yaml
server:
  port: 8080
database:
  url: jdbc:postgresql://localhost:5432/workflows_dev
logging:
  level: DEBUG
```

### Staging

```yaml
# staging.yaml
server:
  port: 8080
database:
  url: jdbc:postgresql://db-staging:5432/workflows_staging
  poolSize: 10
logging:
  level: INFO
```

### Production

```yaml
# production.yaml
server:
  port: 8080
database:
  url: jdbc:postgresql://db-prod-primary:5432/workflows_prod
  poolSize: 50
  readReplicas:
    - url: jdbc:postgresql://db-prod-replica-1:5432/workflows_prod
    - url: jdbc:postgresql://db-prod-replica-2:5432/workflows_prod
logging:
  level: WARN
  appenders:
    console:
      enabled: true
    file:
      enabled: true
    syslog:
      enabled: true
      host: logserver.company.com
      port: 514
```

## High Availability Setup

For production deployments, configure for high availability:

### Multiple Instances

Deploy at least 3 instances of the service behind a load balancer:

```yaml
# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: workflow-orchestrator
spec:
  replicas: 3
  selector:
    matchLabels:
      app: workflow-orchestrator
  template:
    metadata:
      labels:
        app: workflow-orchestrator
    spec:
      containers:
      - name: workflow-orchestrator
        image: company-registry/workflow-orchestrator:latest
        ports:
        - containerPort: 8080
        - containerPort: 8081
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8081
          initialDelaySeconds: 30
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8081
          initialDelaySeconds: 60
          periodSeconds: 15
```

### Database Redundancy

Configure database redundancy:

```yaml
database:
  primary:
    url: jdbc:postgresql://db-primary:5432/workflows
    poolSize: 20
  replicas:
    - url: jdbc:postgresql://db-replica-1:5432/workflows
      poolSize: 30
    - url: jdbc:postgresql://db-replica-2:5432/workflows
      poolSize: 30
  readPreference: PREFER_REPLICA
```

### Distributed Scheduler

Configure the scheduler for distributed operation:

```yaml
scheduler:
  distributed:
    enabled: true
    lockingMechanism: database
    leaderElectionInterval: 30s
```

## Post-Deployment Verification

### Health Check

Verify the service is running correctly:

```bash
# Check basic health
curl http://service-host:8081/health

# Check readiness
curl http://service-host:8081/health/ready

# Check detailed health status
curl http://service-host:8081/health/detailed
```

Expected response:

```json
{
  "status": "healthy",
  "components": {
    "database": {
      "status": "healthy",
      "details": {
        "connectionPool": "10/20",
        "latency": "5ms"
      }
    },
    "eventProcessing": {
      "status": "healthy",
      "details": {
        "subscriptionCount": 150,
        "processingDelay": "50ms"
      }
    },
    "scheduler": {
      "status": "healthy",
      "details": {
        "pendingTasks": 45,
        "lastExecutionTime": "2023-08-01T15:30:45Z"
      }
    }
  },
  "version": "1.5.2",
  "uptime": "5d 12h 30m"
}
```

### API Verification

Test the API endpoints:

```bash
# Get workflow definitions
curl -X GET http://service-host:8080/api/v1/workflow-definitions

# Create a workflow instance
curl -X POST http://service-host:8080/api/v1/workflow-instances \
  -H "Content-Type: application/json" \
  -d '{
    "workflowDefinitionId": "order_processing",
    "input": {
      "orderId": "ORD-12345",
      "customerId": "CUST-789"
    }
  }'
```

### Metrics Check

Verify metrics are being collected:

```bash
# Check Prometheus metrics endpoint
curl http://service-host:8081/metrics
```

## Troubleshooting

### Common Issues


1. **Database Connection Failures**:
   * Verify database credentials and connection string
   * Check network connectivity and firewall rules
   * Ensure database server is running and accessible

   ```bash
   # Test database connection
   psql -h db-host -U workflow_user -d workflows -c "SELECT 1"
   ```
2. **Service Won't Start**:
   * Check logs for startup errors
   * Verify configuration file syntax
   * Ensure required environment variables are set

   ```bash
   # View logs
   tail -f /var/log/workflow-orchestrator/service.log
   ```
3. **Event Processing Issues**:
   * Verify Kafka/RabbitMQ connectivity
   * Check consumer group configuration
   * Ensure topics exist and are properly configured

   ```bash
   # List Kafka topics
   kafka-topics.sh --bootstrap-server kafka:9092 --list
   ```

### Log Analysis

Examine logs for errors:

```bash
# Search for ERROR level logs
grep ERROR /var/log/workflow-orchestrator/service.log

# View recent logs
tail -n 100 /var/log/workflow-orchestrator/service.log
```

### Diagnostic Commands

```bash
# Check service status
systemctl status workflow-orchestrator

# View resource usage
top -p $(pgrep -f workflow-orchestrator)

# Check open ports
netstat -tulpn | grep workflow-orchestrator

# View thread dump (if running as Java service)
jstack $(pgrep -f workflow-orchestrator)
```

## Upgrade Procedure

### Standard Upgrade

```bash
# For Docker deployment
docker pull company-registry/workflow-orchestrator:new-version
docker stop workflow-orchestrator
docker rm workflow-orchestrator
# Run new container with same parameters as before but new image

# For Kubernetes deployment
helm upgrade workflow-orchestrator company-charts/workflow-orchestrator \
  --namespace workflow-system \
  --reuse-values \
  --set image.tag=new-version
```

### Rolling Upgrade

For zero-downtime upgrades:

```bash
# Kubernetes rolling update
kubectl set image deployment/workflow-orchestrator \
  workflow-orchestrator=company-registry/workflow-orchestrator:new-version \
  --record

# Verify rollout status
kubectl rollout status deployment/workflow-orchestrator
```

### Rollback Procedure

If issues are encountered:

```bash
# Docker rollback
docker pull company-registry/workflow-orchestrator:previous-version
# Stop and remove current container
# Start container with previous version

# Kubernetes rollback
kubectl rollout undo deployment/workflow-orchestrator

# Helm rollback
helm rollback workflow-orchestrator 1
```

## Monitoring Integration

### Prometheus Integration

```yaml
# prometheus.yaml
scrape_configs:
  - job_name: 'workflow-orchestrator'
    scrape_interval: 15s
    metrics_path: /metrics
    static_configs:
      - targets: ['workflow-orchestrator:8081']
```

### Grafana Dashboard

Import the provided Grafana dashboard for monitoring:

```bash
# Import dashboard
curl -X POST http://grafana:3000/api/dashboards/import \
  -H "Content-Type: application/json" \
  -d @dashboards/workflow-orchestrator.json
```

## Related Documentation

* [Configuration Reference](./operations/configuration.md)
* [Monitoring Guidelines](./operations/monitoring.md)
* [Scaling Considerations](./operations/scaling.md)
* [Database Optimization](./implementation/database_optimization.md)


