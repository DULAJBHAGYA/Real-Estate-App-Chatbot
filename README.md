# Real Estate Chatbot Application

A full-stack real estate chatbot application with a modern Next.js frontend and Node.js backend with MySQL database and JWT authentication.

## 🚀 Features

### Frontend (Next.js + Tailwind CSS)
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Modern UI** - Clean, professional interface with emerald green theme
- **Authentication** - Login and registration with JWT tokens
- **Chat Interface** - Real-time chatbot with message history
- **User Management** - Profile settings and account management
- **Development Tools** - Dev navigation and quick actions for development

### Backend (Node.js + Express + MySQL)
- **JWT Authentication** - Secure login, register, and logout
- **Password Hashing** - Bcrypt encryption for security
- **Input Validation** - Request validation with express-validator
- **Route Protection** - Middleware for protected routes
- **MySQL Database** - Sequelize ORM for data management
- **Token Refresh** - Automatic token refresh mechanism
- **RESTful API** - Clean, documented API endpoints

## 🏗️ Project Structure

```
Real-Estate-App-Chatbot/
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Sequelize models
│   │   ├── routes/        # API routes
│   │   └── utils/         # Utility functions
│   └── package.json
└── package.json           # Root package.json
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **TypeScript** - Type safety
- **JWT** - Client-side token management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM for database operations
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Express-validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Real-Estate-App-Chatbot
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up MySQL database**
   ```sql
   CREATE DATABASE real_estate_chatbot;
   ```

4. **Configure environment variables**
   ```bash
   # Copy server environment template
   cp server/env.example server/.env
   
   # Edit server/.env with your MySQL credentials
   DB_PASSWORD=dulaj1998
   ```

## 🚀 Running the Application

### Development Mode (Both Frontend and Backend)
```bash
npm run dev:all
```

### Frontend Only
```bash
npm run dev
```

### Backend Only
```bash
npm run dev:server
```

### Production Build
```bash
npm run build
npm start
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000 (or 3001 if 3000 is busy)
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/api/health

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### User Management
- `PUT /api/user/profile` - Update user profile
- `DELETE /api/user/account` - Delete user account

### Health Check
- `GET /api/health` - Server health check

## 🎯 Usage

1. **Start the application**: `npm run dev:all`
2. **Open your browser**: Navigate to http://localhost:3000
3. **Register an account**: Use the registration form
4. **Login**: Use your credentials to access the chatbot
5. **Chat**: Interact with the real estate chatbot
6. **Manage account**: Use the sidebar to access settings and logout

## 🔧 Development

### Frontend Development
- **Hot Reload**: Changes reflect immediately
- **Dev Navigation**: Floating dev panel for quick navigation
- **Quick Actions**: Development tools in bottom-right corner

### Backend Development
- **Auto-restart**: Nodemon watches for file changes
- **Database Sync**: Sequelize automatically syncs schema changes
- **Logging**: Morgan HTTP request logging

## 🗄️ Database Schema

The application automatically creates the following MySQL table:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('user', 'admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  last_login DATETIME,
  email_verified BOOLEAN DEFAULT false,
  reset_password_token VARCHAR(255),
  reset_password_expire DATETIME,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);
```

## 🔒 Security Features

- **JWT Tokens**: Secure authentication with access and refresh tokens
- **Password Hashing**: Bcrypt with salt rounds
- **Input Validation**: Server-side validation for all inputs
- **CORS**: Configured for secure cross-origin requests
- **Helmet**: Security headers protection
- **Rate Limiting**: Ready for implementation
- **SQL Injection Protection**: Sequelize ORM protection

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured interface with sidebar
- **Tablet**: Adaptive layout with touch-friendly controls
- **Mobile**: Mobile-optimized interface with collapsible sidebar

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Emerald Theme**: Consistent green color scheme
- **Smooth Animations**: CSS transitions and animations
- **Loading States**: Spinners and loading indicators
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time validation feedback

## 🚀 Deployment

### Frontend Deployment
- **Vercel**: Recommended for Next.js
- **Netlify**: Alternative hosting option
- **Static Export**: Can be deployed to any static hosting

### Backend Deployment
- **Railway**: Easy Node.js deployment
- **Heroku**: Traditional hosting option
- **DigitalOcean**: VPS hosting
- **AWS**: Cloud hosting

## 📝 License

MIT License - feel free to use this project for your own applications.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions, please open an issue in the repository.
