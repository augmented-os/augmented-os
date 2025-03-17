# Validation Service Deployment

This document provides guidance on deploying the Validation Service in various environments, from development to production.

## Deployment Options

The Validation Service can be deployed in several ways depending on your infrastructure and requirements.

### Containerized Deployment

The recommended approach for deploying the Validation Service is using containers.

#### Docker

```bash
# Pull the official image
docker pull example.com/validation-service:latest

# Run with basic configuration
docker run -d \
  --name validation-service \
  -p 8080:8080 \
  -v /path/to/config:/app/config \
  -e VALIDATION_SERVICE_SERVER_PORT=8080 \
  -e VALIDATION_SERVICE_DATABASE_HOST=db.example.com \
  example.com/validation-service:latest
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  validation-service:
    image: example.com/validation-service:latest
    ports:
      - "8080:8080"
    volumes:
      - ./config:/app/config
    environment:
      - VALIDATION_SERVICE_SERVER_PORT=8080
      - VALIDATION_SERVICE_DATABASE_TYPE=postgresql
      - VALIDATION_SERVICE_DATABASE_HOST=postgres
      - VALIDATION_SERVICE_DATABASE_PORT=5432
      - VALIDATION_SERVICE_DATABASE_NAME=validation
      - VALIDATION_SERVICE_DATABASE_USER=postgres
      - VALIDATION_SERVICE_DATABASE_PASSWORD=postgres
    depends_on:
      - postgres
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  postgres:
    image: postgres:14
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=validation
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

### Kubernetes Deployment

For production environments, Kubernetes is the recommended deployment platform.

#### Basic Kubernetes Deployment

```yaml
# validation-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: validation-service
  labels:
    app: validation-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: validation-service
  template:
    metadata:
      labels:
        app: validation-service
    spec:
      containers:
      - name: validation-service
        image: example.com/validation-service:latest
        ports:
        - containerPort: 8080
        env:
        - name: VALIDATION_SERVICE_SERVER_PORT
          value: "8080"
        - name: VALIDATION_SERVICE_DATABASE_HOST
          value: "postgres.database.svc.cluster.local"
        - name: VALIDATION_SERVICE_DATABASE_USER
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: username
        - name: VALIDATION_SERVICE_DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: password
        volumeMounts:
        - name: config-volume
          mountPath: /app/config
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health/liveness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/readiness
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 5
      volumes:
      - name: config-volume
        configMap:
          name: validation-service-config
---
apiVersion: v1
kind: Service
metadata:
  name: validation-service
spec:
  selector:
    app: validation-service
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
```

#### ConfigMap for Configuration

```yaml
# validation-service-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: validation-service-config
data:
  validation-service.yaml: |
    validation_service:
      server:
        port: 8080
      schema_registry:
        storage_type: "database"
        cache_size: 1024
      validation_engine:
        max_validators: 50
        validation_timeout: 5s
```

#### Secrets for Sensitive Data

```yaml
# validation-service-secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  username: cG9zdGdyZXM=  # base64 encoded "postgres"
  password: cGFzc3dvcmQ=  # base64 encoded "password"
```

### Helm Chart Deployment

For more complex Kubernetes deployments, a Helm chart is provided.

```bash
# Add the Validation Service Helm repository
helm repo add validation-service https://helm.example.com/charts

# Update the repository
helm repo update

# Install the Validation Service
helm install validation-service validation-service/validation-service \
  --set replicaCount=3 \
  --set database.host=postgres.database.svc.cluster.local \
  --set database.user=postgres \
  --set database.password=password
```

## Deployment Topologies

### Single-Instance Deployment

Suitable for development and testing environments.

```
┌─────────────────┐     ┌─────────────┐
│                 │     │             │
│ Validation      │────▶│ Database    │
│ Service         │     │             │
│                 │     │             │
└─────────────────┘     └─────────────┘
```

### High-Availability Deployment

Recommended for production environments.

```
┌─────────────────┐     ┌─────────────┐
│ Load Balancer   │     │ Database    │
│                 │     │ Primary     │
└───────┬─────────┘     └──────┬──────┘
        │                      │
        ▼                      ▼
┌───────┴─────────┐     ┌──────┴──────┐
│                 │     │             │
│ Validation      │     │ Database    │
│ Service Cluster │────▶│ Replicas    │
│                 │     │             │
└─────────────────┘     └─────────────┘
```

### Microservices Deployment

Integration with other services in a microservices architecture.

```
┌─────────────────┐     ┌─────────────┐     ┌─────────────┐
│                 │     │             │     │             │
│ API Gateway     │────▶│ Validation  │────▶│ Database    │
│                 │     │ Service     │     │             │
└─────────────────┘     └──────┬──────┘     └─────────────┘
                               │
                               ▼
                        ┌──────┴──────┐
                        │             │
                        │ Schema      │
                        │ Registry    │
                        │             │
                        └─────────────┘
```

## Deployment Environments

### Development Environment

For local development and testing.

```bash
# Clone the repository
git clone https://github.com/example/validation-service.git
cd validation-service

# Build the service
./gradlew build

# Run with development configuration
java -jar build/libs/validation-service.jar \
  --spring.config.location=file:./config/application-dev.yaml
```

### Testing Environment

For integration and performance testing.

```bash
# Deploy using Docker Compose
docker-compose -f docker-compose.test.yml up -d

# Run integration tests
./gradlew integrationTest

# Run performance tests
./gradlew performanceTest
```

### Production Environment

Guidelines for production deployment:

1. **Use Kubernetes or similar orchestration**: Ensures high availability and scalability
2. **Implement proper secrets management**: Use Kubernetes Secrets, HashiCorp Vault, or similar
3. **Configure appropriate resource limits**: Prevent resource starvation
4. **Set up monitoring and alerting**: Use Prometheus and Grafana
5. **Implement proper backup strategy**: Regular database backups
6. **Use rolling updates**: Minimize downtime during deployments

## Deployment Checklist

Before deploying to production, ensure:

- [ ] Configuration has been validated
- [ ] Database migrations are ready
- [ ] Security settings are appropriate for the environment
- [ ] Resource limits are set correctly
- [ ] Health checks are configured
- [ ] Monitoring is set up
- [ ] Backup strategy is in place
- [ ] Rollback plan is documented

## Deployment Automation

### CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy Validation Service

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
        
    - name: Build with Gradle
      run: ./gradlew build
      
    - name: Build Docker image
      run: docker build -t validation-service:${{ github.sha }} .
      
    - name: Push to container registry
      run: |
        echo ${{ secrets.REGISTRY_PASSWORD }} | docker login -u ${{ secrets.REGISTRY_USERNAME }} --password-stdin example.com
        docker tag validation-service:${{ github.sha }} example.com/validation-service:${{ github.sha }}
        docker tag validation-service:${{ github.sha }} example.com/validation-service:latest
        docker push example.com/validation-service:${{ github.sha }}
        docker push example.com/validation-service:latest
        
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up kubectl
      uses: azure/setup-kubectl@v3
      
    - name: Set Kubernetes context
      uses: azure/k8s-set-context@v3
      with:
        kubeconfig: ${{ secrets.KUBE_CONFIG }}
        
    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/validation-service validation-service=example.com/validation-service:${{ github.sha }}
        kubectl rollout status deployment/validation-service
```

## Deployment Troubleshooting

### Common Issues

| Issue | Symptoms | Resolution |
|-------|----------|------------|
| Database connection failure | Service fails to start, connection errors in logs | Check database credentials, network connectivity, and database health |
| Insufficient resources | Service crashes, OOM errors | Increase memory/CPU limits, optimize resource usage |
| Configuration errors | Service fails to start, configuration errors in logs | Validate configuration against schema, check environment variables |
| Schema migration failure | Service fails to start, migration errors in logs | Check database schema version, run migrations manually |
| Health check failures | Service restarts repeatedly | Check health check endpoints, adjust probe settings |

### Debugging Techniques

1. **Check logs**: `kubectl logs deployment/validation-service`
2. **Check events**: `kubectl get events`
3. **Check pod status**: `kubectl describe pod validation-service-xyz`
4. **Check configuration**: `kubectl get configmap validation-service-config -o yaml`
5. **Check health endpoints**: `curl http://validation-service/health/detailed`

## Related Documentation

- [Configuration](./configuration.md) - Configuration options
- [Scaling](./scaling.md) - Scaling considerations
- [Monitoring](./monitoring.md) - Monitoring approach 