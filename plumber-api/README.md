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

### Main SMAA Endpoint (canonical)
```bash
POST /smaa_v2
Content-Type: application/json

{
  "method": "scales",
  "criteria": {...},
  "alternatives": {...},
  "performanceTable": [...]
}
```

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
docker run -p 8000:8000 mcda-plumber-api  # maps container port 8000 to host (useful for local debug)
```

### With Docker Compose
The Plumber API is integrated into the main `docker-compose.yml` file. Note: in the default compose file Plumber is configured as an internal-only service (not exposed on the host) and is reachable by other containers at `http://plumber-api:8000`.

If you need to call Plumber directly from your host for debugging, either run the container with `-p 8000:8000` as shown above, or use a temporary container on the compose network to make requests without exposing the port:

```bash
# from the project root, run a temporary curl container on the compose network
docker run --rm --network $(basename $(pwd))_default curlimages/curl:latest \
  curl -sS -D - http://plumber-api:8000/health
```

## Testing

```bash
# Health check (if you run the container with -p 8000:8000)
# curl http://localhost:8000/health

# Or use the compose-network debug container shown earlier to call Plumber without exposing the port:
docker run --rm --network $(basename $(pwd))_default curlimages/curl:latest \
  curl -X POST http://plumber-api:8000/smaa_v2 \
  -H "Content-Type: application/json" \
  -d @test-request.json
```

## Benefits Over Patavi

1. **Simple**: One container vs three (patavi-server, patavi-worker, rabbitmq)
2. **Direct**: Synchronous HTTP calls, no message queues
3. **Debuggable**: Standard HTTP logs, no distributed tracing needed
4. **Reliable**: No connection pools, no websockets, no complex state management
5. **Modern**: Uses current R and Plumber versions
6. **Self-documenting**: Built-in Swagger UI at `http://localhost:8000/__docs__/` (available if you run Plumber with -p 8000:8000 or access it from a container on the compose network)
