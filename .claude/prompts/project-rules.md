# Project Rules for Comp-a-tron

## Project Overview

This is a modern price comparison web application built with Next.js 15, TypeScript, MongoDB, and Socket.io. The project was migrated from Meteor 1.5 to Next.js for better performance and maintainability.

## Technology Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Custom Node.js server with Socket.io
- **Database:** MongoDB (native driver)
- **Authentication:** JWT with bcryptjs
- **Real-time:** Socket.io for WebSocket connections
- **Infrastructure:** Docker & Docker Compose for development

## Docker Setup

This project uses Docker Compose for easy development setup:

- **MongoDB**: Runs in Docker container (port 27017)
- **Mongo Express**: Web-based DB admin UI (port 8081)
- **App**: Can run in Docker or locally (your choice)

### Quick Start
```bash
# Start MongoDB in Docker (recommended)
npm run docker:dev

# Run app locally
npm run dev
```

### Docker Scripts
- `npm run docker:dev` - Start MongoDB only
- `npm run docker:up` - Start all services
- `npm run docker:down` - Stop services
- `npm run docker:logs` - View logs
- `npm run docker:clean` - Remove all containers and data

See [DOCKER.md](../../DOCKER.md) for full documentation.

## Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define interfaces in `lib/types.ts`
- Avoid using `any` type - use proper typing
- Use type inference when possible

### React Components
- Use functional components with hooks
- Follow the pattern: imports → interfaces → component → exports
- Use `'use client'` directive for client components
- Keep components focused and single-purpose

### File Organization
- API routes: `app/api/[feature]/route.ts`
- Pages: `app/[page]/page.tsx`
- Components: `components/[ComponentName].tsx`
- Utilities: `lib/[utility].ts`
- Hooks: `hooks/use[HookName].ts`
- Contexts: `contexts/[Context]Context.tsx`

### Naming Conventions
- Components: PascalCase (`ItemCard.tsx`)
- Utilities: camelCase (`client-auth.ts`)
- Hooks: camelCase with 'use' prefix (`useSocket.ts`)
- Constants: UPPER_SNAKE_CASE
- Interfaces: PascalCase

## Architecture Patterns

### API Routes
- Always validate user authentication with `getUserFromRequest()`
- Return proper HTTP status codes
- Use `NextResponse.json()` for responses
- Emit Socket.io events after data mutations

### Real-time Updates
- Emit events from API routes using `emitToClients()`
- Listen for events in components using `useSocket()` hook
- Event names follow pattern: `[entity]:[action]` (e.g., `item:created`)

### Authentication
- JWT tokens stored in localStorage
- Tokens sent via `Authorization: Bearer [token]` header
- Use `fetchWithAuth()` helper for authenticated requests
- Never expose JWT_SECRET in client code

### Database Operations
- Use `getDatabase()` helper to get MongoDB connection
- Always use ObjectId for MongoDB IDs
- Implement proper error handling for all DB operations
- Use indexes for frequently queried fields

## Security Guidelines

- Always validate user input with Zod or similar
- Check ownership before allowing updates/deletes
- Hash passwords with bcrypt before storing
- Never log sensitive data (passwords, tokens)
- Use environment variables for secrets

## Development Workflow

### Recommended: Docker + Local Dev

1. Start MongoDB in Docker: `npm run docker:dev`
2. Install dependencies: `npm install`
3. Configure `.env.local`:
   ```env
   MONGODB_URI=mongodb://admin:admin123@localhost:27017/comparatron?authSource=admin
   JWT_SECRET=your-secret-key-here
   ```
4. Run development server: `npm run dev`
5. Access Mongo Express: http://localhost:8081
6. Test changes thoroughly before committing

### Alternative: Full Docker Stack

1. Start all services: `npm run docker:up`
2. App runs at: http://localhost:3000
3. View logs: `npm run docker:logs`

### Database Management

- **Mongo Express UI**: http://localhost:8081 (when docker:dev is running)
- **MongoDB Shell**: `docker-compose exec mongodb mongosh`
- **Backup/Restore**: See DOCKER.md for commands

## Testing Checklist

Before committing:
- [ ] TypeScript compiles without errors
- [ ] All authentication flows work
- [ ] Real-time updates function correctly
- [ ] Mobile responsive design works
- [ ] No console errors in browser
- [ ] API routes return proper status codes

## Deployment

- The app uses a custom server (`server.js`) for Socket.io
- Cannot use standard Vercel deployment without Pro plan
- Recommended platforms: Railway, Render, AWS, DigitalOcean
- Set all environment variables in deployment platform
- Use production MongoDB (Atlas) for deployment

## Important Files

- `server.js` - Custom server with Socket.io integration
- `.env.local` - Environment variables (not committed)
- `lib/mongodb.ts` - Database connection
- `lib/auth.ts` - Server-side authentication
- `lib/socket.ts` - Socket.io event emitters
- `contexts/AuthContext.tsx` - Client-side auth state

## Common Tasks

### Adding a new API endpoint
1. Create route file: `app/api/[feature]/route.ts`
2. Import auth and database utilities
3. Implement HTTP methods (GET, POST, etc.)
4. Add authentication check if needed
5. Emit Socket.io events for data changes

### Adding a new component
1. Create file in `components/[Name].tsx`
2. Define props interface
3. Use TypeScript for all props and state
4. Import from `@/` alias for absolute imports
5. Style with Tailwind CSS classes

### Adding real-time features
1. Define event name in `lib/socket.ts`
2. Emit event in API route after mutation
3. Listen for event in component using `useSocket()`
4. Update component state when event received

## Legacy Code

The old Meteor application is in `comp-a-tron-meteor/` for reference only.
Do not modify files in that directory unless specifically instructed.

## Questions or Issues?

- Check `README.md` for setup instructions
- Check `MIGRATION_GUIDE.md` for migration details
- Review existing code for patterns and examples
