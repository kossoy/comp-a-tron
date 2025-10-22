# Docker Setup Guide

This document explains how to use Docker and Docker Compose with Comp-a-tron.

## Prerequisites

- Docker installed and running
- Docker Compose installed (usually comes with Docker Desktop)

## Quick Start

### Option 1: Docker for MongoDB Only (Recommended for Development)

Run MongoDB in Docker, but run the Next.js app locally for faster development:

```bash
# Start MongoDB and Mongo Express using npm script
npm run docker:dev

# Or use docker-compose directly
docker-compose -f docker/docker-compose.dev.yml up -d

# Install dependencies (if not already done)
npm install

# Run the Next.js app locally
npm run dev
```

**Access:**
- Application: http://localhost:9000
- MongoDB: mongodb://admin:admin123@localhost:27017/comparatron?authSource=admin
- Mongo Express (Web UI): http://localhost:8081

### Option 2: Full Docker Stack

Run everything in Docker (MongoDB + Next.js app):

```bash
# Build and start all services using npm script
npm run docker:up

# Or use docker-compose directly
docker-compose -f docker/docker-compose.yml up -d

# Rebuild if you made changes
npm run docker:build
# Or: docker-compose -f docker/docker-compose.yml up -d --build
```

**Access:**
- Application: http://localhost:9000
- MongoDB: mongodb://admin:admin123@localhost:27017/comparatron?authSource=admin
- Mongo Express (Web UI): http://localhost:8081

## Available Services

### MongoDB (Port 27017)
- Image: `mongo:7`
- Database: `comparatron`
- Username: `admin`
- Password: `admin123`

### Mongo Express (Port 8081)
- Web-based MongoDB admin interface
- No authentication required in development
- Great for viewing/editing database contents

### Next.js App (Port 9000)
- Built from docker/Dockerfile
- Hot reload enabled in development
- Connects to MongoDB container
- Port configured via .env file (PORT=9000)

## Common Commands

Using npm scripts (recommended):

```bash
# Start only MongoDB (dev setup)
npm run docker:dev

# Stop MongoDB dev setup
npm run docker:dev:stop

# Start all services
npm run docker:up

# Stop services
npm run docker:down

# View logs
npm run docker:logs

# Rebuild services
npm run docker:build

# Stop and remove volumes (deletes database!)
npm run docker:clean
```

Using docker-compose directly:

```bash
# Start services in background
docker-compose -f docker/docker-compose.yml up -d

# Start only MongoDB (dev setup)
docker-compose -f docker/docker-compose.dev.yml up -d

# View logs
docker-compose -f docker/docker-compose.yml logs -f

# View logs for specific service
docker-compose -f docker/docker-compose.yml logs -f mongodb
docker-compose -f docker/docker-compose.yml logs -f app

# Stop services
docker-compose -f docker/docker-compose.yml down

# Stop and remove volumes (deletes database!)
docker-compose -f docker/docker-compose.yml down -v

# Rebuild services
docker-compose -f docker/docker-compose.yml up -d --build

# Check service status
docker-compose -f docker/docker-compose.yml ps

# Execute commands in running container
docker-compose -f docker/docker-compose.yml exec mongodb mongosh
docker-compose -f docker/docker-compose.yml exec app sh
```

## Environment Variables

### Docker Compose Environment Variables

Docker Compose uses the `.env` file in the project root for configuration. A template is provided in `.env.example`.

**Setup:**
```bash
# Copy the example file
cp .env.example .env

# Edit if needed (default values work out of the box)
nano .env
```

**Default .env variables:**
```env
# MongoDB Configuration
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=admin123
MONGO_INITDB_DATABASE=comparatron

# Application Configuration
PORT=9000
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/comparatron?authSource=admin
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:9000
```

**IMPORTANT:** All values in `docker/docker-compose.yml` now reference these .env variables using `${VARIABLE_NAME}` syntax.

### For Local Development with Docker MongoDB

Update `.env.local` for running the app locally (outside Docker):
```env
MONGODB_URI=mongodb://admin:admin123@localhost:27017/comparatron?authSource=admin
JWT_SECRET=your-secret-key-here
PORT=9000
NEXT_PUBLIC_API_URL=http://localhost:9000
```

### Restart After Changes

```bash
# Using npm scripts
npm run docker:down
npm run docker:up

# Or using docker-compose directly
docker-compose -f docker/docker-compose.yml down
docker-compose -f docker/docker-compose.yml up -d
```

## Development Workflows

### Workflow 1: Local Dev + Docker MongoDB (Fastest)

Best for rapid development with hot reload:

```bash
# Terminal 1: Start MongoDB
npm run docker:dev
# Or: docker-compose -f docker/docker-compose.dev.yml up

# Terminal 2: Run Next.js app
npm run dev
```

**Pros:**
- Fastest hot reload
- Easy debugging
- Direct access to logs

**Cons:**
- Need Node.js installed locally

### Workflow 2: Full Docker (Most Consistent)

Best for ensuring consistency across team:

```bash
# Start everything
npm run docker:up
# Or: docker-compose -f docker/docker-compose.yml up

# Code changes trigger rebuild (with volume mounts)
```

**Pros:**
- Consistent environment
- No local Node.js needed
- Matches production setup

**Cons:**
- Slower hot reload
- More resource intensive

## Database Management

### Using Mongo Express (Web UI)

1. Start services: `npm run docker:dev` or `npm run docker:up`
2. Open browser: http://localhost:8081
3. Select database: `comparatron`
4. View collections: `users`, `rowItems`

### Using MongoDB Shell

```bash
# Connect to MongoDB container
docker-compose -f docker/docker-compose.yml exec mongodb mongosh
# Or with dev setup: docker-compose -f docker/docker-compose.dev.yml exec mongodb mongosh

# Authenticate
use admin
db.auth("admin", "admin123")

# Switch to app database
use comparatron

# View collections
show collections

# Query users
db.users.find().pretty()

# Query items
db.rowItems.find().pretty()

# Exit
exit
```

### Backup Database

```bash
# Backup
docker-compose -f docker/docker-compose.yml exec mongodb mongodump --username admin --password admin123 --authenticationDatabase admin --db comparatron --out /data/backup

# Copy backup to host
docker cp comparatron-mongodb:/data/backup ./backup

# Restore
docker-compose -f docker/docker-compose.yml exec mongodb mongorestore --username admin --password admin123 --authenticationDatabase admin --db comparatron /data/backup/comparatron
```

## Troubleshooting

### MongoDB Connection Issues

**Problem:** Can't connect to MongoDB

**Solutions:**
1. Check if MongoDB container is running:
   ```bash
   docker-compose -f docker/docker-compose.yml ps
   # Or for dev: docker-compose -f docker/docker-compose.dev.yml ps
   ```

2. Check MongoDB logs:
   ```bash
   npm run docker:logs
   # Or: docker-compose -f docker/docker-compose.yml logs mongodb
   ```

3. Verify connection string in `.env.local`:
   ```env
   MONGODB_URI=mongodb://admin:admin123@localhost:27017/comparatron?authSource=admin
   PORT=9000
   ```

4. Restart services:
   ```bash
   npm run docker:down
   npm run docker:up
   ```

### Port Already in Use

**Problem:** Port 9000/27017/8081 already in use

**Solutions:**
1. Stop conflicting services
2. Change ports in `.env` file:
   ```env
   PORT=9001  # Change to a different port
   ```
3. Or modify ports in `docker/docker-compose.yml`:
   ```yaml
   ports:
     - "9001:9000"  # Map host 9001 to container 9000
   ```

### Container Won't Start

**Problem:** Service fails to start

**Solutions:**
1. Check logs:
   ```bash
   npm run docker:logs
   # Or: docker-compose -f docker/docker-compose.yml logs [service-name]
   ```

2. Remove and rebuild:
   ```bash
   npm run docker:down
   npm run docker:build
   ```

3. Remove volumes (WARNING: deletes data):
   ```bash
   npm run docker:clean
   npm run docker:up
   ```

### Can't Access Mongo Express

**Problem:** Mongo Express not loading

**Solutions:**
1. Wait for MongoDB to be healthy:
   ```bash
   docker-compose -f docker/docker-compose.yml ps
   # Or: docker-compose -f docker/docker-compose.dev.yml ps
   ```
   Status should show "healthy"

2. Check logs:
   ```bash
   npm run docker:logs
   # Or: docker-compose -f docker/docker-compose.yml logs mongo-express
   ```

3. Restart:
   ```bash
   npm run docker:down
   npm run docker:up
   ```

## Production Considerations

**Important:** The current Docker setup is for **development only**. For production:

1. **Secure the .env file** - Never commit it to version control
2. **Use strong passwords** - Change default MongoDB credentials
3. **Enable authentication** in Mongo Express or remove it entirely
4. **Use secrets management** for JWT_SECRET (AWS Secrets Manager, etc.)
5. **Enable MongoDB authentication** properly with strong passwords
6. **Use HTTPS/TLS** for MongoDB connections
7. **Remove Mongo Express** (dev tool only, security risk in production)
8. **Set NODE_ENV=production** in .env
9. **Use production MongoDB** (MongoDB Atlas recommended)
10. **Implement proper logging** and monitoring
11. **Use Docker volumes** with backup strategy
12. **Review docker/docker-compose.yml** and remove development-specific configurations

## Cleanup

### Remove All Services and Data

```bash
# Using npm scripts (recommended)
npm run docker:clean  # Removes containers, networks, and volumes

# Using docker-compose directly
docker-compose -f docker/docker-compose.yml down -v

# Also remove images
docker-compose -f docker/docker-compose.yml down -v --rmi all
```

### Keep Data, Remove Containers

```bash
# Using npm scripts
npm run docker:down

# Using docker-compose directly
docker-compose -f docker/docker-compose.yml down
```

Data persists in Docker volumes and will be restored on next startup.

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)

## NPM Scripts

The project includes convenient npm scripts in `package.json` for Docker operations:

```json
{
  "scripts": {
    "docker:dev": "docker-compose -f docker/docker-compose.dev.yml up -d",
    "docker:dev:stop": "docker-compose -f docker/docker-compose.dev.yml down",
    "docker:up": "docker-compose -f docker/docker-compose.yml up -d",
    "docker:down": "docker-compose -f docker/docker-compose.yml down",
    "docker:logs": "docker-compose -f docker/docker-compose.yml logs -f",
    "docker:build": "docker-compose -f docker/docker-compose.yml up -d --build",
    "docker:clean": "docker-compose -f docker/docker-compose.yml down -v"
  }
}
```

Usage:
```bash
npm run docker:dev       # Start MongoDB only (recommended for development)
npm run docker:dev:stop  # Stop MongoDB dev setup
npm run docker:up        # Start all services (MongoDB + App)
npm run docker:down      # Stop all services
npm run docker:logs      # View logs
npm run docker:build     # Rebuild and start all services
npm run docker:clean     # Stop and remove all data (WARNING: deletes database)
```
