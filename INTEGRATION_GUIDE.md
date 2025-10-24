# Frontend-Backend Integration Guide

Complete guide for integrating the Next.js frontend with the Spring Boot backend.

## 🔗 Overview

This guide walks you through connecting the Next.js frontend to the Spring Boot backend to create a fully functional transcript management system with **multi-section teacher support**.

## 📋 Prerequisites

- Node.js 18+ installed
- Java 17+ installed
- Maven 3.6+ installed
- Both projects set up (see main README.md)

## 🎓 NEW: Teacher-Section-Student Management

This system now supports **multi-section management** where:
- **Teachers** can manage multiple class sections
- **Students** can be enrolled in multiple sections
- **Transcripts** can be filtered by section for scoped access
- **Analytics** can be viewed per-section or globally

### Architecture Overview

```
Teacher → Manages Multiple Sections
Section → Contains Multiple Students
Student → Enrolled in Multiple Sections → Has One Transcript
```

### Database Schema

**New Tables:**
- `teacher` - Teacher information and user account mapping
- `section` - Course sections with teacher assignments
- `student_section` - Junction table for student enrollments
- `user` - Extended with `role` (STUDENT/TEACHER/ADMIN) and `teacherId`

### Demo Data

The system comes pre-loaded with:

**Teachers:**
- Alice Teacher (alice.teacher@university.edu) - Teaches Math101 (S1) and Physics201 (S2)
- Bob Teacher (bob.teacher@university.edu) - Teaches Biology301 (S3)

**Students:**
- S001 (Alice Johnson) - Enrolled in Math101 (S1)
- S002 (Bob Smith) - Enrolled in Math101 (S1)
- S003 (Carol White) - Enrolled in Biology301 (S3)

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

#### Test 1: Authentication
1. Navigate to `http://localhost:3000`
2. Click "Register" and create an account
3. Sign in with your credentials
4. You should be redirected to the dashboard

#### Test 2: Section Management
1. On dashboard, view the **Section Filter** card at the top
2. You should see sections loaded: Math101 (S1), Physics201 (S2), Biology301 (S3)
3. Select a section from the dropdown to filter data

#### Test 3: Create a Transcript with Section Assignment
1. Select "Math101 (S1)" from the section dropdown
2. Fill in "Create New Transcript" form:
   - Student ID: `S12345`
   - Student Name: `John Doe`
   - Email: `john.doe@university.edu`
   - Major: `Computer Science`
3. Click "Create Transcript"
4. Student will be automatically enrolled in the selected section
5. You should see success message

#### Test 4: Add Grades
1. Ensure a section is selected
2. Fill in "Add/Update Grades" form:
   - Student ID: `S12345`
   - Course Code: `CS101`
   - Course Name: `Introduction to Programming`
   - Credits: `3`
   - Grade: `A`
3. Click "Add Grade"
4. Success message should show calculated GPA

#### Test 5: View Transcript with Section Info
1. Select a section or "All Sections"
2. Enter `S001` in "View Transcript" form
3. Click "Get Transcript"
4. You should see:
   - Complete transcript with courses and GPA
   - **Enrolled Sections** badges showing which sections the student is in
   - If viewing with a specific section selected, access is checked

#### Test 6: Section-Scoped Access Control
1. Select "Math101 (S1)" section
2. Try to view student S003's transcript (enrolled in Biology301)
3. You should see "Access denied: Student not in this section"
4. This demonstrates section-based access control

#### Test 7: View Analytics
1. Click "Load Analytics" button
2. You should see:
   - Average GPA
   - Top performers list
   - Students grouped by course
3. Select different sections to see filtered views (when backend supports it)

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

### Frontend Configuration

**API Base URL** (src/app/dashboard/page.tsx):
```typescript
const API_BASE_URL = "http://localhost:8080/api/transcripts";
```

**Section APIs** (built-in):
- `/api/sections` - Get all sections
- `/api/sections/:id` - Get section details
- `/api/sections/:sectionId/students` - Manage student enrollments
- `/api/students/:studentId/sections` - Get student's sections
- `/api/teachers` - Teacher management

## 🔌 API Endpoints Reference

### Spring Boot Backend (localhost:8080)

**Transcript Management:**
- `POST /api/transcripts/create` - Create transcript
- `PUT /api/transcripts/{studentId}/grades` - Update grades
- `GET /api/transcripts/{studentId}` - Get transcript
- `GET /api/transcripts/top-performers` - Top students
- `GET /api/transcripts/average-gpa` - Average GPA
- `GET /api/transcripts/group-by-course` - Group by course

### Next.js Frontend (localhost:3000/api)

**Section Management:**
- `GET /api/sections` - Get all sections with student counts
- `GET /api/sections?teacherId=1` - Filter sections by teacher
- `GET /api/sections/:id` - Get section with teacher and students
- `POST /api/sections` - Create new section
- `POST /api/sections/:sectionId/students` - Enroll student in section
- `DELETE /api/sections/:sectionId/students/:studentId` - Remove enrollment
- `GET /api/students/:studentId/sections` - Get student's enrolled sections

**Teacher Management:**
- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get teacher with sections
- `POST /api/teachers` - Create new teacher

**Authentication:**
All section and teacher APIs require authentication via bearer token.

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

### Issue 2: Section Data Not Loading

**Symptom:**
```
Failed to load sections
```

**Solution:**
1. Verify authentication is working (check localStorage for bearer_token)
2. Check browser console for detailed error messages
3. Verify database has seeded section data
4. Test section API directly: `curl http://localhost:3000/api/sections -H "Authorization: Bearer <token>"`

### Issue 3: Student Not Found in Section

**Symptom:**
```
Access denied: Student not in this section
```

**Solution:**
1. This is expected behavior when viewing a student not enrolled in the selected section
2. Select "All Sections" to view any student
3. Verify student enrollment via: `GET /api/students/{studentId}/sections`

### Issue 4: Connection Refused

**Symptom:**
```
Failed to fetch
net::ERR_CONNECTION_REFUSED
```

**Solution:**
1. Verify backend is running on port 8080
2. Check backend console for errors
3. Test backend directly: `curl http://localhost:8080/api/transcripts`

### Issue 5: 401 Unauthorized on Section APIs

**Symptom:**
```
GET http://localhost:3000/api/sections 401 (Unauthorized)
```

**Solution:**
1. Verify user is logged in
2. Check localStorage for bearer_token
3. Try logging out and back in
4. Check browser console for authentication errors

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
   - Check Authorization headers are present

3. **Verify Section State:**
   ```typescript
   // In browser console
   localStorage.getItem('bearer_token') // Should have a token
   ```

4. **Check Database Studio:**
   - Click "Database Studio" tab in top-right corner
   - Verify tables: teacher, section, student_section exist
   - Check data is seeded correctly

## 📊 Data Flow

### Create Transcript with Section Assignment
```
1. User selects section in dropdown
2. User fills create form
3. Frontend POST /api/transcripts/create (Spring Boot)
4. Backend creates transcript, returns student data
5. Frontend POST /api/sections/{sectionId}/students (Next.js)
6. Student enrolled in selected section
7. Success message displayed
```

### View Transcript with Section Filtering
```
1. User selects section filter
2. User enters student ID
3. Frontend checks GET /api/sections/{sectionId}/students
4. If student not in section → Access denied
5. If student in section → GET /api/transcripts/{studentId}
6. Frontend fetches GET /api/students/{studentId}/sections
7. Display transcript with section badges
```

### Section Management Flow
```
Teacher Login → Dashboard → Section Dropdown Populated → 
Select Section → All operations scoped to that section →
Create/View/Update filtered by section
```

## 🧪 Integration Testing Checklist

### Backend Tests
- [ ] Backend starts without errors
- [ ] Demo data initializes correctly (including sections)
- [ ] All endpoints return 200 OK for valid requests
- [ ] CORS headers present in responses
- [ ] Error handling returns proper status codes

### Frontend Tests
- [ ] Hero page loads and animates
- [ ] Authentication flow works (register/login/logout)
- [ ] Dashboard navigation works
- [ ] **Section dropdown loads with demo sections**
- [ ] **Section selection updates all forms**
- [ ] Forms validate input correctly
- [ ] Loading states display during API calls
- [ ] Success messages appear after operations
- [ ] Error messages display on failures
- [ ] **Section access control works (403 for wrong section)**
- [ ] Transcript data displays correctly
- [ ] **Section badges show on transcript view**
- [ ] Analytics load and display properly

### End-to-End Tests
- [ ] Can create new student transcript
- [ ] **Student auto-enrolled in selected section**
- [ ] Can add multiple grades to same student
- [ ] GPA calculates correctly
- [ ] Can view complete transcript
- [ ] **Can view student's enrolled sections**
- [ ] **Section filtering prevents cross-section access**
- [ ] Top performers list updates correctly
- [ ] Average GPA reflects all students
- [ ] Course grouping shows all students per course
- [ ] Data persists after backend restart
- [ ] **Section data persists in database**

## 🔐 Security & Access Control

### Section-Based Access

The system implements section-based access control:

1. **Teacher Assignment:** Each section is assigned to a teacher
2. **Student Enrollment:** Students are enrolled in specific sections
3. **Filtered Views:** Teachers only see students in their assigned sections
4. **Access Checks:** Transcript access validated against section enrollment

### Implementation

```typescript
// Frontend checks before viewing transcript
if (selectedSectionId !== "all") {
  const sectionStudents = await fetch(`/api/sections/${sectionId}/students`);
  const isInSection = sectionStudents.some(s => s.studentId === studentId);
  
  if (!isInSection) {
    toast.error("Access denied: Student not in this section");
    return;
  }
}
```

### Backend Notes

For full section-scoped access control on the Spring Boot side:
1. Add `?sectionId=X` parameter to transcript endpoints
2. Filter transcript queries by section enrollment
3. Add teacher authentication and authorization
4. Implement role-based access control (RBAC)

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

## 📚 Database Management

### Access Database Studio

1. Click "Database Studio" tab (top-right corner of the page)
2. View and manage all tables:
   - `user` - User accounts with roles
   - `teacher` - Teacher information
   - `section` - Course sections
   - `student_section` - Student enrollments
3. Run SQL queries directly
4. Export/import data

### Useful Queries

```sql
-- View all teachers with section counts
SELECT t.*, COUNT(s.id) as section_count 
FROM teacher t 
LEFT JOIN section s ON t.id = s.teacherId 
GROUP BY t.id;

-- View students by section
SELECT ss.studentId, s.name as sectionName, s.sectionCode 
FROM student_section ss 
JOIN section s ON ss.sectionId = s.id;

-- View sections with student counts
SELECT s.*, COUNT(ss.studentId) as student_count 
FROM section s 
LEFT JOIN student_section ss ON s.id = ss.sectionId 
GROUP BY s.id;
```

## 📞 Getting Help

If you encounter issues:

1. **Check both server logs** (backend console and frontend terminal)
2. **Verify both servers are running** (ports 3000 and 8080)
3. **Test backend independently** using curl or Postman
4. **Clear browser cache** and restart dev servers
5. **Check CORS configuration** in backend
6. **Verify database seeding** via Database Studio
7. **Check authentication state** in browser localStorage
8. **Review this guide** for common issues

## 🎯 Next Steps

Once integration is working:
1. ✅ **Section management fully integrated**
2. ✅ **Multi-section teacher support**
3. ✅ **Student enrollment tracking**
4. Add backend section filtering to transcript endpoints
5. Implement teacher dashboard with section overview
6. Add section-based analytics and reports
7. Create admin panel for section management
8. Add PDF export for transcripts with section info
9. Implement email notifications for section enrollment
10. Add grade import/export per section

---

**Need More Help?**
- Check `README.md` for general setup
- Check `BACKEND_README.md` for Spring Boot details
- Check `PROJECT_SUMMARY.md` for architecture overview
- Review code comments for implementation details
- Access Database Studio for data inspection