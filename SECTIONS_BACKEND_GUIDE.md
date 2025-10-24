# Teacher-Section-Student Backend Integration Guide

Complete guide for integrating multi-section management into the Spring Boot backend.

## 📋 Overview

This guide explains how to extend your Spring Boot backend to support the teacher-section-student associations that are now implemented in the frontend database.

## 🏗️ Current Architecture

### Frontend (Next.js + Drizzle + Turso)
- ✅ Teacher management (`teacher` table)
- ✅ Section management (`section` table)
- ✅ Student-section enrollments (`student_section` table)
- ✅ User roles (`user.role`, `user.teacherId`)
- ✅ Complete API routes for section operations

### Backend (Spring Boot + File I/O)
- ✅ Transcript management (Student, Course, Transcript models)
- ✅ GPA calculation
- ✅ Analytics (top performers, average GPA, grouping)
- ⚠️ No section awareness (processes all students globally)

## 🎯 Integration Strategy

The system uses a **hybrid approach**:

1. **Frontend Database** manages:
   - User authentication and roles
   - Teacher information
   - Section definitions
   - Student-section enrollments

2. **Spring Boot Backend** manages:
   - Student transcript data
   - Grade information
   - GPA calculations
   - Academic analytics

3. **Integration Layer** (Frontend):
   - Fetches sections from frontend DB
   - Queries transcripts from Spring Boot
   - Enforces section-based access control
   - Combines data for unified view

## 🔄 How It Works Now

### Current Flow

```
1. User logs in → Frontend DB checks authentication
2. Dashboard loads → Fetches sections from /api/sections (Frontend DB)
3. User selects section → Filters view client-side
4. Create transcript → POST to Spring Boot + Enroll in section (Frontend DB)
5. View transcript → GET from Spring Boot + GET enrollments from Frontend DB
6. Access control → Frontend checks section enrollment before allowing access
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   Sections   │         │  Transcripts │                  │
│  │   (Turso DB) │         │ (Spring Boot)│                  │
│  └──────┬───────┘         └──────┬───────┘                  │
│         │                        │                           │
│         │  1. Load sections      │                           │
│         │◄───────────────────────┤                           │
│         │                        │                           │
│         │  2. Select section     │                           │
│         │◄───────────────────────┤                           │
│         │                        │                           │
│         │  3. Create transcript  │                           │
│         ├───────────────────────►│                           │
│         │                        │                           │
│         │  4. Enroll student     │                           │
│         │◄───────────────────────┤                           │
│         │                        │                           │
│         │  5. View transcript    │                           │
│         │         + check section enrollment                 │
│         │◄───────────────────────┴───────────────────►       │
│         │                                                     │
└─────────┴─────────────────────────────────────────────────────┘
```

## 🔧 Backend Enhancement Options

### Option 1: Minimal Changes (Current Approach)

**What's Done:**
- Frontend handles all section logic
- Spring Boot remains unchanged
- Section filtering happens client-side

**Pros:**
- No backend changes required
- Spring Boot stays simple
- Faster to implement

**Cons:**
- Not true multi-tenancy
- All transcript data exposed to frontend
- Client-side filtering only

**Best For:** MVP, prototypes, single-deployment scenarios

---

### Option 2: Add Section Field to Models (Recommended)

**Changes Required:**

1. **Update Student.java:**
```java
public class Student implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String studentId;
    private String studentName;
    private String email;
    private String major;
    private String sectionId;  // NEW: Add section reference
    
    // Constructors, getters, setters...
}
```

2. **Update Transcript.java:**
```java
public class Transcript implements Serializable {
    private Student student;
    private List<Course> courses;
    private double gpa;
    private List<String> sectionIds;  // NEW: Student can be in multiple sections
    
    // Add convenience method
    public boolean isInSection(String sectionId) {
        return sectionIds != null && sectionIds.contains(sectionId);
    }
}
```

3. **Update TranscriptManager.java:**
```java
/**
 * Get transcripts filtered by section
 */
public List<Transcript> getTranscriptsBySection(String sectionId) {
    return transcripts.values().stream()
            .filter(t -> t.isInSection(sectionId))
            .collect(Collectors.toList());
}

/**
 * Get top performers in a section
 */
public List<Transcript> getTopPerformersBySection(String sectionId) {
    return getTranscriptsBySection(sectionId).stream()
            .filter(t -> t.getGpa() >= 3.5)
            .sorted((t1, t2) -> Double.compare(t2.getGpa(), t1.getGpa()))
            .collect(Collectors.toList());
}

/**
 * Calculate average GPA for a section
 */
public double getAverageGPABySection(String sectionId) {
    return getTranscriptsBySection(sectionId).stream()
            .mapToDouble(Transcript::getGpa)
            .average()
            .orElse(0.0);
}
```

4. **Update TranscriptController.java:**
```java
/**
 * Get transcripts with optional section filter
 * GET /api/transcripts?sectionId=S1
 */
@GetMapping
public ResponseEntity<List<Transcript>> getTranscripts(
        @RequestParam(required = false) String sectionId) {
    
    if (sectionId != null && !sectionId.isEmpty()) {
        List<Transcript> transcripts = transcriptService.getTranscriptsBySection(sectionId);
        return ResponseEntity.ok(transcripts);
    }
    
    return ResponseEntity.ok(transcriptService.getAllTranscripts());
}

/**
 * Get top performers with optional section filter
 * GET /api/transcripts/top-performers?sectionId=S1&n=5
 */
@GetMapping("/top-performers")
public ResponseEntity<List<Transcript>> getTopPerformers(
        @RequestParam(required = false) String sectionId,
        @RequestParam(defaultValue = "10") int n) {
    
    List<Transcript> topPerformers;
    if (sectionId != null && !sectionId.isEmpty()) {
        topPerformers = transcriptService.getTopPerformersBySection(sectionId);
    } else {
        topPerformers = transcriptService.getTopPerformers();
    }
    
    return ResponseEntity.ok(topPerformers.stream().limit(n).collect(Collectors.toList()));
}

/**
 * Get average GPA with optional section filter
 * GET /api/transcripts/average-gpa?sectionId=S1
 */
@GetMapping("/average-gpa")
public ResponseEntity<Double> getAverageGPA(
        @RequestParam(required = false) String sectionId) {
    
    if (sectionId != null && !sectionId.isEmpty()) {
        return ResponseEntity.ok(transcriptService.getAverageGPABySection(sectionId));
    }
    
    return ResponseEntity.ok(transcriptService.getAverageGPA());
}
```

5. **Update Demo Data:**
```java
public void initializeDemoData() {
    loadFromFile();
    
    if (transcripts.isEmpty()) {
        // Create demo students with section assignments
        Transcript t1 = createTranscript("S001", "Alice Johnson", 
                                       "alice@university.edu", "Computer Science");
        t1.setSectionIds(Arrays.asList("1")); // Enrolled in section 1 (Math101)
        
        Transcript t2 = createTranscript("S002", "Bob Smith", 
                                       "bob@university.edu", "Mathematics");
        t2.setSectionIds(Arrays.asList("1")); // Enrolled in section 1 (Math101)
        
        Transcript t3 = createTranscript("S003", "Carol White", 
                                       "carol@university.edu", "Physics");
        t3.setSectionIds(Arrays.asList("3")); // Enrolled in section 3 (Biology301)
        
        // Add grades as before...
    }
}
```

**Pros:**
- True section filtering in backend
- Reduced data exposure
- Better separation of concerns
- Scales to production

**Cons:**
- Requires backend code changes
- Need to sync section data between systems
- More complex implementation

**Best For:** Production deployments, multi-tenant systems

---

### Option 3: Full Database Integration

**Major Changes:**

1. Replace file I/O with database (PostgreSQL/MySQL)
2. Create teacher, section, student_section tables in Spring Boot
3. Use JPA/Hibernate for ORM
4. Implement full RBAC with Spring Security
5. Consolidate frontend and backend databases

**Implementation:**

```java
// Teacher Entity
@Entity
@Table(name = "teachers")
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    
    @OneToMany(mappedBy = "teacher")
    private List<Section> sections;
}

// Section Entity
@Entity
@Table(name = "sections")
public class Section {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String sectionCode;
    private String name;
    
    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;
    
    @ManyToMany
    @JoinTable(
        name = "student_sections",
        joinColumns = @JoinColumn(name = "section_id"),
        inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private List<Student> students;
}
```

**Pros:**
- Single source of truth
- Enterprise-grade security
- Full ACID compliance
- Production-ready

**Cons:**
- Significant refactoring required
- Database setup complexity
- Longer development time

**Best For:** Enterprise applications, long-term production systems

## 🚀 Implementation Roadmap

### Phase 1: Current State (✅ Complete)
- [x] Frontend section management
- [x] Frontend database tables
- [x] Section API routes
- [x] Dashboard section selector
- [x] Client-side filtering

### Phase 2: Backend Sync (Recommended Next Step)
- [ ] Add `sectionId` field to Spring Boot models
- [ ] Implement section filtering in TranscriptManager
- [ ] Update controller endpoints with section parameters
- [ ] Sync demo data with frontend sections
- [ ] Test section-scoped queries

### Phase 3: Enhanced Features (Future)
- [ ] Teacher dashboard with section overview
- [ ] Section-based analytics and reports
- [ ] Bulk operations per section
- [ ] Export/import per section
- [ ] Section access control in backend

### Phase 4: Full Integration (Optional)
- [ ] Migrate to shared database
- [ ] Implement JPA entities
- [ ] Add Spring Security with roles
- [ ] Multi-tenancy support
- [ ] Advanced reporting

## 📝 Code Examples

### Frontend: Calling Backend with Section Filter

```typescript
// Get top performers for selected section
const fetchTopPerformers = async (sectionId: string) => {
  const url = sectionId === "all" 
    ? `${API_BASE_URL}/top-performers?n=5`
    : `${API_BASE_URL}/top-performers?sectionId=${sectionId}&n=5`;
    
  const response = await fetch(url);
  return await response.json();
};

// Get average GPA for selected section
const fetchAverageGPA = async (sectionId: string) => {
  const url = sectionId === "all"
    ? `${API_BASE_URL}/average-gpa`
    : `${API_BASE_URL}/average-gpa?sectionId=${sectionId}`;
    
  const response = await fetch(url);
  return await response.json();
};
```

### Backend: Service Layer with Section Support

```java
@Service
public class TranscriptManager implements TranscriptService {
    
    private final Map<String, Transcript> transcripts = new ConcurrentHashMap<>();
    
    /**
     * Get transcripts with optional section filter
     */
    public List<Transcript> getTranscripts(String sectionId) {
        if (sectionId == null || sectionId.isEmpty()) {
            return getAllTranscripts();
        }
        return getTranscriptsBySection(sectionId);
    }
    
    /**
     * Filter transcripts by section
     */
    private List<Transcript> getTranscriptsBySection(String sectionId) {
        return transcripts.values().stream()
                .filter(t -> t.getSectionIds() != null && 
                           t.getSectionIds().contains(sectionId))
                .collect(Collectors.toList());
    }
    
    /**
     * Get analytics for a specific section
     */
    public SectionAnalytics getAnalytics(String sectionId) {
        List<Transcript> sectionTranscripts = getTranscriptsBySection(sectionId);
        
        double avgGPA = sectionTranscripts.stream()
                .mapToDouble(Transcript::getGpa)
                .average()
                .orElse(0.0);
                
        List<Transcript> topPerformers = sectionTranscripts.stream()
                .filter(t -> t.getGpa() >= 3.5)
                .sorted((t1, t2) -> Double.compare(t2.getGpa(), t1.getGpa()))
                .limit(5)
                .collect(Collectors.toList());
                
        return new SectionAnalytics(sectionId, avgGPA, topPerformers, 
                                   sectionTranscripts.size());
    }
}
```

## 🧪 Testing Section Integration

### Test Case 1: Section Filtering

```bash
# Get all transcripts
curl http://localhost:8080/api/transcripts

# Get transcripts for section S1
curl "http://localhost:8080/api/transcripts?sectionId=1"

# Get top performers in section S1
curl "http://localhost:8080/api/transcripts/top-performers?sectionId=1&n=3"

# Get average GPA for section S1
curl "http://localhost:8080/api/transcripts/average-gpa?sectionId=1"
```

### Test Case 2: Cross-Section Access

```bash
# Student S001 is in section 1 (Math101)
# Should succeed
curl http://localhost:8080/api/transcripts/S001

# If section filtering is enforced:
# Should return S001 data
curl "http://localhost:8080/api/transcripts/S001?sectionId=1"

# Should return empty or 403
curl "http://localhost:8080/api/transcripts/S001?sectionId=3"
```

### Unit Tests

```java
@SpringBootTest
class TranscriptManagerTest {
    
    @Autowired
    private TranscriptManager transcriptManager;
    
    @Test
    void testGetTranscriptsBySection() {
        // Given
        String sectionId = "1";
        
        // When
        List<Transcript> transcripts = transcriptManager.getTranscriptsBySection(sectionId);
        
        // Then
        assertNotNull(transcripts);
        assertTrue(transcripts.stream()
                .allMatch(t -> t.getSectionIds().contains(sectionId)));
    }
    
    @Test
    void testSectionAnalytics() {
        // Given
        String sectionId = "1";
        
        // When
        SectionAnalytics analytics = transcriptManager.getAnalytics(sectionId);
        
        // Then
        assertNotNull(analytics);
        assertTrue(analytics.getAverageGPA() >= 0.0);
        assertNotNull(analytics.getTopPerformers());
    }
}
```

## 🔐 Security Considerations

### Authentication & Authorization

**Current Setup:**
- Frontend: better-auth with bearer tokens
- Backend: No authentication (open endpoints)

**Recommended:**

1. **Add Spring Security to Backend:**

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors().and()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/transcripts/**").authenticated()
                .anyRequest().permitAll()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt());
            
        return http.build();
    }
}
```

2. **Validate Bearer Tokens:**
   - Frontend sends: `Authorization: Bearer <token>`
   - Backend validates with shared secret or JWT verification
   - Extract user info and section access from token

3. **Implement RBAC:**
   - Teacher role: Can access assigned sections only
   - Admin role: Can access all sections
   - Student role: Can access own transcript only

## 📊 Data Synchronization

### Keeping Section Data in Sync

**Option A: Frontend as Source of Truth (Current)**
- Frontend DB stores section definitions
- Backend receives sectionId in requests
- No section data stored in backend

**Option B: Periodic Sync**
- Frontend publishes section changes to message queue
- Backend consumes and updates local cache
- Eventual consistency

**Option C: Shared Database**
- Both systems access same database
- Real-time consistency
- Requires database migration

## 🎯 Next Steps

1. **Immediate (Do Now):**
   - Test current system with section selector
   - Verify access control works
   - Document any issues

2. **Short Term (Next Sprint):**
   - Add `sectionId` field to Spring Boot models
   - Implement section filtering in service layer
   - Update controller endpoints with parameters
   - Add unit tests for section filtering

3. **Medium Term (Next Month):**
   - Implement section-based analytics
   - Add teacher dashboard features
   - Enhance access control
   - Performance optimization

4. **Long Term (Future):**
   - Consider database consolidation
   - Implement full RBAC
   - Add advanced reporting
   - Multi-tenancy support

## 📚 Additional Resources

- [Spring Boot Security Guide](https://spring.io/guides/gs/securing-web/)
- [JWT Authentication](https://jwt.io/introduction)
- [JPA Relationships](https://www.baeldung.com/jpa-one-to-many)
- [Multi-Tenancy Patterns](https://docs.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/overview)

## 💡 Best Practices

1. **Start Simple:** Use Option 1 (current) for MVP
2. **Add Fields:** Move to Option 2 when scaling
3. **Full Migration:** Only for enterprise needs
4. **Test Thoroughly:** Ensure section isolation works
5. **Document Well:** Keep this guide updated
6. **Monitor Performance:** Track query times with filtering
7. **Security First:** Always validate section access

---

**Questions or Issues?**
- Check INTEGRATION_GUIDE.md for frontend integration
- Check BACKEND_README.md for Spring Boot setup
- Review code comments for implementation details
