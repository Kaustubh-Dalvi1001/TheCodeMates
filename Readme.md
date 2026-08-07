# TheCodeMates

A full-stack social networking platform built for developers to connect with each other — create a profile, discover other developers, and send, review, and manage connection requests. Built end-to-end with the MERN stack.

**Status:** Core platform complete (auth, profiles, feed, connections) and actively developed. Real-time chat is planned — see [Roadmap](#roadmap).

## Tech Stack

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT authentication (HTTP-only cookies)
- bcrypt for password hashing
- Custom validation layer (backed by the `validator` library)

**Frontend**
- React 19 (Vite)
- Redux Toolkit — global client state (auth/user status, connections, feed, requests)
- TanStack Query v5 — server state, caching, and mutations
- React Hook Form — form state and validation
- React Router v7
- Tailwind CSS v4 + DaisyUI — styling and UI components
- Axios — API client (`withCredentials` for cookie-based auth)
- React Toastify — notifications
- Lucide React — icons

## Features

- **Authentication** — signup, login, and logout with JWT stored in an HTTP-only cookie; passwords hashed with bcrypt
- **Profile management** — view and update profile details (name, age, gender, bio, technical skills, other skills, hobbies), plus a dedicated password-change flow
- **Developer feed** — paginated feed of other developers to discover, excluding users you've already sent/received a request to or from
- **Connections**
  - Send a connection request (`interested`) or pass (`ignored`) on a profile
  - Review incoming requests — accept or reject
  - Cancel a request you've already sent
  - View your accepted connections, and your sent and received requests separately
- **Account deletion** — users can permanently delete their own account

## Project Structure

```
TheCodeMates/
├── TheCodeMatesBackend/       # Express + MongoDB API
│   └── src/
│       ├── config/            # Database connection
│       ├── middlewares/       # JWT auth middleware
│       ├── models/            # Mongoose schemas (User, ConnectionRequest)
│       ├── routes/            # API route handlers
│       └── utils/             # Request validation helpers
└── TheCodeMatesFrontend/      # React (Vite) client
    └── src/
        ├── components/        # Page and UI components
        └── store/              # Redux slices (user, feed, connections, requests)
```

## Getting Started

### Prerequisites
- Node.js and npm installed
- A MongoDB instance (local or MongoDB Atlas)

### Backend Setup

```bash
cd TheCodeMatesBackend
npm install
cp .env.example .env
```

Fill in `.env` with your own values:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=1001
```

Run the server:
```bash
npm run dev
```

### Frontend Setup

```bash
cd TheCodeMatesFrontend
npm install
npm run dev
```

The frontend expects the backend running on `http://localhost:1001` and itself runs on `http://localhost:5173` (CORS is pre-configured for this pairing).

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/userSignUp` | Register a new user |
| POST | `/userLogin` | Log in and receive a JWT cookie |
| POST | `/userLogout` | Log out the current user |
| DELETE | `/deleteUser` | Delete the current user's account |
| GET | `/userProfile` | Get the logged-in user's profile |
| PATCH | `/updateUserProfile` | Update profile details |
| PATCH | `/updateUserPassword` | Update password |
| GET | `/feed` | Get a paginated feed of other developers (`?page=&limit=`) |
| POST | `/request/send/:status/:receiverId` | Send (`interested`) or pass (`ignored`) on a connection request |
| POST | `/request/review/:status/:requestId` | Accept or reject a received request |
| POST | `/cancelRequest/:reqId` | Cancel a connection request you sent |
| GET | `/receivedConnectionRequest` | View pending received requests |
| GET | `/getSentConnectionRequests` | View requests you've sent |
| GET | `/myConnections` | View accepted connections |

## Roadmap

- Real-time chat between connected users
- Additional planned improvements TBD as the project evolves

## Author

Kaustubh Dalvi