# Event Processing Service Deployment Guide

## Overview

This document provides comprehensive guidance for deploying the Event Processing Service in various environments. It covers prerequisites, deployment options, configuration, and post-deployment verification steps.

## Prerequisites

Before deploying the Event Processing Service, ensure the following prerequisites are met:

### System Requirements

| Component | Minimum | Recommended |
|----|----|----|
| CPU | 2 cores | 4+ cores |
| Memory | 4 GB | 8+ GB |
| Disk Space | 20 GB | 50+ GB |
| Operating System | Linux (Ubuntu 20.04+, RHEL 8+), macOS 11+ | Linux (Ubuntu 22.04, RHEL 9) |
| Node.js | v16.x | v18.x or v20.x |
| Database | PostgreSQL 12+ | PostgreSQL 14+ |
| Network | 100 Mbps | 1 Gbps |

### Dependencies

* **Database**: PostgreSQL 12+ with appropriate user permissions
* **Message Broker** (optional): RabbitMQ 3.8+ or Kafka 2.8+ for distributed deployments
* **Monitoring**: Prometheus and Grafana for metrics collection and visualization
* **Logging**: ELK Stack or similar for centralized logging
* **Service Mesh** (optional): Istio or similar for advanced networking features

### Security Prerequisites

* SSL/TLS certificates for secure communication
* Authentication credentials (API keys, OAuth tokens, etc.)
* Network security groups and firewall rules
* Service account with appropriate permissions

## Deployment Options

### Docker Deployment

#### Docker Compose (Development/Testing)


1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-org/event-processing-service.git
   cd event-processing-service
   ```
2. **Configure environment variables**:

   ```bash
   cp .env.example .env
   # Edit .env file with appropriate values
   ```
3. **Start the service with Docker Compose**:

   ```bash
   docker-compose up -d
   ```
4. **Verify deployment**:

   ```bash
   curl http://localhost:3000/health
   ```

#### Docker Compose Configuration

Example `docker-compose.yml`:

```yaml
version: '3.8'

services:
  event-service:
    image: your-org/event-processing-service:latest
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - EPS_NODE_ENV=production
      - EPS_DB_HOST=postgres
      - EPS_DB_PORT=5432
      - EPS_DB_NAME=event_service
      - EPS_DB_USER=postgres
      - EPS_DB_PASSWORD=postgres
    depends_on:
      - postgres
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s
    restart: unless-stopped
    volumes:
      - ./config:/app/config
      - ./logs:/app/logs

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=event_service
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres-data:
```

### Kubernetes Deployment

#### Prerequisites

* Kubernetes cluster (v1.22+)
* kubectl configured to access the cluster
* Helm (v3.8+) for package management

#### Deployment Steps


1. **Add Helm repository**:

   ```bash
   helm repo add your-org https://helm.your-org.com
   helm repo update
   ```
2. **Create namespace**:

   ```bash
   kubectl create namespace event-service
   ```
3. **Create configuration**:

   ```bash
   kubectl create configmap event-service-config \
     --from-file=config/production.yaml \
     --namespace event-service
   ```
4. **Create secrets**:

   ```bash
   kubectl create secret generic event-service-secrets \
     --from-literal=db-password=your-password \
     --from-literal=auth-secret=your-auth-secret \
     --namespace event-service
   ```
5. **Deploy with Helm**:

   ```bash
   helm install event-service your-org/event-processing-service \
     --namespace event-service \
     --set image.tag=latest \
     --set replicas.eventReceiver=3 \
     --set replicas.eventRouter=2 \
     --set replicas.eventProcessor=3 \
     --values custom-values.yaml
   ```
6. **Verify deployment**:

   ```bash
   kubectl get pods -n event-service
   kubectl port-forward svc/event-service 3000:3000 -n event-service
   curl http://localhost:3000/health
   ```

#### Kubernetes Manifests

Example Kubernetes deployment manifest:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: event-receiver
  namespace: event-service
  labels:
    app: event-service
    component: event-receiver
spec:
  replicas: 3
  selector:
    matchLabels:
      app: event-service
      component: event-receiver
  template:
    metadata:
      labels:
        app: event-service
        component: event-receiver
    spec:
      containers:
      - name: event-receiver
        image: your-org/event-processing-service:latest
        args: ["--component=event-receiver"]
        ports:
        - containerPort: 3000
        env:
        - name: EPS_NODE_ENV
          value: "production"
        - name: EPS_DB_HOST
          value: "postgres.database"
        - name: EPS_DB_PORT
          value: "5432"
        - name: EPS_DB_NAME
          value: "event_service"
        - name: EPS_DB_USER
          value: "event_service_user"
        - name: EPS_DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: event-service-secrets
              key: db-password
        resources:
          requests:
            cpu: "500m"
            memory: "512Mi"
          limits:
            cpu: "1000m"
            memory: "1Gi"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        volumeMounts:
        - name: config-volume
          mountPath: /app/config
        - name: logs-volume
          mountPath: /app/logs
      volumes:
      - name: config-volume
        configMap:
          name: event-service-config
      - name: logs-volume
        emptyDir: {}
```

Example service manifest:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: event-receiver
  namespace: event-service
  labels:
    app: event-service
    component: event-receiver
spec:
  selector:
    app: event-service
    component: event-receiver
  ports:
  - port: 3000
    targetPort: 3000
    protocol: TCP
    name: http
  type: ClusterIP
```

### Serverless Deployment

For event-driven architectures with variable load, consider serverless deployment options:

#### AWS Lambda Deployment


1. **Package the application**:

   ```bash
   npm run build:lambda
   ```
2. **Deploy with AWS CDK or CloudFormation**:

   ```bash
   cdk deploy EventProcessingServiceStack
   ```

Example AWS CDK stack:

```typescript
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class EventProcessingServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC for the service
    const vpc = new ec2.Vpc(this, 'EventServiceVPC', {
      maxAzs: 2
    });

    // Database for event storage
    const database = new rds.DatabaseInstance(this, 'EventServiceDatabase', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_14
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.MEDIUM
      ),
      vpc,
      databaseName: 'event_service',
      credentials: rds.Credentials.fromGeneratedSecret('postgres')
    });

    // Lambda function for event processing
    const eventProcessorFunction = new lambda.Function(this, 'EventProcessorFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'dist/lambda.handler',
      code: lambda.Code.fromAsset('dist'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
      environment: {
        EPS_NODE_ENV: 'production',
        EPS_DB_HOST: database.dbInstanceEndpointAddress,
        EPS_DB_PORT: database.dbInstanceEndpointPort,
        EPS_DB_NAME: 'event_service'
      },
      vpc
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'EventServiceApi', {
      restApiName: 'Event Processing Service API',
      description: 'API for the Event Processing Service'
    });

    const eventsResource = api.root.addResource('events');
    eventsResource.addMethod('POST', new apigateway.LambdaIntegration(eventProcessorFunction));
    
    // Grant database access to Lambda
    database.grantConnect(eventProcessorFunction);
  }
}
```

## Configuration Management

### Environment-Specific Configuration

Create environment-specific configuration files:

* `config/development.yaml` - Development environment
* `config/testing.yaml` - Testing environment
* `config/staging.yaml` - Staging environment
* `config/production.yaml` - Production environment

### Secrets Management

For production deployments, use a secrets management solution:

#### AWS Secrets Manager

```typescript
// Load secrets from AWS Secrets Manager
import { SecretsManager } from 'aws-sdk';

const secretsManager = new SecretsManager();
const secretData = await secretsManager.getSecretValue({
  SecretId: 'event-service/production'
}).promise();

const secrets = JSON.parse(secretData.SecretString);
```

#### HashiCorp Vault

```typescript
// Load secrets from HashiCorp Vault
import * as vault from 'node-vault';

const vaultClient = vault({
  apiVersion: 'v1',
  endpoint: process.env.VAULT_ADDR
});

await vaultClient.approleLogin({
  role_id: process.env.VAULT_ROLE_ID,
  secret_id: process.env.VAULT_SECRET_ID
});

const secrets = await vaultClient.read('secret/event-service/production');
```

## Database Setup

### Schema Initialization

Initialize the database schema:

```bash
# Run database migrations
npm run db:migrate

# Seed initial data (if needed)
npm run db:seed
```

### Database Migrations

For schema updates, use migrations:

```bash
# Create a new migration
npm run db:migration:create -- --name add-event-status-column

# Apply pending migrations
npm run db:migrate
```

## Post-Deployment Verification

### Health Check

Verify the service is healthy:

```bash
curl http://your-service-url/health
```

Expected response:

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2023-06-01T12:00:00Z",
  "components": {
    "event_receiver": "healthy",
    "event_router": "healthy",
    "event_processor": "healthy",
    "event_store": "healthy",
    "database": "healthy"
  }
}
```

### Functional Verification

Test basic functionality:

```bash
# Publish a test event
curl -X POST http://your-service-url/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "type": "test.event",
    "source": "deployment-verification",
    "data": {
      "message": "Deployment verification"
    }
  }'
```

### Performance Verification

Run basic performance tests:

```bash
# Install artillery
npm install -g artillery

# Run performance test
artillery run performance-tests/basic-load.yml
```

## Monitoring Setup

### Prometheus Configuration

Example Prometheus scrape configuration:

```yaml
scrape_configs:
  - job_name: 'event-processing-service'
    scrape_interval: 15s
    metrics_path: '/metrics'
    static_configs:
      - targets: ['event-service:3000']
```

### Grafana Dashboard

Import the Event Processing Service dashboard:


1. Navigate to Grafana
2. Go to Dashboards > Import
3. Upload the dashboard JSON from `monitoring/grafana-dashboards/event-service-dashboard.json`
4. Select the Prometheus data source
5. Click Import

## Deployment Automation

### CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy Event Processing Service

on:
  push:
    branches: [ main ]
    paths:
      - 'src/**'
      - 'config/**'
      - '.github/workflows/deploy.yml'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Build Docker image
      run: |
        docker build -t your-org/event-processing-service:${{ github.sha }} .
        docker tag your-org/event-processing-service:${{ github.sha }} your-org/event-processing-service:latest
    
    - name: Log in to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Push Docker image
      run: |
        docker push your-org/event-processing-service:${{ github.sha }}
        docker push your-org/event-processing-service:latest
    
    - name: Deploy to Kubernetes
      uses: steebchen/kubectl@v2
      with:
        config: ${{ secrets.KUBE_CONFIG_DATA }}
        command: set image deployment/event-receiver event-receiver=your-org/event-processing-service:${{ github.sha }} -n event-service
    
    - name: Verify deployment
      uses: steebchen/kubectl@v2
      with:
        config: ${{ secrets.KUBE_CONFIG_DATA }}
        command: rollout status deployment/event-receiver -n event-service
```

## Rollback Procedures

### Docker Rollback

```bash
# Pull the previous version
docker pull your-org/event-processing-service:previous-tag

# Stop the current container
docker stop event-service

# Start the previous version
docker run -d --name event-service \
  -p 3000:3000 \
  --env-file .env \
  your-org/event-processing-service:previous-tag
```

### Kubernetes Rollback

```bash
# Rollback to the previous deployment
kubectl rollout undo deployment/event-receiver -n event-service

# Verify rollback
kubectl rollout status deployment/event-receiver -n event-service
```

## Deployment Checklist

Use this checklist for production deployments:

- [ ] Database migrations tested in staging environment
- [ ] Configuration validated for production environment
- [ ] Secrets properly managed and secured
- [ ] Resource requirements calculated and provisioned
- [ ] Monitoring and alerting configured
- [ ] Backup and recovery procedures tested
- [ ] Load testing completed
- [ ] Security scan performed
- [ ] Documentation updated
- [ ] Rollback plan prepared

## Related Documentation

* [Configuration Guide](./configuration.md)
* [Monitoring Guide](./monitoring.md)
* [Scaling Guide](./scaling.md)
* [Troubleshooting Guide](./troubleshooting.md)
* [Event Router Implementation](../implementation/event_router.md)


