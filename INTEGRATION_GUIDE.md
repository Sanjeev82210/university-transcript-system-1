# Frontend-Backend Integration Guide

Complete guide for integrating the Next.js frontend with the Spring Boot backend.

## 🔗 Overview

This guide walks you through connecting the Next.js frontend to the Spring Boot backend to create a fully functional transcript management system.

## 📋 Prerequisites

- Node.js 18+ installed
- Java 17+ installed
- Maven 3.6+ installed
- Both projects set up (see main README.md)

## 🚀 Step-by-Step Integration

### Step 1: Start the Backend

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Start Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

3. Verify backend is running:
   - Open browser to `http://localhost:8080/api/transcripts`
   - You should see JSON response with demo data

### Step 2: Start the Frontend

1. In a new terminal, navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start Next.js development server:
   ```bash
   npm run dev
   ```

4. Open browser to `http://localhost:3000`

### Step 3: Test Integration

#### Test 1: View Hero Page
1. Navigate to `http://localhost:3000`
2. You should see the animated hero page
3. Click "Go to Dashboard" button

#### Test 2: Create a Transcript
1. On dashboard, fill in "Create New Transcript" form:
   - Student ID: `S12345`
   - Student Name: `John Doe`
   - Email: `john.doe@university.edu`
   - Major: `Computer Science`
2. Click "Create Transcript"
3. You should see success message

#### Test 3: Add Grades
1. Fill in "Add/Update Grades" form:
   - Student ID: `S12345`
   - Course Code: `CS101`
   - Course Name: `Introduction to Programming`
   - Credits: `3`
   - Grade: `A`
2. Click "Add Grade"
3. Success message should show calculated GPA

#### Test 4: View Transcript
1. Enter `S12345` in "View Transcript" form
2. Click "Get Transcript"
3. You should see complete transcript with courses and GPA

#### Test 5: View Analytics
1. Click "Load Analytics" button
2. You should see:
   - Average GPA
   - Top performers list
   - Students grouped by course

## 🔧 Configuration

### Backend Configuration (application.properties)

```properties
# Server Configuration
server.port=8080

# CORS Configuration (handled in CorsConfig.java)
# Allows: http://localhost:3000

# File Storage
app.data.file=src/main/resources/data/transcripts.json
```

### Frontend Configuration (dashboard/page.tsx)

```typescript
const API_BASE_URL = "http://localhost:8080/api/transcripts";
```

## 🐛 Common Integration Issues

### Issue 1: CORS Error

**Symptom:**
```
Access to fetch at 'http://localhost:8080/api/transcripts/create' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solution:**
1. Verify backend `CorsConfig.java` includes `http://localhost:3000`
2. Restart backend server
3. Clear browser cache

### Issue 2: Connection Refused

**Symptom:**
```
Failed to fetch
net::ERR_CONNECTION_REFUSED
```

**Solution:**
1. Verify backend is running on port 8080
2. Check backend console for errors
3. Test backend directly: `curl http://localhost:8080/api/transcripts`

### Issue 3: 404 Not Found

**Symptom:**
```
GET http://localhost:8080/api/transcripts/S12345 404 (Not Found)
```

**Solution:**
1. Verify student exists in database
2. Check backend logs for errors
3. Test with demo student IDs: `S001`, `S002`, `S003`

### Issue 4: 400 Bad Request

**Symptom:**
```
POST http://localhost:8080/api/transcripts/create 400 (Bad Request)
```

**Solution:**
1. Verify all required fields are filled
2. Check request payload format in browser DevTools
3. Ensure student ID doesn't already exist

## 🔍 Debugging Tips

### Backend Debugging

1. **Check Console Logs:**
   ```bash
   # Backend console shows:
   🎓 University Transcript System Started!
   📡 API available at: http://localhost:8080/api/transcripts
   🔄 Initializing demo data...
   ✅ Demo data loaded successfully!
   ```

2. **Test Endpoints with curl:**
   ```bash
   # Get all transcripts
   curl http://localhost:8080/api/transcripts
   
   # Get specific transcript
   curl http://localhost:8080/api/transcripts/S001
   
   # Create transcript
   curl -X POST http://localhost:8080/api/transcripts/create \
     -H "Content-Type: application/json" \
     -d '{"studentId":"TEST001","studentName":"Test","email":"test@edu","major":"CS"}'
   ```

3. **Check Data File:**
   ```bash
   # View stored data
   cat backend/src/main/resources/data/transcripts.json
   ```

### Frontend Debugging

1. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for JavaScript errors or failed network requests

2. **Check Network Tab:**
   - Open DevTools > Network
   - Filter by "Fetch/XHR"
   - Verify request URLs and responses

3. **Verify API Base URL:**
   ```typescript
   // In src/app/dashboard/page.tsx
   console.log('API Base URL:', API_BASE_URL);
   ```

## 📊 Data Flow

### Create Transcript Flow
```
Frontend Form → POST /api/transcripts/create → Backend Service → File Storage
                                                      ↓
Frontend ← JSON Response ← REST Controller ← Return Transcript
```

### Update Grade Flow
```
Frontend Form → PUT /api/transcripts/{id}/grades → Backend Service
                                                          ↓
                                                    Calculate GPA
                                                          ↓
Frontend ← Updated Transcript ← REST Controller ← Save to File
```

### View Analytics Flow
```
Frontend → GET /api/transcripts/top-performers → Stream Operations
Frontend → GET /api/transcripts/average-gpa → Aggregate Calculations
Frontend → GET /api/transcripts/group-by-course → Group & Map Operations
                                                          ↓
Frontend ← JSON Responses ← REST Controller ← Process Collections
```

## 🧪 Integration Testing Checklist

### Backend Tests
- [ ] Backend starts without errors
- [ ] Demo data initializes correctly
- [ ] All endpoints return 200 OK for valid requests
- [ ] CORS headers present in responses
- [ ] Error handling returns proper status codes

### Frontend Tests
- [ ] Hero page loads and animates
- [ ] Dashboard navigation works
- [ ] Forms validate input correctly
- [ ] Loading states display during API calls
- [ ] Success messages appear after operations
- [ ] Error messages display on failures
- [ ] Transcript data displays correctly
- [ ] Analytics load and display properly

### End-to-End Tests
- [ ] Can create new student transcript
- [ ] Can add multiple grades to same student
- [ ] GPA calculates correctly
- [ ] Can view complete transcript
- [ ] Top performers list updates correctly
- [ ] Average GPA reflects all students
- [ ] Course grouping shows all students per course
- [ ] Data persists after backend restart

## 🌐 Production Deployment

### Update Backend CORS for Production

In `CorsConfig.java`:
```java
registry.addMapping("/api/**")
    .allowedOrigins(
        "http://localhost:3000",  // Development
        "https://your-app.vercel.app"  // Production
    )
    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
    .allowedHeaders("*")
    .allowCredentials(true);
```

### Update Frontend API URL for Production

Create `.env.production`:
```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/transcripts
```

Update `dashboard/page.tsx`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/transcripts";
```

## 📞 Getting Help

If you encounter issues:

1. **Check both server logs** (backend console and frontend terminal)
2. **Verify both servers are running** (ports 3000 and 8080)
3. **Test backend independently** using curl or Postman
4. **Clear browser cache** and restart dev servers
5. **Check CORS configuration** in backend
6. **Review this guide** for common issues

## 🎯 Next Steps

Once integration is working:
1. Add user authentication
2. Implement database (replace file storage)
3. Add input validation
4. Implement pagination
5. Add search functionality
6. Create admin panel
7. Add PDF export for transcripts
8. Implement email notifications

---

**Need More Help?**
- Check `README.md` for general setup
- Check `BACKEND_README.md` for Spring Boot details
- Review code comments for implementation details
