# Role-Based Access Control (RBAC) Implementation Guide

## 🎯 Overview

Your University Grading & Transcript System now has comprehensive role-based access control with three distinct user roles:

- **STUDENT** - Basic access (default role)
- **TEACHER** - Can create courses and sections, assign students
- **ADMIN** - Full access including delete operations

---

## 🗄️ Database Schema Changes

### 1. User Role Field
The `user` table now includes a `role` field:
```typescript
role: text("role").default('STUDENT')
```

### 2. Courses Table (New)
```typescript
- id: integer (primary key, auto-increment)
- courseCode: text (unique, e.g., "CS101")
- courseName: text (e.g., "Introduction to Programming")
- sectionId: integer (nullable, references section.id)
- teacherId: integer (references teacher.id) - ownership tracking
- createdById: text (references user.id) - audit trail
- createdAt: text (ISO timestamp)
- updatedAt: text (ISO timestamp)
```

---

## 🔐 API Endpoints with Role-Based Access

### **TEACHER + ADMIN Access** (Both roles can access)

#### 1. POST /api/courses
**Create a new course**
- **Body**: `{ courseCode, courseName, sectionId? }`
- **Authorization**: TEACHER or ADMIN
- **Returns**: Created course object
- **Error Codes**:
  - 401: Authentication required
  - 403: Unauthorized role (neither TEACHER nor ADMIN)
  - 400: Validation errors or duplicate courseCode

#### 2. POST /api/sections
**Create a new section**
- **Body**: `{ sectionCode, name }`
- **Authorization**: TEACHER or ADMIN
- **Returns**: Created section object
- **Error Codes**:
  - 401: Authentication required
  - 403: Unauthorized role
  - 400: Validation errors or duplicate sectionCode

#### 3. GET /api/courses
**Get all courses with optional filtering**
- **Query Params**: `?teacherId=X&sectionId=Y` (optional)
- **Authorization**: Public
- **Returns**: Array of courses with teacher and section details

### **ADMIN-ONLY Access**

#### 4. DELETE /api/courses/[id]
**Delete a course (ADMIN only)**
- **Authorization**: ADMIN role required
- **Returns**: Success message with deleted course details
- **Error Codes**:
  - 401: Authentication required
  - 403: "Only administrators can delete courses"
  - 404: Course not found

#### 5. DELETE /api/sections/[id]
**Delete a section with cascade (ADMIN only)**
- **Authorization**: ADMIN role required
- **Cascade**: Automatically deletes all student enrollments
- **Returns**: Success message, deleted section, count of deleted enrollments
- **Error Codes**:
  - 401: Authentication required
  - 403: "Only administrators can delete sections"
  - 404: Section not found

---

## 🎨 Frontend Components

### 1. Role Utilities (`src/lib/rbac.ts`)
```typescript
// Check functions
isAdmin(role) - Check if user is admin
isTeacher(role) - Check if user is teacher
isTeacherOrAdmin(role) - Check if user can create
canCreateCourses(role) - Check if user can create courses/sections
canDeleteCourses(role) - Check if user can delete (admin only)
canEditCriticalFields(role) - Check if user can edit critical data

// Display functions
getRoleDisplayName(role) - "Administrator", "Teacher", "Student"
getRoleBadgeColor(role) - Returns appropriate badge color class
```

### 2. Custom Hook (`src/hooks/use-role.ts`)
```typescript
const { 
  role,              // Current user's role
  isLoading,         // Loading state
  isAdmin,           // Boolean: is admin
  isTeacher,         // Boolean: is teacher
  isTeacherOrAdmin,  // Boolean: can create
  canCreateCourses,  // Boolean: can create courses
  canDeleteCourses,  // Boolean: can delete (admin)
  canEditCriticalFields // Boolean: can edit critical fields
} = useRole();
```

### 3. Course Management Component
**Location**: `src/components/ui/course-management.tsx`

**Features**:
- ✅ Form to create new courses
- ✅ Optional section assignment
- ✅ List all courses with teacher and section info
- ✅ Delete buttons (visible only to admins)
- ✅ Role-based access messages
- ✅ Real-time course list updates
- ✅ Proper 403 error handling

### 4. Section Management Component
**Location**: `src/components/ui/section-management.tsx`

**Features**:
- ✅ Form to create new sections
- ✅ List all sections with teacher and student count
- ✅ Delete buttons (visible only to admins)
- ✅ Cascade delete warning (shows student count)
- ✅ Role-based access messages
- ✅ Real-time section list updates
- ✅ Proper 403 error handling

### 5. Dashboard Integration
The dashboard now includes:
- **Role badge** in header (displays user's role with appropriate color)
- **Two new tabs**: "Courses" and "Sections"
- **6 tabs total**: Create, Update, View, Analytics, Courses, Sections
- **Responsive grid layout** for mobile devices
- **Role-aware UI** that shows/hides features based on permissions

---

## 👥 Demo Data

### Users Created:
1. **Admin User**
   - Email: `admin@university.edu`
   - Role: ADMIN
   - ID: `admin_001`

2. **Teachers** (3 total)
   - Alice Teacher (`alice.teacher@university.edu`) - TEACHER
   - Bob Teacher (`bob.teacher@university.edu`) - TEACHER
   - Carol Teacher (`carol.teacher@university.edu`) - TEACHER

3. **Students** (5 total)
   - S001: John Doe
   - S002: Jane Smith
   - S003: Mike Johnson
   - S004: Sarah Williams
   - S005: David Brown

### Courses Created (10 total):
- CS101, CS201 (Alice)
- MATH101, MATH201 (Alice)
- PHYS101, PHYS201 (Bob)
- BIO101, CHEM101 (Bob)
- ENG101, HIST101 (Alice)

### Sections:
- S1: Math101 (Alice)
- S2: Physics201 (Alice)
- S3: Biology301 (Bob)

---

## 🧪 Testing the RBAC System

### Test as Teacher:
1. Register/Login as a teacher account
2. Navigate to **Courses** tab
3. ✅ You should see the "Add New Course" form
4. ✅ Create a course successfully
5. ❌ Delete buttons should NOT be visible
6. Try to manually call DELETE endpoint → 403 error

### Test as Admin:
1. Login as `admin@university.edu`
2. Navigate to **Courses** tab
3. ✅ You should see the "Add New Course" form
4. ✅ Create a course successfully
5. ✅ Delete buttons SHOULD be visible (red trash icons)
6. ✅ Click delete → Confirmation prompt → Success
7. Repeat for **Sections** tab

### Test as Student:
1. Register/Login as a student account
2. Navigate to **Courses** tab
3. ❌ Should see "Teacher or Admin Access Required" warning
4. ❌ No create forms should be visible
5. ✅ Can still VIEW courses list

---

## 🔒 Security Features

### Backend Authorization
```typescript
// Every protected route checks:
1. Authentication (bearer token required)
2. Role validation (TEACHER/ADMIN for create, ADMIN for delete)
3. Ownership tracking (createdById field)
4. Audit trail (all operations logged)
```

### Frontend Protection
```typescript
// Components use role hooks:
1. Show/hide forms based on permissions
2. Display appropriate error messages
3. Handle 403 responses gracefully
4. Visual role badges for clarity
```

### Error Handling
- **401**: "Authentication required" → Redirect to login
- **403**: "Only [role] can [action]" → User-friendly toast
- **404**: "Resource not found" → Clear error message
- **400**: Validation errors → Field-specific messages

---

## 📋 User Workflows

### Teacher Workflow:
1. Login → See TEACHER badge in header
2. **Create Courses**: Navigate to Courses tab → Fill form → Submit
3. **Create Sections**: Navigate to Sections tab → Fill form → Submit
4. **Assign Students**: Use Create Transcript form with section selector
5. **View/Update**: Access all transcript management features
6. ❌ **Cannot Delete**: No delete buttons visible

### Admin Workflow:
1. Login → See ADMIN badge in header
2. **All Teacher Actions** (create courses, sections, etc.)
3. **Delete Courses**: Navigate to Courses tab → Click trash icon → Confirm
4. **Delete Sections**: Navigate to Sections tab → Click trash icon → Confirm (see cascade warning)
5. **Full Control**: Complete administrative access

### Student Workflow:
1. Login → See STUDENT badge in header
2. ❌ **Cannot Create**: Warning messages shown
3. ✅ **Can View**: See courses and sections lists
4. ✅ **View Own Transcript**: Standard student features

---

## 🎯 Key Features Implemented

✅ **Role-Based UI Rendering** - Show/hide features based on permissions
✅ **Backend Authorization** - Enforce permissions on API routes
✅ **Ownership Tracking** - Track who created each resource
✅ **Audit Trail** - Log user actions with createdById
✅ **Cascade Deletion** - Auto-remove related records (sections → enrollments)
✅ **Error Handling** - User-friendly 403 error messages
✅ **Demo Data** - Pre-populated users, courses, sections
✅ **Role Badges** - Visual indicators of user roles
✅ **Responsive Design** - Mobile-friendly course/section management
✅ **Real-time Updates** - Lists refresh after create/delete operations

---

## 🔧 Configuration

### Changing User Roles
To promote a user to TEACHER or ADMIN, update the database:

```typescript
// Via database studio or direct query:
UPDATE user SET role = 'TEACHER' WHERE email = 'user@example.com';
UPDATE user SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

### Adding New Permissions
1. Update `src/lib/rbac.ts` with new permission checks
2. Add backend authorization to relevant API routes
3. Update frontend components to use new permission hooks
4. Test thoroughly with all role types

---

## 📊 Database Studio Access

You can manage your database (view roles, courses, sections) through the **Database Studio** tab located at the top right of the page, next to the "Analytics" tab.

---

## ✨ What's Next?

This RBAC system is fully extensible. You can:

1. **Add More Roles**: Implement "DEPARTMENT_HEAD", "REGISTRAR", etc.
2. **Fine-Grained Permissions**: Add permissions for editing specific fields
3. **Resource-Level Permissions**: Teachers can only edit their own courses
4. **Bulk Operations**: Admin can bulk delete/update resources
5. **Permission Groups**: Create permission sets for different user types
6. **Audit Logs**: Implement comprehensive action logging

---

## 🎉 Summary

Your University Grading & Transcript System now has a complete role-based access control system with:

- ✅ 3 user roles (STUDENT, TEACHER, ADMIN)
- ✅ 5 new API endpoints with proper authorization
- ✅ Course and Section management UI
- ✅ Role-based UI rendering
- ✅ Comprehensive error handling
- ✅ Demo data for testing
- ✅ Admin-only delete operations
- ✅ Ownership tracking and audit trails

All teachers can create courses and sections, assign students to sections, and manage transcripts. Only administrators can delete courses or sections, ensuring project safety and data integrity!

---

**Need Help?**
- Check the Database Studio for current roles and data
- Review API responses for detailed error messages
- Test with demo accounts to verify permissions
- All error messages are user-friendly and actionable
