# PostNet

PostNet is a full-stack social networking and content sharing platform. It features user authentication, post creation, commenting, and user profiles.

## Technologies Used

### Frontend
- **React 19** with **Vite**
- React Router DOM for routing
- ESLint for code formatting

### Backend
- **Node.js** with **Express**
- **Redis** for efficient caching or session management
- **JWT (JSON Web Tokens)** & **bcrypt** for secure authentication
- **cookie-parser** & **cors** for handling cross-origin requests and cookies

## Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/)
- [Redis](https://redis.io/) (If running locally, ensure the Redis server is up and running)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository_url>
cd PostNet
```

### 2. Backend Setup

Navigate to the `backend` directory, install dependencies, and start the development server.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with your environment variables (e.g., Database URI, JWT Secret, Redis connection details, etc.).

Start the backend server:

```bash
npm run dev
```

The backend server runs on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal, navigate to the `frontend` directory, install dependencies, and start the Vite development server.

```bash
cd frontend
npm install
npm run dev
```

The frontend application runs on `http://localhost:5173`.

## Features
- **User Authentication**: Secure signup and login with hashed passwords and token-based state (JWT stored in cookies).
- **Post Management**: Create, view, and interact with user posts.
- **Comments**: Engage on posts by leaving comments.
- **Profile Dashboard**: User-specific dashboard protected by authentication middleware.

## License
[ISC](LICENSE)
