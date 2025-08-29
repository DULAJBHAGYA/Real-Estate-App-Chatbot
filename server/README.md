# Real Estate Chatbot Backend Server

A Node.js backend server with JWT authentication for the Real Estate Chatbot application.

## Features

- 🔐 **JWT Authentication** - Secure login, register, and logout
- 🛡️ **Password Hashing** - Bcrypt password encryption
- ✅ **Input Validation** - Express-validator for request validation
- 🔒 **Route Protection** - Middleware for protected routes
- 🗄️ **MySQL Integration** - Sequelize ORM for database operations
- 🔄 **Token Refresh** - Automatic token refresh mechanism
- 📝 **API Documentation** - Comprehensive API endpoints

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Bcrypt
- **Validation**: Express-validator
- **Security**: Helmet, CORS

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.js          # MySQL connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── userController.js    # User management
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── validation.js        # Request validation
│   ├── models/
│   │   └── User.js              # User model schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   └── user.js              # User routes
│   ├── utils/
│   │   └── jwt.js               # JWT utilities
│   └── server.js                # Main server file
├── package.json
├── env.example                  # Environment variables template
└── README.md
```

## Installation

1. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Set up MySQL database**
   ```sql
   CREATE DATABASE real_estate_chatbot;
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your MySQL configuration
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/logout` | Logout user | Private |
| POST | `/api/auth/refresh` | Refresh access token | Public |
| GET | `/api/auth/me` | Get current user | Private |

### User Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| PUT | `/api/user/profile` | Update user profile | Private |
| DELETE | `/api/user/account` | Delete user account | Private |

### Health Check

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/health` | Server health check | Public |

## Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=real_estate_chatbot
DB_USER=root
DB_PASSWORD=dulaj1998

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRE=30d

# Client Configuration
CLIENT_URL=http://localhost:3000

# Security
BCRYPT_SALT_ROUNDS=12
```

## API Usage Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Password123",
    "phone": "+1234567890"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Database Schema

The server automatically creates the following table:

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('user', 'admin') DEFAULT 'user',
  isActive BOOLEAN DEFAULT true,
  lastLogin DATETIME,
  emailVerified BOOLEAN DEFAULT false,
  resetPasswordToken VARCHAR(255),
  resetPasswordExpire DATETIME,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

## Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Access and refresh tokens
- **Input Validation**: Request data validation
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Rate Limiting**: (Can be added)
- **Request Logging**: Morgan HTTP logger

## Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Start production server
npm start
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure production MySQL database
4. Set up proper CORS origins
5. Use environment variables for all sensitive data

## License

MIT License
