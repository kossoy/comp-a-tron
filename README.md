# Comp-a-tron (Next.js Edition)

A modern price comparison web application built with Next.js 15, TypeScript, MongoDB, and Socket.io. Compare items and automatically calculate unit prices to find the best deals.

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Socket.io Client** - Real-time updates

### Backend
- **Next.js API Routes** - Backend API
- **MongoDB** - Database
- **Socket.io** - Real-time WebSocket communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Features

- ✅ **User Authentication** - Register and login with JWT tokens
- ✅ **Price Comparison** - Automatically calculate unit prices
- ✅ **Real-time Updates** - Live updates using Socket.io
- ✅ **Privacy Controls** - Mark items as private or public
- ✅ **Responsive Design** - Mobile-friendly Tailwind UI
- ✅ **TypeScript** - Full type safety across the stack

## Project Structure

```
comp-a-tron/                 # Root directory (Next.js app)
├── app/                     # Next.js app directory
│   ├── api/                # API routes
│   ├── dashboard/          # Dashboard page
│   ├── login/              # Login page
│   └── register/           # Register page
├── components/              # React components
├── contexts/                # React contexts
├── docker/                  # Docker configuration
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   └── Dockerfile
├── docs/                    # Documentation
│   ├── README.md
│   ├── DOCKER.md
│   └── MIGRATION_GUIDE.md
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities and shared code
├── public/                  # Static assets
├── comp-a-tron-meteor/      # Old Meteor app (archived)
├── server.js                # Custom server with Socket.io
├── .env                     # Docker Compose environment variables
├── .env.local               # Local development environment variables
└── package.json
```

## Getting Started

### Prerequisites

**Choose one of the following:**

**Option A: Docker (Recommended)**
- Docker and Docker Compose installed
- No need to install Node.js or MongoDB locally

**Option B: Local Development**
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account

### Quick Start with Docker (Recommended)

The easiest way to get started is using Docker Compose:

```bash
# 1. Start MongoDB in Docker
npm run docker:dev

# 2. Install dependencies
npm install

# 3. Run the app locally
npm run dev
```

That's it! The app runs at http://localhost:9000, and MongoDB runs in Docker.

**Bonus:** Access Mongo Express (DB admin UI) at http://localhost:8081

📖 **Full Docker documentation:** See [docs/DOCKER.md](./docs/DOCKER.md) for detailed instructions.

### Manual Installation (Without Docker)

1. Clone/navigate to the project directory:
```bash
cd comp-a-tron
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Copy `.env.example` to `.env` and update if needed:
```bash
cp .env.example .env
```

The default configuration in `.env` is ready to use with Docker.

For `.env.local`:
```env
MONGODB_URI=mongodb://admin:admin123@localhost:27017/comparatron?authSource=admin
JWT_SECRET=your-secret-key-change-this-in-production
PORT=9000
NEXT_PUBLIC_API_URL=http://localhost:9000
```

4. Start MongoDB:

**With Docker (recommended):**
```bash
npm run docker:dev
```

**Without Docker:**
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Running the Application

**Development mode:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm start
```

The application will be available at: http://localhost:9000

## Usage

1. **Register an Account**
   - Navigate to http://localhost:9000
   - Click "Get Started" or "Register"
   - Create an account with a username and password

2. **Add Items**
   - Fill in the item name, quantity, and total price
   - The unit price is calculated automatically
   - Click "Add Item" to save

3. **Compare Prices**
   - Items are automatically sorted by unit price (lowest first)
   - View all public items and your private items

4. **Manage Items**
   - Toggle items between private and public
   - Delete your own items
   - See real-time updates when other users add/remove items

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current user info

### Items

- `GET /api/items` - List all items (public + user's private)
- `POST /api/items` - Create a new item
- `DELETE /api/items/[id]` - Delete an item
- `PATCH /api/items/[id]` - Update item privacy

## Real-time Features

The application uses Socket.io for real-time updates:

- **item:created** - Broadcast when a new item is added
- **item:deleted** - Broadcast when an item is deleted
- **item:updated** - Broadcast when an item is updated

All connected clients receive these events and update their UI automatically.

## Migration from Meteor

This is a complete rewrite of the original Meteor application. Key improvements:

| Feature | Meteor 1.5 | Next.js 15 |
|---------|-----------|------------|
| Framework | Meteor | Next.js |
| Frontend | Blaze Templates | React + TypeScript |
| Styling | Bootstrap 3 | Tailwind CSS |
| Build Tool | Meteor Build | Next.js (Turbopack) |
| Real-time | DDP | Socket.io |
| Auth | Meteor Accounts | Custom JWT |
| Deployment | Galaxy, Heroku | Vercel, Any Node.js host |

## Deployment

### Vercel (Recommended for Frontend)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

**Note:** Socket.io requires a persistent server, so you may need to use Vercel's Pro plan or deploy to another platform like Railway, Render, or AWS.

### Alternative Platforms

- **Railway** - `railway up`
- **Render** - Connect GitHub repo
- **AWS/DigitalOcean** - Deploy as Node.js app
- **Heroku** - `git push heroku main`

## Development Notes

### Custom Server

This project uses a custom server (`server.js`) instead of the default Next.js server to support Socket.io. This is necessary for WebSocket connections.

### Authentication

JWT tokens are stored in localStorage and sent with every API request via the `Authorization` header.

### Database

MongoDB collections:
- `users` - User accounts
- `rowItems` - Price comparison items

## Future Enhancements

- [ ] Add sorting/filtering options
- [ ] Export data to CSV/Excel
- [ ] Price history tracking
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Barcode scanning
- [ ] Category tags

## License

MIT

## Credits

- Original Meteor app: comp-a-tron
- Modernized by: Claude Code
- Built with: Next.js, React, TypeScript, MongoDB, Socket.io
