# KL University Integration - Quick Start

## 🎓 Overview

The system now includes **KL University course examples** as guidance throughout the interface. These are **samples only** - teachers can add any course codes and names they want.

---

## 📚 5 Example Courses

```
24UC0022 - SOCIAL IMMERSIVE LEARNING
24SDCS01 - FRONT END DEVELOPMENT FRAMEWORKS
24MT2019 - PROBABILITY AND STATISTICS
24CS2202 - COMPUTER NETWORKS
24AD2001 - ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING
```

---

## 🚀 Quick Actions

### **Add a Grade (Using KL Example)**
```
1. Dashboard → Update Grades Tab
2. Student ID: S001
3. Course Code: 24UC0022
4. Course Name: SOCIAL IMMERSIVE LEARNING
5. Credits: 3
6. Grade: A
7. Submit ✓
```

### **Add Your Own Course (Any Format)**
```
1. Dashboard → Courses Tab
2. Click "Add New Course"
3. Course Code: YOUR_CODE (e.g., CS301, 24NEW01)
4. Course Name: YOUR COURSE NAME
5. Select Section (optional)
6. Create Course ✓
```

### **View Transcript Example**
```
1. Dashboard → View Tab
2. Enter Student ID: S001
3. Click "Get Transcript"
4. See courses displayed as:
   "24UC0022 - SOCIAL IMMERSIVE LEARNING (Marks: 90, Grade: A)"
```

---

## 🔐 Permissions

| Action | Teacher | Admin |
|--------|---------|-------|
| Create Courses | ✅ | ✅ |
| Add Sections | ✅ | ✅ |
| Assign Students | ✅ | ✅ |
| Add Grades | ✅ | ✅ |
| **Delete Courses** | ❌ | ✅ |
| **Delete Sections** | ❌ | ✅ |

---

## 📝 Where You'll See KL Examples

### **1. Form Placeholders**
- Course Code input: `"e.g., 24UC0022"`
- Course Name input: `"e.g., SOCIAL IMMERSIVE LEARNING"`

### **2. Helper Text**
- Small gray text below inputs showing examples
- Tooltips on form fields

### **3. Console Logs**
- Open browser DevTools → Console
- See: `"Loaded KL University examples: 24UC0022, 24SDCS01..."`

### **4. Toast Notifications**
- On dashboard load: "Demo with KL University courses"
- On course creation: "Added KL-style course..."

---

## ✅ Test Workflow

**Complete Flow Using KL Examples:**

```bash
# 1. Login as Teacher
Email: alice@example.com
Password: your_password

# 2. View Demo Toast
✓ "Demo with KL University courses" appears

# 3. Create Student
Dashboard → Create Tab
Student ID: S001
Name: Test Student
Email: student@test.com
Major: Computer Science
Submit ✓

# 4. Add KL Course Grade
Dashboard → Update Grades
Student ID: S001
Course Code: 24SDCS01
Course Name: FRONT END DEVELOPMENT FRAMEWORKS
Credits: 3
Grade: A
Submit ✓

# 5. Add Another KL Course
Course Code: 24CS2202
Course Name: COMPUTER NETWORKS
Credits: 4
Grade: B+
Submit ✓

# 6. View Transcript
Dashboard → View Tab
Student ID: S001
Get Transcript ✓

# Result: See both courses listed with grades
```

---

## 🎯 Key Points

1. **Examples are Guidance Only**
   - KL courses shown as placeholders
   - You can use ANY course code/name
   - No restrictions on format

2. **Teacher Flexibility Preserved**
   - Add courses with any naming scheme
   - Create sections as needed
   - Assign students freely

3. **Admin Controls**
   - Only admins can delete courses/sections
   - Teachers see warning if they lack permission

4. **Format Recommendations**
   - KL format: `24UC0022` (2-digit year + 2-letter dept + 4 digits)
   - But any alphanumeric code works: `CS101`, `MATH201`, `ENG001`

---

## 🔍 Finding Examples in Code

### **Validation File**
```typescript
// src/lib/validation.ts
courseCode: z.string()
  .regex(/^[A-Z0-9]+$/, "Use format like KL University: 24UC0022")
```

### **Course Management**
```typescript
// src/components/ui/course-management.tsx
placeholder="e.g., 24UC0022"
console.log('Loaded KL University course examples: ...')
```

### **Dashboard**
```typescript
// src/app/dashboard/page.tsx
const exampleCourses = [
  { code: '24UC0022', name: 'SOCIAL IMMERSIVE LEARNING' },
  // ... 4 more examples
]
```

---

## ⚠️ Common Issues

### **Issue: Can't Delete Course**
- **Cause:** You're logged in as Teacher (non-admin)
- **Solution:** Login as Admin to delete courses
- **Test:** If you don't see delete (🗑️) buttons, you're not admin

### **Issue: Course Code Validation Error**
- **Cause:** Special characters in course code
- **Solution:** Use only letters and numbers (A-Z, 0-9)
- **Example:** ✅ `24UC0022` ❌ `24-UC-0022`

### **Issue: Don't See KL Examples**
- **Cause:** Backend hasn't seeded demo data yet
- **Solution:** Create courses manually using KL format
- **Note:** Examples are frontend placeholders, not live data

---

## 📖 Full Documentation

For complete details, see:
- **KL_UNIVERSITY_INTEGRATION.md** - Comprehensive integration guide
- **README.md** - Main project documentation
- **INTEGRATION_GUIDE.md** - Backend API integration

---

## 🎓 Example Session

```plaintext
Login as Teacher "Alice" → See Toast "Demo with KL University courses"
→ Go to Courses Tab → See placeholder "e.g., 24UC0022"
→ Add Course: 24MT2019 - PROBABILITY AND STATISTICS
→ Add Grade for Student: 24MT2019 = A
→ View Transcript → See "24MT2019 - PROBABILITY AND STATISTICS (Grade: A)"
```

**Result:** ✅ KL example used successfully, but you can add any course format!

---

## 🚦 Status Indicators

When using the dashboard, look for:

- 🟢 **Green Badge**: Active section selected
- 🔵 **Blue Badge**: Section assigned to student
- 🟣 **Purple Badge**: Current GPA displayed
- 🟡 **Yellow Alert**: Permission restriction (teacher can't delete)

---

## 💡 Pro Tips

1. **Use KL Format for Consistency**
   - Makes it easy to identify year and department
   - Example: `24CS2202` = 2024, Computer Science, Course 2202

2. **Mix and Match**
   - Some courses in KL format: `24UC0022`
   - Some in traditional format: `CS301`
   - System supports both!

3. **Section Organization**
   - Assign KL courses to specific sections
   - Example: Section "S-10-MA" has `24UC0022`, `24SDCS01`

---

**Ready to Start?** Login → See KL examples → Create courses → Add grades → View transcripts! 🎉
