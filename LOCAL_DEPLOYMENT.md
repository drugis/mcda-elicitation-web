# Local Deployment Guide for MCDA Elicitation Web

This guide provides step-by-step instructions for setting up and running the MCDA elicitation web application locally using Docker Compose.

## Prerequisites

- Docker and Docker Compose installed
- Git
- Basic understanding of command line operations

## Architecture Overview

The local deployment consists of five Docker containers:
1. **mcda-postgres**: PostgreSQL 9.6 database for MCDA and Patavi data
2. **mcda-rabbitmq**: RabbitMQ message broker for task queuing
3. **patavi-server**: REST API server for SMAA calculations
4. **patavi-worker**: R-based worker that performs SMAA computations
5. **mcda-web**: Node.js/Express web application (main interface)

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/drugis/mcda-elicitation-web.git
cd mcda-elicitation-web
```

### 2. Configure Environment Variables

Create or verify the `.env` file in the project root with the following content:

```properties
# PostgreSQL Configuration
POSTGRES_USER=mcda_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=mcda

# Authentication Mode
AUTH_MODE=LOCAL

# Google OAuth (dummy values for LOCAL mode)
MCDAWEB_GOOGLE_KEY=dummy-google-key
MCDAWEB_GOOGLE_SECRET=dummy-google-secret
MCDAWEB_COOKIE_SECRET=local-dev-cookie-secret-change-in-production

# Patavi API Key
PATAVI_API_KEY=devkey
```

**Note**: The `.env` file is used by Docker Compose to inject environment variables into the containers.

### 3. Verify Docker Compose Configuration

The `docker-compose.yml` file should contain proper configuration for all services. Key points:

- PostgreSQL version: `postgres:9.6` (required for compatibility with patavi-server)
- Patavi server database password: `${POSTGRES_PASSWORD}`
- Certificate volumes mounted for HTTPS communication between services
- Network connectivity between all services

## Database Initialization

### 4. Start Database Container

```bash
docker-compose up -d db
```

Wait a few seconds for PostgreSQL to initialize.

### 5. Initialize MCDA Database Schema

```bash
docker exec mcda-postgres psql -U mcda_user -d mcda -f /docker-entrypoint-initdb.d/database.pg.sql
```

Or if the SQL file isn't in the container, run from host:

```bash
docker exec -i mcda-postgres psql -U mcda_user -d mcda < database.pg.sql
```

### 6. Create Patavi Database

```bash
docker exec mcda-postgres psql -U mcda_user -d postgres -c "CREATE DATABASE patavi OWNER mcda_user;"
```

### 7. Initialize Patavi Schema

```bash
curl -s https://raw.githubusercontent.com/drugis/patavi/master/server/schema.sql | \
docker exec -i mcda-postgres psql -U mcda_user -d patavi
```

### 8. Create Admin User

Generate a bcrypt password hash and insert the admin user:

```bash
# Build the mcda-web image first
docker-compose build mcda-web

# Generate password hash for "test" (or your preferred password)
HASH=$(docker run --rm mcda-web:local node -e "const bcrypt = require('bcrypt'); bcrypt.hash('test', 10, (err, hash) => { console.log(hash); process.exit(0); });")

# Insert admin user
docker exec mcda-postgres psql -U mcda_user -d mcda -c \
"INSERT INTO Account (username, firstName, lastName, password) VALUES ('admin', 'Admin', 'User', '$HASH');"
```

**Default credentials**: 
- Username: `admin`
- Password: `test` (or whatever you used when generating the hash)

## Building and Starting Services

### 9. Build All Images

```bash
docker-compose build
```

This will build:
- `mcda-web:local` - The web application
- `patavi-smaa-worker:local` - The R worker for SMAA calculations

### 10. Start All Services

```bash
docker-compose up -d
```

### 11. Verify Services Are Running

```bash
docker-compose ps
```

All services should show as "Up" or "running".

### 12. Check Logs for Issues

```bash
# Check mcda-web logs
docker logs mcda-web

# Check patavi-server logs
docker logs patavi-server

# Check patavi-worker logs
docker logs patavi-worker
```

**Expected warnings**:
- mcda-web may show a startup diagnostic error about Patavi connection (401). This is normal and can be ignored - the actual application requests will work.
- patavi-server will show `Listening on https:undefined` due to a URL construction bug in the image (this is worked around in the code).

## Accessing the Application

### 13. Open the Application

Navigate to: `http://localhost:3000`

Login with:
- Username: `admin`
- Password: `test` (or your chosen password)

## Troubleshooting

### Common Issues

#### 1. PostgreSQL Authentication Errors
**Error**: "password authentication failed for user mcda_user"

**Solution**: Verify `PATAVI_DB_PASSWORD=${POSTGRES_PASSWORD}` in docker-compose.yml.

#### 2. Patavi Worker Errors: "object 'smaa_v2' not found"
**Error**: R worker can't find the `smaa_v2` function

**Solution**: This was fixed by removing the line `RUN rm /tmp/apiEntryPoint.R` from `R/Dockerfile`. Rebuild the worker:
```bash
docker-compose build patavi-worker
docker-compose up -d --force-recreate patavi-worker
```

#### 3. Certificate Errors
**Error**: "error:0480006C:PEM routines::no start line"

**Solution**: Certificate files must be UTF-8 encoded without BOM. If you regenerate certificates, ensure proper encoding:
```bash
file ca-crt.pem  # Should show "PEM certificate"
```

#### 4. 500 Error When Using Scales Feature
This indicates a Patavi integration issue. Check:

1. Patavi database exists and has correct schema
2. Patavi server can connect to database (check password)
3. R worker is running and has `smaa_v2` function loaded
4. RabbitMQ is accessible from both patavi-server and patavi-worker

View detailed logs:
```bash
docker logs mcda-web 2>&1 | grep -A 5 "error\|Error"
docker logs patavi-worker 2>&1 | tail -20
```

## Stopping the Application

### Stop All Services
```bash
docker-compose down
```

### Stop and Remove Volumes (Complete Reset)
```bash
docker-compose down -v
```

**Warning**: This will delete all data including the database!

## Development Workflow

### Making Changes to Code

After making changes to the code:

1. **For mcda-web changes**:
```bash
docker-compose build mcda-web
docker-compose up -d --force-recreate mcda-web
```

2. **For R worker changes**:
```bash
docker-compose build patavi-worker
docker-compose up -d --force-recreate patavi-worker
```

### Viewing Real-Time Logs

```bash
docker-compose logs -f mcda-web
```

## Key Configuration Files

- **`.env`**: Environment variables for all services
- **`docker-compose.yml`**: Docker Compose service definitions
- **`database.pg.sql`**: MCDA database schema
- **`R/Dockerfile`**: R worker image definition
- **`node-backend/patavi.ts`**: Patavi integration code (includes URL fix workaround)

## Known Issues and Workarounds

### Patavi Server URL Bug
The official `addis/patavi-server:latest` image has a bug where it constructs URLs as `https:undefined` instead of proper URLs. This is worked around in the code (`node-backend/patavi.ts`) by detecting and fixing malformed URLs before use.

### Startup Diagnostic Failures
The startup diagnostics check Patavi connectivity but don't use client certificates, so they fail with a 401 error. The actual application requests DO use certificates and work correctly. The warning can be ignored.

## Security Notes

### For Production Deployment

⚠️ **This local deployment is for development only!** For production:

1. Change all default passwords in `.env`
2. Use proper Google OAuth instead of LOCAL authentication
3. Enable proper SSL/TLS certificates
4. Use PostgreSQL 16 or latest stable version (requires patavi-server updates)
5. Set proper `MCDAWEB_COOKIE_SECRET`
6. Review all security settings in `docker-compose.yml`

## Additional Resources

- [Main README](README.md)
- [Patavi Repository](https://github.com/drugis/patavi)
- [MCDA Project on drugis.org](https://drugis.org)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review logs: `docker-compose logs`
3. Open an issue on [GitHub](https://github.com/drugis/mcda-elicitation-web/issues)
