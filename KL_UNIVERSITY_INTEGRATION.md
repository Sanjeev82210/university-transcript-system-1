# KL University Course Integration Guide

## Overview

The University Grading & Transcript System now uses **KL University course codes and names** as representative examples throughout the frontend code. These examples serve as placeholders, comments, and demo data to guide users without restricting functionality.

---

## KL University Example Courses

The system uses **5 representative courses** as samples:

| Course Code | Course Name |
|-------------|-------------|
| `24UC0022` | SOCIAL IMMERSIVE LEARNING |
| `24SDCS01` | FRONT END DEVELOPMENT FRAMEWORKS |
| `24MT2019` | PROBABILITY AND STATISTICS |
| `24CS2202` | COMPUTER NETWORKS |
| `24AD2001` | ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING |

---

## Integration Points

### 1. **Validation Schemas** (`src/lib/validation.ts`)

**KL Format Validation:**
```typescript
// Course Code Validation
courseCode: z.string()
  .min(1, "Course code is required (e.g., 24UC0022)")
  .regex(/^[A-Z0-9]+$/, "Use format like KL University: 24UC0022, 24SDCS01")

// Course Name Validation
courseName: z.string()
  .min(1, "Course name is required (e.g., SOCIAL IMMERSIVE LEARNING)")
```

**Features:**
- Alphanumeric validation for course codes
- Example-driven error messages
- Supports KL University format (e.g., `24UC0022`)

---

### 2. **Course Management Component** (`src/components/ui/course-management.tsx`)

**Placeholders:**
```typescript
// Course Code Input
placeholder="e.g., 24UC0022"

// Course Name Input
placeholder="e.g., FRONT END DEVELOPMENT FRAMEWORKS"
```

**Demo Console Logging:**
```typescript
useEffect(() => {
  console.log('Loaded KL University course examples: 24UC0022, 24SDCS01, 24MT2019, 24CS2202, 24AD2001');
}, []);
```

**Empty State Message:**
```
"No courses available. Create your first course above! 
(Try KL format: 24UC0022 - SOCIAL IMMERSIVE LEARNING)"
```

---

### 3. **Dashboard Page** (`src/app/dashboard/page.tsx`)

**Example Courses Array:**
```typescript
const [exampleCourses] = useState<Course[]>([
  { code: '24UC0022', name: 'SOCIAL IMMERSIVE LEARNING' },
  { code: '24SDCS01', name: 'FRONT END DEVELOPMENT FRAMEWORKS' },
  { code: '24MT2019', name: 'PROBABILITY AND STATISTICS' },
  { code: '24CS2202', name: 'COMPUTER NETWORKS' },
  { code: '24AD2001', name: 'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING' },
]);
```

**Update Grades Form Placeholders:**
```typescript
// Course Code
placeholder="e.g., 24UC0022"
<span className="text-xs">(e.g., 24UC0022 - SOCIAL IMMERSIVE LEARNING)</span>

// Course Name
placeholder="e.g., COMPUTER NETWORKS"
<span className="text-xs">(e.g., FRONT END DEVELOPMENT FRAMEWORKS)</span>
```

**Demo Toast Notification:**
```typescript
toast.info('Demo with KL University courses', {
  description: 'Example courses: 24UC0022, 24SDCS01, 24MT2019, 24CS2202, 24AD2001',
});
```

**Success Messages:**
```typescript
toast.success(`Added grade for course ${data.courseCode}! GPA: ${result.gpa.toFixed(2)}`);
toast.success(`Added KL-style course ${result.courseCode} successfully!`);
```

---

## User Workflows

### **Teacher Workflow**

#### 1. **Add New Course** (Flexible - Any Code/Name)
```
Navigation: Dashboard → Courses Tab → Add New Course Form

Fields:
- Course Code: "24NEW01" (or any alphanumeric format)
- Course Name: "NEW COURSE NAME"
- Section: Optional dropdown

Result: Course created successfully
```

**Teacher Flexibility:**
- Teachers can create courses with **any code and name**
- Examples are **guidance only**, not restrictions
- No hardcoded limits on course names

#### 2. **Add Grades with KL Course**
```
Navigation: Dashboard → Update Grades Tab

Example Input:
- Student ID: S001
- Course Code: 24UC0022
- Course Name: SOCIAL IMMERSIVE LEARNING
- Credits: 3
- Grade: A

Result: "Added grade for course 24UC0022! GPA: 3.85"
```

---

### **Admin Workflow**

#### 1. **Delete Courses** (Admin-Only)
```
Navigation: Dashboard → Courses Tab → Delete Button (🗑️)

Action: Click delete on "24UC0022 - SOCIAL IMMERSIVE LEARNING"
Confirmation: "Are you sure you want to delete course 24UC0022?"

Result: "Course 24UC0022 deleted successfully (admin action)"
```

**Admin Restrictions:**
- Only admins see delete buttons
- Non-admins attempting deletion via API receive: `403 Forbidden`
- Toast message: "Only administrators can delete courses"

---

## Form Integration Examples

### **Update Grades Form**

```tsx
<Input
  {...gradeForm.register("courseCode")}
  placeholder="e.g., 24UC0022"
/>
<span className="text-xs text-gray-500">
  (e.g., 24UC0022 - SOCIAL IMMERSIVE LEARNING)
</span>
```

### **Course Management Form**

```tsx
<Label>
  Course Code * 
  <span className="text-xs text-gray-500">(e.g., 24UC0022)</span>
</Label>
<Input
  placeholder="e.g., 24UC0022"
/>

<Label>
  Course Name * 
  <span className="text-xs text-gray-500">(e.g., SOCIAL IMMERSIVE LEARNING)</span>
</Label>
<Input
  placeholder="e.g., FRONT END DEVELOPMENT FRAMEWORKS"
/>
```

---

## Permissions & Access Control

### **Course Creation**
- **Who:** Teachers and Admins
- **Access:** `canCreateCourses` permission check
- **Validation:** KL University format recommended but not enforced

### **Course Deletion**
- **Who:** Admins only
- **Access:** `canDeleteCourses` permission check
- **UI:** Delete button only visible to admins
- **Error Handling:** 403 response for unauthorized attempts

### **Permission Check Pattern**
```typescript
const { canCreateCourses, canDeleteCourses } = useRole();

// Create form visible when:
{canCreateCourses && <CreateCourseForm />}

// Delete button visible when:
{canDeleteCourses && <DeleteButton />}
```

---

## Backend Integration Notes

### **Expected Backend Behavior**

The frontend expects the backend (Spring Boot) to:

1. **Initialize Demo Data**
```java
// TranscriptManager.initializeDemoData()
new Course("24UC0022", "SOCIAL IMMERSIVE LEARNING")
new Course("24SDCS01", "FRONT END DEVELOPMENT FRAMEWORKS")
new Course("24MT2019", "PROBABILITY AND STATISTICS")
new Course("24CS2202", "COMPUTER NETWORKS")
new Course("24AD2001", "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING")
```

2. **Support Flexible Course Creation**
```java
POST /api/courses
{
  "code": "24NEW01",        // Any alphanumeric code
  "name": "NEW COURSE NAME" // Any course name
}
```

3. **Admin-Only Deletion**
```java
@PreAuthorize("hasRole('ADMIN')")
DELETE /api/courses/{code}
```

4. **Course Filtering**
```java
GET /api/courses?sectionId=1
GET /api/transcripts?courseCode=24SDCS01
```

---

## Testing Scenarios

### **Test 1: View KL Example Course in Form**
```
1. Navigate to Dashboard → Update Grades
2. Observe placeholder: "e.g., 24UC0022"
3. Observe helper text: "(e.g., 24UC0022 - SOCIAL IMMERSIVE LEARNING)"
✓ Pass: Examples visible as guidance
```

### **Test 2: Create Custom Course**
```
1. Login as Teacher
2. Navigate to Courses Tab → Add New Course
3. Enter Code: "24CUSTOM99"
4. Enter Name: "CUSTOM TEST COURSE"
5. Submit
✓ Pass: Course created successfully (not restricted to KL examples)
```

### **Test 3: Admin Delete Course**
```
1. Login as Admin
2. Navigate to Courses Tab
3. Click delete on any course (e.g., "24UC0022")
4. Confirm deletion
✓ Pass: "Course 24UC0022 deleted successfully (admin action)"
```

### **Test 4: Non-Admin Delete Attempt**
```
1. Login as Teacher (non-admin)
2. Navigate to Courses Tab
3. Observe: No delete buttons visible
✓ Pass: Delete functionality hidden for non-admins
```

### **Test 5: Add Grade with KL Course**
```
1. Navigate to Update Grades
2. Enter Student ID: S001
3. Enter Course Code: 24MT2019
4. Enter Course Name: PROBABILITY AND STATISTICS
5. Enter Credits: 3, Grade: A
6. Submit
✓ Pass: "Added grade for course 24MT2019! GPA: X.XX"
```

---

## Code Comments Pattern

Throughout the codebase, look for comments like:

```typescript
/**
 * Course Management Component
 * KL University example courses are used as placeholders:
 * - 24UC0022 SOCIAL IMMERSIVE LEARNING
 * - 24SDCS01 FRONT END DEVELOPMENT FRAMEWORKS
 * - 24MT2019 PROBABILITY AND STATISTICS
 * - 24CS2202 COMPUTER NETWORKS
 * - 24AD2001 ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING
 */

// Demo: Log KL University example courses for reference
console.log('Loaded KL University course examples: 24UC0022, ...');

// KL University example: 24UC0022 - SOCIAL IMMERSIVE LEARNING
// Assign to section e.g., S-10-MA with KL course 24SDCS01
```

---

## Key Principles

### ✅ **DO:**
- Use KL examples as **placeholders and guidance**
- Allow teachers to add **any course code/name**
- Preserve **teacher flexibility** for course creation
- Restrict **deletions to admins only**
- Display examples in **comments and console logs**

### ❌ **DON'T:**
- Hardcode KL courses as **exclusive options**
- Prevent teachers from **adding custom courses**
- Allow non-admins to **delete courses**
- Overwrite **core tab structure** or **existing models**

---

## Future Enhancements

### **Backend Integration**
1. Seed database with 5 KL example courses on first run
2. Add `Course.toString()` method: `"24UC0022 - SOCIAL IMMERSIVE LEARNING"`
3. Implement section-course assignment in `TranscriptManager`
4. Add demo students with KL course grades (S001: 24UC0022=90, 24SDCS01=85)

### **Frontend Enhancements**
1. Add course **dropdown** (pre-populated with KL examples + teacher courses)
2. Add **autocomplete** for course codes from backend
3. Display **"Example from KL University"** badge on demo courses
4. Add **course analytics** filtered by KL example courses

---

## Summary

✅ **Integrated KL University Examples:**
- 5 representative courses as placeholders
- Validation schemas with KL format guidance
- Demo console logs and toast notifications
- Helper text throughout forms

✅ **Preserved Core Functionality:**
- All tabs remain unchanged (Create/Update/View/Analytics/Courses/Sections)
- Teacher flexibility maintained (any code/name)
- Admin-only deletions enforced
- Section management preserved

✅ **User Experience:**
- Examples inspire without restricting
- Clear permissions (Teacher vs Admin)
- Responsive design maintained
- Type-safe implementation

---

## Contact & Support

For questions about KL University course integration:
- Check validation schemas in `src/lib/validation.ts`
- Review course management in `src/components/ui/course-management.tsx`
- Test workflows in `src/app/dashboard/page.tsx`

**Demo Workflow:** Login → View toast with KL examples → Create courses → Select from examples or add custom
