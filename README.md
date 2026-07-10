# APIForge

> **Build. Test. Collaborate.**

APIForge is a collaborative API workspace that enables software development teams to organize, test, manage, document, and collaborate on REST APIs in shared workspaces. Built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO for real-time collaboration.

---

## Features

- **Workspace Management** — Create, manage, and collaborate on API workspaces with role-based access control
- **API Builder** — Full-featured API request builder supporting GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
- **Collections** — Organize APIs into nested, searchable collections with favorites and pins
- **Real-Time Collaboration** — Live updates, online presence, typing indicators, and activity feeds via Socket.IO
- **Environment Variables** — Manage variables across Development, Testing, and Production environments
- **Request History** — Track and filter all executed API requests
- **Notifications** — Real-time notification system with read/unread state
- **Role-Based Access** — Owner, Admin, Developer, and Viewer roles with granular permissions
- **Search** — Global search across workspaces, collections, requests, and members
- **Export** — Export workspaces, collections, and history as JSON, PDF, or Markdown

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router, Tailwind CSS, Axios, Socket.IO Client, Recharts |
| Backend | Node.js, Express.js, Mongoose, JWT, bcrypt, Socket.IO |
| Database | MongoDB |
| DevOps | Docker, Docker Compose |
| Deployment | Vercel (Frontend), Render (Backend), MongoDB Atlas (Database) |

---

## Project Structure

```
APIForge/
├── client/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/            # Logo, icons, illustrations
│   │   ├── components/
│   │   │   ├── layout/        # Sidebar, Navbar, Footer, Layout
│   │   │   ├── onboarding/    # Welcome wizard
│   │   │   └── ui/            # Reusable UI components
│   │   ├── context/           # Auth, Socket, Workspace, Toast providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # All application pages
│   │   │   ├── auth/          # Login, Register, ForgotPassword
│   │   │   ├── errors/        # 404, 403, 500
│   │   │   └── workspaces/    # Workspace pages
│   │   ├── services/          # API service layer (Axios)
│   │   └── App.jsx            # Root component with routing
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── Dockerfile
│   └── .env
├── server/                    # Express backend
│   ├── src/
│   │   ├── config/            # Database connection
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth, RBAC, error handling
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API route definitions
│   │   ├── seed/              # Database seeder
│   │   ├── sockets/           # Socket.IO handlers
│   │   ├── app.js             # Express app configuration
│   │   └── server.js          # Entry point
│   ├── Dockerfile
│   └── .env
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/APIForge.git
   cd APIForge
   ```

2. **Setup the backend**
   ```bash
   cd server
   npm install
   ```

   Create `server/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/apiforge
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:3000
   NODE_ENV=development
   ```

3. **Setup the frontend**
   ```bash
   cd ../client
   npm install
   ```

   Create `client/.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

4. **Start development servers**

   Backend:
   ```bash
   cd server
   npm run dev
   ```

   Frontend (in a new terminal):
   ```bash
   cd client
   npm start
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Seed Data (Optional)

Populate the database with realistic demo data for presentation:

```bash
cd server
npm run seed       # Populate with demo data
npm run unseed     # Remove all data
```

The seed script generates:
- 15–20 users with realistic names
- 8–10 workspaces
- 25–40 collections
- 200–300 API requests
- 100+ activity logs
- Notifications, environment variables, and request history
- Timestamps distributed over the last 6 months

> **Note:** The application works perfectly with an empty database. Seeding is entirely optional.

---

## Docker

Run the complete stack with a single command:

```bash
docker compose up --build
```

This starts:
- **Frontend** on [http://localhost:3000](http://localhost:3000)
- **Backend** on [http://localhost:5000](http://localhost:5000)
- **MongoDB** on port 27017

To stop:
```bash
docker compose down
```

To stop and remove data:
```bash
docker compose down -v
```

---

## Deployment

### Frontend → Vercel

1. Connect your GitHub repository to Vercel
2. Set the root directory to `client`
3. Set the build command to `npm run build`
4. Set the output directory to `build`
5. Add environment variables:
   - `REACT_APP_API_URL` = your backend URL
   - `REACT_APP_SOCKET_URL` = your backend URL

### Backend → Render

1. Create a new Web Service on Render
2. Set the root directory to `server`
3. Set the build command to `npm install`
4. Set the start command to `npm start`
5. Add environment variables:
   - `PORT` = 5000
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = a secure random string
   - `JWT_EXPIRES_IN` = 7d
   - `CLIENT_URL` = your Vercel frontend URL
   - `NODE_ENV` = production

### Database → MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a database user
3. Whitelist your IP addresses (or use 0.0.0.0/0 for development)
4. Copy the connection string and set it as `MONGO_URI`

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | Yes |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_EXPIRES_IN` | Token expiration | Yes |
| `CLIENT_URL` | Frontend URL for CORS | Yes |
| `NODE_ENV` | Environment mode | No |

### Client (`client/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | Backend API base URL | Yes |
| `REACT_APP_SOCKET_URL` | Socket.IO server URL | Yes |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/change-password` | Change password |

### Workspaces
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workspaces` | List user's workspaces |
| POST | `/api/workspaces` | Create workspace |
| GET | `/api/workspaces/:id` | Get workspace |
| PUT | `/api/workspaces/:id` | Update workspace |
| DELETE | `/api/workspaces/:id` | Delete workspace |
| POST | `/api/workspaces/:id/invite` | Invite member |

### Collections
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/collections/workspace/:id` | List collections |
| POST | `/api/collections` | Create collection |
| PUT | `/api/collections/:id` | Update collection |
| DELETE | `/api/collections/:id` | Delete collection |

### Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/requests/collection/:id` | List requests |
| POST | `/api/requests` | Create request |
| POST | `/api/requests/:id/execute` | Execute request |
| POST | `/api/requests/:id/duplicate` | Duplicate request |

---

## Design System

APIForge uses the **Warm Peach** design system:

- **Primary:** #E78F81
- **Background:** #FFF8F3
- **Cards:** #FFFFFF with subtle shadows
- **Typography:** Poppins (headings) + Inter (body)
- **Animations:** Subtle micro-interactions, skeleton loading, smooth transitions

---

## License

This project is part of a professional software engineering portfolio.

© 2026 Pavithra Borra. All Rights Reserved.
