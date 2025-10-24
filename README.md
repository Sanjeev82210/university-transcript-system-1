# University Grading & Transcript System

A full-stack web application for managing student transcripts, grades, and academic records. This system is designed as an educational project for CS students learning Java and web development.

## 🎓 Project Overview

This project consists of two distinct applications:

1. **Frontend**: Next.js 15 + React with TypeScript, Tailwind CSS, and Shadcn/UI components
2. **Backend**: Spring Boot REST API with Java (see `BACKEND_README.md`)

## 📁 Project Structure

```
university-transcript-system/
├── frontend/                    # Next.js Frontend (this directory)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Hero landing page
│   │   │   └── dashboard/
│   │   │       └── page.tsx    # Main dashboard with forms
│   │   └── components/
│   │       └── HeroGeometric.tsx
│   ├── package.json
│   └── README.md
│
└── backend/                     # Spring Boot Backend (separate project)
    ├── src/
    │   └── main/
    │       ├── java/
    │       │   └── com/university/transcript/
    │       │       ├── TranscriptApplication.java
    │       │       ├── model/
    │       │       ├── service/
    │       │       ├── controller/
    │       │       └── exception/
    │       └── resources/
    │           └── application.properties
    ├── pom.xml
    └── README.md
```

## 🚀 Quick Start

### Frontend Setup (Next.js)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Backend Setup (Spring Boot)

See the complete backend setup guide in `BACKEND_README.md`

Quick start:
```bash
cd backend
mvn spring-boot:run
```

Backend will run on [http://localhost:8080](http://localhost:8080)

## 🎨 Features

### Frontend Features
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Hero landing page with animated geometric background
- ✅ Comprehensive dashboard with 4 main sections:
  - Create new student transcripts
  - Add/update course grades
  - View complete transcripts
  - Analytics dashboard
- ✅ Loading states and error handling
- ✅ Dark mode support
- ✅ Real-time form validation

### Backend Features
- ✅ RESTful API with Spring Boot
- ✅ CRUD operations for transcripts
- ✅ GPA calculation (automatic)
- ✅ Analytics endpoints (top performers, average GPA, course grouping)
- ✅ File-based persistence (JSON serialization)
- ✅ Exception handling with custom error responses
- ✅ CORS configuration for frontend integration
- ✅ Demo data initialization
- ✅ JUnit tests

## 📡 API Endpoints

The frontend consumes these REST API endpoints from the backend:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transcripts/create` | Create new student transcript |
| PUT | `/api/transcripts/{studentId}/grades` | Add/update course grade |
| GET | `/api/transcripts/{studentId}` | Get transcript by student ID |
| GET | `/api/transcripts/top-performers` | Get students with GPA ≥ 3.5 |
| GET | `/api/transcripts/average-gpa` | Calculate average GPA |
| GET | `/api/transcripts/group-by-course` | Group students by course |

**API Base URL**: `http://localhost:8080/api/transcripts`

To change the backend URL, edit `src/app/dashboard/page.tsx`:
```typescript
const API_BASE_URL = "http://localhost:8080/api/transcripts";
```

## 🔧 Configuration

### CORS Configuration (Backend)

The backend is configured to accept requests from the frontend at `http://localhost:3000`. If you deploy to production or change ports, update the CORS configuration in the backend.

### Environment Variables

No environment variables are required for development. For production:

**Frontend**:
- `NEXT_PUBLIC_API_URL`: Backend API URL

**Backend**:
- `server.port`: Server port (default: 8080)
- `app.data.file`: Data persistence file path

## 📚 Usage Guide

### 1. Create a Student Transcript
1. Navigate to the Dashboard
2. Fill in the "Create New Transcript" form:
   - Student ID (e.g., S12345)
   - Student Name
   - Email
   - Major
3. Click "Create Transcript"

### 2. Add Course Grades
1. Use the "Add/Update Grades" form
2. Enter Student ID and course details:
   - Course Code (e.g., CS101)
   - Course Name
   - Credits (1-6)
   - Grade (A, A-, B+, B, etc.)
3. GPA is automatically calculated

### 3. View Transcripts
1. Enter Student ID in "View Transcript" section
2. View complete academic record with all courses and calculated GPA

### 4. View Analytics
1. Click "Load Analytics" button
2. See:
   - Average GPA across all students
   - Top performers (GPA ≥ 3.5)
   - Student distribution by course

## 🏗️ Architecture & Design Patterns

### Backend (Spring Boot)
- **MVC Pattern**: Model-View-Controller architecture
- **Service Layer Pattern**: Business logic separation
- **Repository Pattern**: Data access abstraction
- **Singleton Pattern**: TranscriptManager service
- **Strategy Pattern**: GPA calculation strategy
- **SOLID Principles**: 
  - Single Responsibility: Each class has one responsibility
  - Open/Closed: Extensible via interfaces
  - Liskov Substitution: Course hierarchy
  - Interface Segregation: Focused interfaces
  - Dependency Inversion: Depends on abstractions

### Frontend (Next.js)
- **Component-Based Architecture**: Reusable UI components
- **Client-Server Separation**: API-driven data fetching
- **Responsive Design**: Mobile-first approach
- **State Management**: React hooks (useState)

## 🧪 Testing

### Backend Testing
See `BACKEND_README.md` for JUnit testing instructions.

### Frontend Testing
```bash
# Run type checking
npm run build

# Manual testing checklist
1. Create transcript with valid data
2. Add grades to existing transcript
3. View transcript details
4. Load analytics
5. Test error scenarios (invalid IDs, missing data)
```

## 📖 Learning Objectives

This project demonstrates:

### Java Concepts
- Object-Oriented Programming (OOP)
- Collections Framework (HashMap, ArrayList)
- Streams API
- Lambda Expressions
- File I/O and Serialization
- Exception Handling
- Concurrency (thread-safe operations)

### Spring Boot Concepts
- REST API Development
- Dependency Injection
- HTTP Methods (GET, POST, PUT)
- Request/Response handling
- CORS configuration
- Application properties

### Frontend Concepts
- Modern React with TypeScript
- Async/Await and Promises
- Fetch API
- Form handling and validation
- Responsive design with Tailwind CSS
- Component composition

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Backend (Heroku/Railway)
```bash
# Build JAR
mvn clean package

# Deploy to your preferred platform
# Update CORS configuration with production URL
```

## 🤝 Contributing

This is an educational project. Feel free to:
- Add new features (e.g., authentication, file uploads)
- Improve error handling
- Add more analytics endpoints
- Implement database persistence (replace file I/O)
- Add unit and integration tests

## 📄 License

MIT License - Free for educational use

## 👨‍💻 Developer Notes

### For CS Students
This project is designed to help you understand:
1. Full-stack development workflow
2. REST API design and consumption
3. State management in React
4. Java backend development with Spring Boot
5. SOLID principles and design patterns

### Next Steps
- Add user authentication
- Implement database (PostgreSQL/MySQL)
- Add PDF transcript generation
- Create admin dashboard
- Implement real-time updates with WebSockets

## 📞 Support

For issues or questions:
1. Check the backend README (`BACKEND_README.md`) for Spring Boot setup
2. Verify both frontend and backend are running
3. Check browser console for errors
4. Verify CORS configuration

---

**Built with ❤️ for CS Education**