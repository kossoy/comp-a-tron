# Docker Setup Guide

This document explains how to use Docker and Docker Compose with Comp-a-tron.

## Prerequisites

- Docker installed and running
- Docker Compose installed (usually comes with Docker Desktop)

## Quick Start

### Option 1: Docker for MongoDB Only (Recommended for Development)

Run MongoDB in Docker, but run the Next.js app locally for faster development:

```bash
# Start MongoDB and Mongo Express
docker-compose -f docker-compose.dev.yml up -d

# Install dependencies (if not already done)
npm install

# Run the Next.js app locally
npm run dev
```

**Access:**
- Application: http://localhost:3000
- MongoDB: mongodb://admin:admin123@localhost:27017/comparatron?authSource=admin
- Mongo Express (Web UI): http://localhost:8081

### Option 2: Full Docker Stack

Run everything in Docker (MongoDB + Next.js app):

```bash
# Build and start all services
docker-compose up -d

# Or rebuild if you made changes
docker-compose up -d --build
```

**Access:**
- Application: http://localhost:3000
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

### Next.js App (Port 3000)
- Built from local Dockerfile
- Hot reload enabled in development
- Connects to MongoDB container

## Common Commands

```bash
# Start services in background
docker-compose up -d

# Start only MongoDB (dev setup)
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f mongodb
docker-compose logs -f app

# Stop services
docker-compose down

# Stop and remove volumes (deletes database!)
docker-compose down -v

# Rebuild services
docker-compose up -d --build

# Check service status
docker-compose ps

# Execute commands in running container
docker-compose exec mongodb mongosh
docker-compose exec app sh
```

## Environment Variables

### For Local Development with Docker MongoDB

Update `.env.local`:
```env
MONGODB_URI=mongodb://admin:admin123@localhost:27017/comparatron?authSource=admin
JWT_SECRET=your-secret-key-here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### For Full Docker Stack

The `docker-compose.yml` handles environment variables automatically. You can customize them by:

1. Copy `.env.docker` to `.env`:
   ```bash
   cp .env.docker .env
   ```

2. Edit `.env` with your values

3. Restart services:
   ```bash
   docker-compose down && docker-compose up -d
   ```

## Development Workflows

### Workflow 1: Local Dev + Docker MongoDB (Fastest)

Best for rapid development with hot reload:

```bash
# Terminal 1: Start MongoDB
docker-compose -f docker-compose.dev.yml up

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
docker-compose up

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

1. Start services: `docker-compose up -d`
2. Open browser: http://localhost:8081
3. Select database: `comparatron`
4. View collections: `users`, `rowItems`

### Using MongoDB Shell

```bash
# Connect to MongoDB container
docker-compose exec mongodb mongosh

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
docker-compose exec mongodb mongodump --username admin --password admin123 --authenticationDatabase admin --db comparatron --out /data/backup

# Copy backup to host
docker cp comparatron-mongodb:/data/backup ./backup

# Restore
docker-compose exec mongodb mongorestore --username admin --password admin123 --authenticationDatabase admin --db comparatron /data/backup/comparatron
```

## Troubleshooting

### MongoDB Connection Issues

**Problem:** Can't connect to MongoDB

**Solutions:**
1. Check if MongoDB container is running:
   ```bash
   docker-compose ps
   ```

2. Check MongoDB logs:
   ```bash
   docker-compose logs mongodb
   ```

3. Verify connection string in `.env.local`:
   ```env
   MONGODB_URI=mongodb://admin:admin123@localhost:27017/comparatron?authSource=admin
   ```

4. Restart services:
   ```bash
   docker-compose restart mongodb
   ```

### Port Already in Use

**Problem:** Port 3000/27017/8081 already in use

**Solutions:**
1. Stop conflicting services
2. Change ports in `docker-compose.yml`:
   ```yaml
   ports:
     - "3001:3000"  # Map host 3001 to container 3000
   ```

### Container Won't Start

**Problem:** Service fails to start

**Solutions:**
1. Check logs:
   ```bash
   docker-compose logs [service-name]
   ```

2. Remove and rebuild:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

3. Remove volumes (WARNING: deletes data):
   ```bash
   docker-compose down -v
   docker-compose up
   ```

### Can't Access Mongo Express

**Problem:** Mongo Express not loading

**Solutions:**
1. Wait for MongoDB to be healthy:
   ```bash
   docker-compose ps
   ```
   Status should show "healthy"

2. Check logs:
   ```bash
   docker-compose logs mongo-express
   ```

3. Restart:
   ```bash
   docker-compose restart mongo-express
   ```

## Production Considerations

**Important:** The current Docker setup is for **development only**. For production:

1. **Use environment variables** instead of hardcoded credentials
2. **Enable authentication** in Mongo Express
3. **Use secrets management** for JWT_SECRET
4. **Enable MongoDB authentication** properly
5. **Use HTTPS/TLS** for MongoDB connections
6. **Remove Mongo Express** (dev tool only)
7. **Set NODE_ENV=production**
8. **Use production MongoDB** (MongoDB Atlas recommended)
9. **Implement proper logging** and monitoring
10. **Use Docker volumes** with backup strategy

## Cleanup

### Remove All Services and Data

```bash
# Stop and remove containers, networks, volumes
docker-compose down -v

# Also remove images
docker-compose down -v --rmi all
```

### Keep Data, Remove Containers

```bash
# Stop and remove containers only
docker-compose down
```

Data persists in Docker volumes and will be restored on next `docker-compose up`.

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)

## Scripts

Add these to `package.json` for convenience:

```json
{
  "scripts": {
    "docker:dev": "docker-compose -f docker-compose.dev.yml up -d",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f",
    "docker:build": "docker-compose up -d --build"
  }
}
```

Then use:
```bash
npm run docker:dev   # Start MongoDB only
npm run docker:up    # Start all services
npm run docker:down  # Stop services
npm run docker:logs  # View logs
```
