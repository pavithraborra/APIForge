# APIForge

> **Build. Test. Collaborate.**

APIForge is a collaborative API workspace that enables software development teams to organize, test, manage, document, and collaborate on REST APIs in shared workspaces. Built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO for real-time collaboration.

---

## Live Deployment

- **Live Application:** https://api-forge-itut.vercel.app
- **Backend API:** https://apiforge-backend-62to.onrender.com
- **GitHub Repository:** https://github.com/pavithraborra/APIForge

### Demo Credentials

- **Email:** `sarah.chen@example.com`
- **Password:** `password123`

> **Note:** The backend is hosted on Render's free tier. If the service has been inactive, the first request may take some time while the backend instance starts.

---

## Features

- **Workspace Management** — Create, manage, and collaborate on API workspaces with role-based access control
- **API Builder** — Full-featured API request builder supporting GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS
- **Collections** — Organize APIs into nested, searchable collections with favorites and pins
- **Real-Time Collaboration** — Live updates, online presence, typing indicators, and activity feeds via Socket.IO
- **Environment Variables** — Manage variables across Development, Testing, Staging, and Production environments
- **Request History** — Track and filter executed API requests with status codes and execution times
- **Notifications** — Real-time notification system with read/unread state
- **Role-Based Access** — Owner, Admin, Developer, and Viewer roles with granular permissions
- **Search** — Global search across workspaces, collections, requests, and members
- **Export** — Export workspaces, collections, and history as JSON, PDF, or Markdown
- **Theme Support** — Switch between supported application themes with persistent user preferences

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, React Router, Tailwind CSS, Axios, Socket.IO Client, Recharts |
| Backend | Node.js, Express.js, Mongoose, JWT, bcrypt, Socket.IO |
| Database | MongoDB Atlas |
| DevOps | Docker, Docker Compose |
| Deployment | Vercel (Frontend), Render (Backend), MongoDB Atlas (Database) |

---

## Project Structure

```text
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
│   │   ├── pages/             # Application pages
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
│   │   ├── middleware/        # Authentication, RBAC, error handling
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API route definitions
│   │   ├── seed/              # Database seeder
│   │   ├── sockets/           # Socket.IO handlers
│   │   ├── app.js             # Express application configuration
│   │   └── server.js          # Backend entry point
│   ├── Dockerfile
│   └── .env
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js >= 18
- npm
- MongoDB locally or a MongoDB Atlas cluster
- Git

---

## Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/pavithraborra/APIForge.git
cd APIForge
```

### 2. Setup the Backend

Navigate to the server directory:

```bash
cd server
npm install
```

Create a `server/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/apiforge
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

The application supports MongoDB connection configuration through `MONGODB_URI`.

For MongoDB Atlas, replace the local MongoDB URI with your Atlas connection string.

> Never commit your `.env` file or MongoDB credentials to GitHub.

### 3. Setup the Frontend

Open another terminal and navigate to the client directory:

```bash
cd client
npm install
```

Create a `client/.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 4. Start the Backend

From the `server` directory:

```bash
npm run dev
```

The backend should run at:

```text
http://localhost:5000
```

### 5. Start the Frontend

From the `client` directory:

```bash
npm start
```

The frontend should run at:

```text
http://localhost:3000
```

---

## Demo Account

The seeded database includes demo accounts and sample data for testing and presentation.

### Primary Demo Account

```text
Email: sarah.chen@example.com
Password: password123
```

The demo dataset includes sample users, workspaces, collections, API requests, environments, activities, and other data used to demonstrate APIForge features.

> Demo credentials are intended only for demonstration and portfolio testing.

---

## Seed Data

APIForge includes a database seeder that can populate the database with realistic demonstration data.

From the server directory:

```bash
cd server
npm run seed
```

The seed data includes:

- 20 demo users
- Demo workspaces
- Collections
- Saved API requests
- Environment variables
- Activity data
- Request history and related demonstration data where supported

The production-safe seed implementation only replaces known demo accounts and data associated with their owned demo workspaces. It does not intentionally remove unrelated registered users.

> Before running any database seed operation against production, review the current seed script and ensure your database connection points to the intended MongoDB database.

---

## Docker

Run the complete local stack using Docker Compose:

```bash
docker compose up --build
```

This starts:

- **Frontend:** `http://localhost:3000`
- **Backend:** `http://localhost:5000`
- **MongoDB:** Port `27017`

To stop the containers:

```bash
docker compose down
```

To stop the containers and remove Docker volumes:

```bash
docker compose down -v
```

> Be careful when removing volumes, as locally stored Docker database data may be deleted.

---

## Deployment

APIForge uses separate hosting services for the frontend, backend, and database.

### Frontend — Vercel

**Production URL:**

```text
https://api-forge-itut.vercel.app
```

Deployment configuration:

1. Connect the GitHub repository to Vercel.
2. Set the Root Directory to:

```text
client
```

3. Set the Build Command to:

```bash
npm run build
```

4. Set the Output Directory to:

```text
build
```

5. Set the Install Command to:

```bash
npm install
```

6. Add the following environment variables:

```env
REACT_APP_API_URL=https://apiforge-backend-62to.onrender.com/api
REACT_APP_SOCKET_URL=https://apiforge-backend-62to.onrender.com
```

After updating environment variables, redeploy the frontend so they are included in the production build.

---

### Backend — Render

**Production URL:**

```text
https://apiforge-backend-62to.onrender.com
```

Deployment configuration:

1. Create a Web Service on Render.
2. Connect the APIForge GitHub repository.
3. Set the Root Directory to:

```text
server
```

4. Set the Build Command to:

```bash
npm install
```

5. Set the Start Command to:

```bash
npm start
```

6. Configure the following environment variables:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://api-forge-itut.vercel.app
NODE_ENV=production
```

The backend automatically uses the port provided by the hosting environment.

> The production backend may be hosted on a free instance. If the service has been inactive, the first request can take additional time while the instance starts.

---

### Database — MongoDB Atlas

APIForge uses MongoDB Atlas for the production database.

Setup:

1. Create a MongoDB Atlas project.
2. Create a cluster.
3. Create a database user with an appropriate username and password.
4. Configure the project's Network Access / IP Access List.
5. Copy the MongoDB Atlas connection string.
6. Add it to Render as:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
```

For cloud deployment, configure network access according to your security requirements.

> Avoid exposing MongoDB credentials in source code, README files, screenshots, or GitHub commits.

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Backend server port | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration period | Yes |
| `CLIENT_URL` | Frontend URL allowed by CORS | Yes |
| `NODE_ENV` | Application environment | No |

### Client (`client/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | Backend API base URL | Yes |
| `REACT_APP_SOCKET_URL` | Socket.IO backend URL | Yes |

### Production Client Configuration

```env
REACT_APP_API_URL=https://apiforge-backend-62to.onrender.com/api
REACT_APP_SOCKET_URL=https://apiforge-backend-62to.onrender.com
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current authenticated user |
| PUT | `/api/auth/profile` | Update user profile |
| PUT | `/api/auth/change-password` | Change password |

### Workspaces

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workspaces` | List user's workspaces |
| POST | `/api/workspaces` | Create a workspace |
| GET | `/api/workspaces/:id` | Get workspace details |
| PUT | `/api/workspaces/:id` | Update a workspace |
| DELETE | `/api/workspaces/:id` | Delete a workspace |
| POST | `/api/workspaces/:id/invite` | Invite a workspace member |

### Collections

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/collections/workspace/:id` | List workspace collections |
| POST | `/api/collections` | Create a collection |
| PUT | `/api/collections/:id` | Update a collection |
| DELETE | `/api/collections/:id` | Delete a collection |

### Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/requests/collection/:id` | List requests in a collection |
| POST | `/api/requests` | Create a request |
| POST | `/api/requests/:id/execute` | Execute a saved request |
| POST | `/api/requests/:id/duplicate` | Duplicate a request |

---

## Production Architecture

```text
                    ┌───────────────────────┐
                    │        User           │
                    │     Web Browser       │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │        Vercel         │
                    │    React Frontend     │
                    │ api-forge-itut        │
                    └───────────┬───────────┘
                                │
                                │ REST API / Socket.IO
                                ▼
                    ┌───────────────────────┐
                    │        Render         │
                    │ Node.js + Express API │
                    │   Socket.IO Server    │
                    └───────────┬───────────┘
                                │
                                │ Mongoose
                                ▼
                    ┌───────────────────────┐
                    │    MongoDB Atlas      │
                    │ Production Database   │
                    └───────────────────────┘
```

---

## Testing the API Builder

You can test APIForge using a public REST API.

Example GET request:

```text
GET https://jsonplaceholder.typicode.com/posts/1
```

Expected status:

```text
200 OK
```

Example POST request:

```text
POST https://jsonplaceholder.typicode.com/posts
```

Example JSON body:

```json
{
  "title": "APIForge Test",
  "body": "Testing POST request from APIForge",
  "userId": 1
}
```

Expected status:

```text
201 Created
```

---

## Design System

APIForge uses a **Warm Peach** visual design system.

- **Primary:** `#E78F81`
- **Background:** `#FFF8F3`
- **Cards:** White with subtle shadows
- **Typography:** Poppins for headings and Inter for body text
- **Animations:** Subtle micro-interactions and smooth transitions
- **Themes:** Theme preferences can be changed through application settings and persisted across sessions

---

## Production Status

The production deployment consists of:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas
- **Source Code:** GitHub

### Links

- Live Application: https://api-forge-itut.vercel.app
- Backend API: https://apiforge-backend-62to.onrender.com
- GitHub Repository: https://github.com/pavithraborra/APIForge

---

## Security Notes

- Passwords are hashed before being stored in the database.
- Authentication uses JSON Web Tokens (JWT).
- Protected API routes require authentication.
- CORS is configured to allow the production frontend and supported development environments.
- Environment variables are used for sensitive configuration.
- MongoDB credentials and JWT secrets should never be committed to GitHub.
- Production secrets should be managed through Vercel and Render environment settings.

---

## License

This project is part of a professional software engineering portfolio.

© 2026 Pavithra Borra. All Rights Reserved.