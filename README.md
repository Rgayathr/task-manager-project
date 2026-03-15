# TaskFlow - Task Management Application

A production-ready full-stack task management application with JWT authentication, CRUD operations, pagination, search, filtering, and AES encryption.

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React 18, Vite, Tailwind CSS v4
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JWT stored in HTTP-only cookies
- **Encryption**: AES (crypto-js) for sensitive fields
- **Validation**: express-validator

## 📁 Project Structure

```
task-manager/
├── backend/
│   ├── config/db.js           # MongoDB connection
│   ├── controllers/           # Route handlers
│   ├── middleware/             # Auth & error middleware
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API route definitions
│   ├── utils/                 # Encryption & validation
│   ├── server.js              # Express app entry
│   └── .env                   # Environment variables
├── frontend/
│   ├── src/
│   │   ├── api/axios.js       # HTTP client config
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React Context (auth)
│   │   ├── pages/             # Page components
│   │   └── App.jsx            # Root component
│   └── .env                   # Frontend env vars
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (free tier)

### 1. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/task-manager.git
cd task-manager

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**backend/.env:**
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
AES_SECRET=your_32_char_aes_key_here!!!!
NODE_ENV=development
```

**frontend/.env:**
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the Application

```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173`

## 📡 API Documentation

### Auth Endpoints

#### POST /api/auth/register
```json
// Request
{ "name": "John", "email": "john@example.com", "password": "pass123" }

// Response (201)
{ "success": true, "user": { "id": "...", "name": "John", "email": "john@example.com" } }
// Sets HTTP-only cookie: token=<jwt>
```

#### POST /api/auth/login
```json
// Request
{ "email": "john@example.com", "password": "pass123" }

// Response (200)
{ "success": true, "user": { "id": "...", "name": "John", "email": "john@example.com" } }
```

#### POST /api/auth/logout
```json
// Response (200)
{ "success": true, "message": "Logged out successfully" }
```

#### GET /api/auth/me (Protected)
```json
// Response (200) - includes AES encrypted email
{ "success": true, "user": { "id": "...", "name": "John", "email": "john@example.com", "encryptedEmail": "U2FsdGVk..." } }
```

### Task Endpoints (All Protected)

#### GET /api/tasks?page=1&limit=10&status=pending&search=meeting
```json
// Response (200)
{
  "success": true,
  "count": 3,
  "pagination": { "page": 1, "limit": 10, "total": 3, "pages": 1 },
  "tasks": [{ "_id": "...", "title": "...", "status": "pending", "createdAt": "..." }]
}
```

#### POST /api/tasks
```json
// Request
{ "title": "Complete report", "description": "Q4 sales report", "status": "pending" }

// Response (201)
{ "success": true, "task": { "_id": "...", "title": "Complete report", ... } }
```

#### PUT /api/tasks/:id
```json
// Request
{ "status": "completed" }

// Response (200)
{ "success": true, "task": { ... } }
```

#### DELETE /api/tasks/:id
```json
// Response (200)
{ "success": true, "message": "Task deleted successfully" }
```

## 🔒 Security Features

- JWT stored in HTTP-only cookies (XSS protection)
- Bcrypt password hashing with salt rounds
- CORS configured with credentials
- Input validation and sanitization (express-validator)
- AES encryption for sensitive response fields
- SameSite cookie flag (CSRF protection)
- Proper HTTP status codes throughout

## 🌐 Deployment

- **Backend**: Deployed on Render
- **Frontend**: Deployed on Vercel
- **Live URL**: [your-deployed-url]
