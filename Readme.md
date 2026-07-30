# TheCodeMates

A full-stack social networking platform for developers to connect, built with the MERN stack. Users can create profiles, discover other developers, and send/manage connection requests.

**Status:** Backend complete. Frontend in progress.

## Tech Stack

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication (cookie-based)
- bcrypt for password hashing

**Frontend**
- React (Vite)

## Features

- User signup, login, and logout with JWT-based authentication
- Password hashing and secure credential handling with bcrypt
- User profile view and update, including password change
- Developer feed to discover other users
- Send and review connection requests (accept/reject)
- View received requests and existing connections

## Project Structure

```
TheCodeMates/
├── TheCodeMatesBackend/    # Express + MongoDB API
│   └── src/
│       ├── config/         # Database connection
│       ├── middlewares/    # Auth middleware
│       ├── models/         # Mongoose schemas
│       ├── routes/         # API routes
│       └── utils/          # Validation helpers
└── TheCodeMatesFrontend/   # React (Vite) client
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
| GET | `/feed` | Get a feed of other developers |
| POST | `/request/send/:status/:receiverId` | Send or ignore a connection request |
| POST | `/request/review/:status/:requestId` | Accept or reject a received request |
| GET | `/receivedConnectionRequest` | View pending received requests |
| GET | `/myConnections` | View accepted connections |

## Author

Kaustubh Dalvi