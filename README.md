# Comp-a-tron

> A modern price comparison web application built with Next.js 15, TypeScript, MongoDB, and Socket.io.

Compare items and automatically calculate unit prices to find the best deals. Features real-time updates, user authentication, and privacy controls.

## 🚀 Quick Start

```bash
# Start MongoDB in Docker
npm run docker:dev

# Install dependencies
npm install

# Run the application
npm run dev
```

**That's it!** Open http://localhost:3000 to start using the app.

💡 **Tip:** Access the database admin UI at http://localhost:8081

## 📚 Documentation

- **[Getting Started](#getting-started)** - Setup instructions and prerequisites
- **[Docker Guide](./DOCKER.md)** - Complete Docker documentation and troubleshooting
- **[Migration Guide](./MIGRATION_GUIDE.md)** - Understanding the Meteor → Next.js migration
- **[API Reference](#api-endpoints)** - Available endpoints and real-time events
- **[Development Guide](./docs/)** - Documentation index and conventions

## ✨ Features

- 🔐 **User Authentication** - JWT-based secure authentication
- 💰 **Price Comparison** - Automatic unit price calculation
- ⚡ **Real-time Updates** - Live sync across all connected clients
- 🔒 **Privacy Controls** - Public and private item visibility
- 📱 **Responsive Design** - Mobile-friendly interface
- 🎨 **Modern UI** - Built with Tailwind CSS
- 🔍 **Type Safety** - Full TypeScript coverage

## 🛠 Technology Stack

**Frontend**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Socket.io Client

**Backend**
- Next.js API Routes
- MongoDB (native driver)
- Socket.io Server
- JWT Authentication
- Custom Node.js server

**Infrastructure**
- Docker & Docker Compose
- MongoDB 7
- Mongo Express (dev UI)

## 📁 Project Structure

```
comp-a-tron/
├── app/                        # Next.js App Router
│   ├── api/                    # API endpoints (auth, items)
│   ├── dashboard/              # Main app page
│   ├── login/                  # Authentication pages
│   └── register/
├── components/                 # React components
│   ├── ItemCard.tsx
│   ├── ItemForm.tsx
│   └── ItemList.tsx
├── lib/                        # Utilities and helpers
│   ├── auth.ts                 # Authentication logic
│   ├── mongodb.ts              # Database connection
│   ├── socket.ts               # Real-time events
│   └── types.ts                # TypeScript types
├── contexts/                   # React Context providers
│   └── AuthContext.tsx
├── hooks/                      # Custom React hooks
│   └── useSocket.ts
├── comp-a-tron-meteor/        # Archived Meteor app (reference)
├── docs/                       # Documentation
├── server.js                   # Custom server with Socket.io
└── docker-compose.yml          # Docker configuration
```

## 🏁 Getting Started

### Prerequisites

Choose one of the following setups:

**Option A: Docker (Recommended)**
- Docker and Docker Compose installed
- No need for Node.js or MongoDB locally

**Option B: Local Development**
- Node.js 18+ installed
- MongoDB installed or MongoDB Atlas account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kossoy/comp-a-tron.git
   cd comp-a-tron
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy and edit `.env.local`:
   ```env
   # MongoDB (Docker)
   MONGODB_URI=mongodb://admin:admin123@localhost:27017/comparatron?authSource=admin

   # Or for local MongoDB
   # MONGODB_URI=mongodb://localhost:27017/comparatron

   # Security
   JWT_SECRET=your-secret-key-change-this-in-production

   # App URL
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # With Docker (recommended)
   npm run docker:dev

   # Or without Docker
   # macOS: brew services start mongodb-community
   # Linux: sudo systemctl start mongod
   # Windows: net start MongoDB
   ```

5. **Run the application**
   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

Visit http://localhost:3000 to see the app!

## 🐳 Docker Commands

```bash
npm run docker:dev          # Start MongoDB + Mongo Express
npm run docker:dev:stop     # Stop MongoDB
npm run docker:up           # Start full stack (MongoDB + App)
npm run docker:down         # Stop all services
npm run docker:logs         # View container logs
npm run docker:build        # Rebuild and start
npm run docker:clean        # Remove all containers and data
```

📖 **Full Docker guide:** See [DOCKER.md](./DOCKER.md) for detailed instructions and troubleshooting.

## 🎯 Usage

### Register and Login
1. Navigate to http://localhost:3000
2. Click "Get Started" or "Register"
3. Create an account with username and password

### Compare Prices
1. Add items with name, quantity, and total price
2. Unit prices are calculated automatically
3. Items sort by unit price (lowest first)
4. View all public items + your private items

### Manage Items
- **Make Private:** Keep items visible only to you
- **Make Public:** Share items with all users
- **Delete:** Remove your own items
- **Real-time:** See updates instantly when others add/remove items

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/me` | Get current user |

### Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | List all items |
| POST | `/api/items` | Create new item |
| DELETE | `/api/items/[id]` | Delete item |
| PATCH | `/api/items/[id]` | Update privacy |

### Real-time Events (Socket.io)
- `item:created` - New item added
- `item:deleted` - Item removed
- `item:updated` - Item modified

All connected clients receive these events automatically.

## 🚢 Deployment

### Vercel (Frontend)
```bash
vercel deploy
```

**Note:** Socket.io requires a persistent server. Use Vercel Pro or alternative platforms.

### Alternative Platforms
- **Railway** - `railway up`
- **Render** - Connect GitHub repo
- **AWS/DigitalOcean** - Deploy as Node.js app
- **Docker** - Use included `Dockerfile` for production

**Important:** Use MongoDB Atlas (or similar) for production database.

## 🔄 Migration from Meteor

This project is a complete rewrite of the original Meteor 1.5 application.

| Aspect | Meteor (2017) | Next.js (2024) |
|--------|--------------|----------------|
| Framework | Meteor 1.5 | Next.js 15 |
| UI | Blaze Templates | React 19 + TypeScript |
| Styling | Bootstrap 3 | Tailwind CSS 4 |
| Real-time | DDP | Socket.io |
| Auth | Meteor Accounts | Custom JWT |
| Build | Meteor | Turbopack |

📖 **Full migration details:** See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

The old Meteor app is archived in `comp-a-tron-meteor/` for reference.

## 🧪 Development

### Custom Server
This project uses a custom Node.js server (`server.js`) to support Socket.io WebSocket connections.

### Database Collections
- `users` - User accounts and authentication
- `rowItems` - Price comparison items with metadata

### Authentication Flow
1. User registers/logs in
2. Server returns JWT token
3. Client stores token in localStorage
4. Token sent via `Authorization: Bearer` header
5. Server validates token on each request

## 🎨 Code Style

- **TypeScript** for all new code
- **Functional components** with hooks
- **Tailwind CSS** for styling
- **ESLint** for linting
- Follow conventions in [project-rules.md](./.claude/prompts/project-rules.md)

## 🗺️ Roadmap

- [ ] Advanced filtering and sorting
- [ ] Export data to CSV/Excel
- [ ] Price history tracking
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Barcode scanning
- [ ] Category organization
- [ ] Multi-currency support

## 📄 License

MIT

## 🙏 Credits

- **Original Meteor app:** comp-a-tron
- **Modernization:** Claude Code
- **Technologies:** Next.js, React, TypeScript, MongoDB, Socket.io

---

**Need help?** Check the [documentation](./docs/) or [open an issue](https://github.com/kossoy/comp-a-tron/issues).
