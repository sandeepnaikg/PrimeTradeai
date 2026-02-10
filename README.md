# TaskFlow - Modern Task Management Application

A beautiful, scalable web application with authentication and dashboard features, built as part of the PrimeTrade.ai Frontend Developer Intern assignment.

![TaskFlow Banner](https://img.shields.io/badge/TaskFlow-Modern%20Task%20Management-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=flat-square&logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=flat-square&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=flat-square&logo=tailwind-css)

## 🌟 Features

### ✅ Frontend (React.js)
- **Modern UI/UX**: Beautiful gradient backgrounds, glassmorphism effects, and smooth animations
- **Responsive Design**: Fully responsive using TailwindCSS with mobile-first approach
- **Form Validation**: Client-side and server-side validation for all forms
- **Protected Routes**: JWT-based authentication with route protection
- **Real-time Updates**: Instant feedback with toast notifications
- **Advanced Filtering**: Search and filter tasks by status and priority
- **Statistics Dashboard**: Visual overview of task statistics

### ✅ Backend (FastAPI + Python)
- **RESTful API**: Clean, well-structured API endpoints
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **MongoDB Integration**: NoSQL database for flexible data storage
- **CRUD Operations**: Complete task management functionality
- **Error Handling**: Comprehensive error handling and validation
- **CORS Support**: Configured for frontend-backend communication

### ✅ Security & Best Practices
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Protected API endpoints
- ✅ Input validation on both client and server
- ✅ Environment variables for sensitive data
- ✅ Secure HTTP-only practices

## 🚀 Live Demo

**Frontend**: Running on `http://localhost:3000`
**Backend API**: Running on `http://127.0.0.1:8000`
**API Documentation**: `http://127.0.0.1:8000/docs`

## 📁 Project Structure

```
PrimeTradeai/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (Login, Register, Dashboard)
│   │   ├── utils/           # Utility functions (API client)
│   │   ├── hooks/           # Custom React hooks
│   │   └── index.css        # Global styles with Tailwind
│   ├── package.json
│   └── tailwind.config.js
│
└── backend/                  # FastAPI Backend
    ├── server.py            # Main application file
    ├── requirements.txt     # Python dependencies
    ├── .env                 # Environment variables
    └── venv/                # Virtual environment
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js 18.x
- **Styling**: TailwindCSS 3.x
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Notifications**: Sonner (Toast)
- **Form Handling**: React Hooks

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB (Motor - Async driver)
- **Authentication**: JWT (python-jose)
- **Password Hashing**: bcrypt (passlib)
- **Validation**: Pydantic
- **CORS**: FastAPI CORS Middleware

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   Create a `.env` file:
   ```env
   MONGO_URL=mongodb://127.0.0.1:27017
   DB_NAME=primeTrade
   SECRET_KEY=your-secret-key-here
   ```

5. **Run the server**
   ```bash
   uvicorn server:app --reload
   ```

   Server will start at `http://127.0.0.1:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file:
   ```env
   REACT_APP_API_URL=http://127.0.0.1:8000/api
   ```

4. **Run the development server**
   ```bash
   npm start
   ```

   Application will open at `http://localhost:3000`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Tasks
- `POST /api/tasks` - Create new task (Protected)
- `GET /api/tasks` - Get all tasks with filters (Protected)
- `GET /api/tasks/{task_id}` - Get specific task (Protected)
- `PUT /api/tasks/{task_id}` - Update task (Protected)
- `DELETE /api/tasks/{task_id}` - Delete task (Protected)

## 🎨 UI/UX Highlights

### Design Philosophy
- **Modern Aesthetics**: Vibrant gradients (purple to pink) for visual appeal
- **Glassmorphism**: Frosted glass effects for depth and elegance
- **Micro-animations**: Smooth transitions and hover effects
- **Typography**: Inter for body text, Manrope for headings
- **Color Palette**: Carefully curated HSL colors for harmony

### Key Features
1. **Login Page**: Split-screen design with feature highlights
2. **Register Page**: Reversed layout with feature grid
3. **Dashboard**: Statistics cards, advanced filtering, and beautiful task cards
4. **Responsive**: Mobile-first design that works on all devices

## 🔐 Security Implementation

### Password Security
- Passwords hashed using bcrypt with salt
- Password length validation (minimum 6 characters)
- Passwords truncated to 72 bytes for bcrypt compatibility

### JWT Authentication
- Tokens expire after 24 hours
- Tokens stored in localStorage
- Protected routes check for valid tokens
- Automatic redirect to login on token expiration

### API Security
- CORS configured for specific origins
- Input validation using Pydantic models
- Error messages don't expose sensitive information

## 📈 Scalability Considerations

### Frontend Scalability
1. **Component Architecture**: Modular, reusable components
2. **Code Splitting**: React lazy loading for route-based splitting
3. **State Management**: Ready for Redux/Zustand integration
4. **API Layer**: Centralized API client for easy modification
5. **Environment Config**: Separate configs for dev/staging/prod

### Backend Scalability
1. **Async Operations**: FastAPI with async/await for high concurrency
2. **Database Indexing**: MongoDB indexes on email and user_email fields
3. **Connection Pooling**: Motor async driver with connection pooling
4. **Modular Structure**: Easy to split into microservices
5. **Docker Ready**: Can be containerized for deployment

### Production Deployment Strategy
1. **Frontend**: Deploy to Vercel/Netlify with CDN
2. **Backend**: Deploy to AWS/GCP with auto-scaling
3. **Database**: MongoDB Atlas with replica sets
4. **Caching**: Redis for session management and caching
5. **Load Balancing**: Nginx for distributing traffic
6. **Monitoring**: Sentry for error tracking, DataDog for metrics

## 🧪 Testing

### Manual Testing Checklist
- ✅ User registration with validation
- ✅ User login with error handling
- ✅ Protected route access
- ✅ Task creation, reading, updating, deletion
- ✅ Search and filter functionality
- ✅ Profile update
- ✅ Logout functionality
- ✅ Responsive design on mobile/tablet/desktop

### Future Testing Improvements
- Unit tests with Jest and React Testing Library
- Integration tests for API endpoints
- E2E tests with Cypress/Playwright
- Performance testing with Lighthouse

## 📝 Code Quality

### Frontend
- ESLint for code linting
- Prettier for code formatting
- Consistent naming conventions
- Component-based architecture
- Custom hooks for reusability

### Backend
- Type hints with Pydantic
- Async/await best practices
- RESTful API design
- Comprehensive error handling
- Clean code principles

## 🚀 Future Enhancements

1. **Features**
   - Task categories and tags
   - Task due dates and reminders
   - Collaborative tasks (team features)
   - File attachments
   - Dark mode toggle

2. **Technical**
   - WebSocket for real-time updates
   - Email verification
   - Password reset functionality
   - Two-factor authentication
   - Rate limiting

3. **UI/UX**
   - Drag-and-drop task reordering
   - Kanban board view
   - Calendar view
   - Task templates
   - Keyboard shortcuts

## 👨‍💻 Developer

**Sandeep Naik**
- Email: [Your Email]
- GitHub: [Your GitHub]
- LinkedIn: [Your LinkedIn]

## 📄 License

This project is created for the PrimeTrade.ai Frontend Developer Intern assignment.

## 🙏 Acknowledgments

- PrimeTrade.ai for the opportunity
- shadcn/ui for beautiful components
- Lucide for icons
- Unsplash for images

---

**Note**: This project demonstrates modern web development practices, security implementation, and scalable architecture suitable for production deployment.
