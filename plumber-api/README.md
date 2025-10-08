# MCDA Plumber API

This is a simple REST API replacement for the complex Patavi architecture (patavi-server + patavi-worker + RabbitMQ).

## Architecture Comparison

### Old (Patavi)
```
mcda-web → patavi-server (Node.js) → RabbitMQ → patavi-worker (Java/Clojure + R)
                ↓
          PostgreSQL (task storage)
                ↓
          WebSocket updates
```

### New (Plumber)
```
mcda-web → plumber-api (R with REST endpoints)
```

## API Endpoints

### Health Check
```bash
GET /health
```

Returns:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-08 16:30:00",
  "version": "1.0.0-plumber"
}
```

### Main SMAA Endpoint
```bash
POST /smaa
Content-Type: application/json

{
  "method": "scales",
  "criteria": {...},
  "alternatives": {...},
  "performanceTable": [...]
}
```

Returns calculation results directly (synchronous).

### Legacy Endpoint (Patavi-compatible)
```bash
POST /task?service=smaa_v2
Content-Type: application/json

{
  "method": "smaa",
  ...
}
```

Returns results in the same format as the old Patavi system for backwards compatibility.

## Supported Methods

- `choiceBasedMatching`
- `deterministic`
- `indifferenceCurve`
- `matchingElicitationCurve`
- `representativeWeights`
- `scales`
- `sensitivityMeasurements`
- `sensitivityMeasurementsPlot`
- `sensitivityWeightPlot`
- `smaa`

## Building and Running

### Standalone
```bash
cd plumber-api
docker build -t mcda-plumber-api .
docker run -p 8000:8000 mcda-plumber-api
```

### With Docker Compose
The Plumber API is integrated into the main docker-compose.yml file.

## Testing

```bash
# Health check
curl http://localhost:8000/health

# Test scales calculation
curl -X POST http://localhost:8000/smaa \
  -H "Content-Type: application/json" \
  -d @test-request.json
```

## Benefits Over Patavi

1. **Simple**: One container vs three (patavi-server, patavi-worker, rabbitmq)
2. **Direct**: Synchronous HTTP calls, no message queues
3. **Debuggable**: Standard HTTP logs, no distributed tracing needed
4. **Reliable**: No connection pools, no websockets, no complex state management
5. **Modern**: Uses current R and Plumber versions
6. **Self-documenting**: Built-in Swagger UI at http://localhost:8000/__docs__/
