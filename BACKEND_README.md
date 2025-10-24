# Spring Boot Backend - University Transcript System

Complete guide for setting up and running the Spring Boot backend for the University Grading & Transcript System.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Project Structure](#project-structure)
4. [Complete Code Implementation](#complete-code-implementation)
5. [Running the Application](#running-the-application)
6. [API Documentation](#api-documentation)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before starting, ensure you have:

- **Java 17 or higher** ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Maven 3.6+** ([Download](https://maven.apache.org/download.cgi))
- **IDE** (IntelliJ IDEA, Eclipse, or VS Code with Java extensions)
- **Postman** (optional, for API testing)

Verify installations:
```bash
java -version
mvn -version
```

---

## 🚀 Project Setup

### Option 1: Spring Initializr (Recommended for Beginners)

1. Visit [start.spring.io](https://start.spring.io/)
2. Configure project:
   - **Project**: Maven
   - **Language**: Java
   - **Spring Boot**: 3.2.x (latest stable)
   - **Group**: com.university
   - **Artifact**: transcript-system
   - **Name**: TranscriptSystem
   - **Packaging**: Jar
   - **Java**: 17

3. Add Dependencies:
   - Spring Web
   - Spring Boot DevTools
   - Lombok (optional, for cleaner code)

4. Click "Generate" and extract the ZIP file

### Option 2: Manual Maven Setup

Create a new directory and add `pom.xml`:

```bash
mkdir transcript-backend
cd transcript-backend
```

---

## 📁 Project Structure

Create the following directory structure:

```
transcript-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── university/
│   │   │           └── transcript/
│   │   │               ├── TranscriptApplication.java        # Main application
│   │   │               ├── config/
│   │   │               │   └── CorsConfig.java              # CORS configuration
│   │   │               ├── model/
│   │   │               │   ├── Student.java                 # Student entity
│   │   │               │   ├── Course.java                  # Course entity
│   │   │               │   └── Transcript.java              # Transcript entity
│   │   │               ├── service/
│   │   │               │   ├── TranscriptService.java       # Service interface
│   │   │               │   └── TranscriptManager.java       # Service implementation
│   │   │               ├── controller/
│   │   │               │   └── TranscriptController.java    # REST controller
│   │   │               ├── exception/
│   │   │               │   ├── TranscriptNotFoundException.java
│   │   │               │   └── GlobalExceptionHandler.java
│   │   │               └── util/
│   │   │                   └── FileStorageUtil.java         # File I/O utility
│   │   └── resources/
│   │       ├── application.properties                        # Configuration
│   │       └── data/
│   │           └── transcripts.json                          # Data storage
│   └── test/
│       └── java/
│           └── com/
│               └── university/
│                   └── transcript/
│                       ├── TranscriptApplicationTests.java
│                       ├── service/
│                       │   └── TranscriptManagerTest.java
│                       └── controller/
│                           └── TranscriptControllerTest.java
├── pom.xml
└── README.md
```

---

## 💻 Complete Code Implementation

### 1. pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.university</groupId>
    <artifactId>transcript-system</artifactId>
    <version>1.0.0</version>
    <name>UniversityTranscriptSystem</name>
    <description>University Grading and Transcript Management System</description>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Web Starter (includes REST support) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <!-- Spring Boot DevTools (hot reload) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        
        <!-- JSON Processing -->
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
        </dependency>
        
        <!-- Testing Dependencies -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        
        <!-- Lombok (optional - reduces boilerplate) -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 2. application.properties

```properties
# Server Configuration
server.port=8080
spring.application.name=University Transcript System

# File Storage Configuration
app.data.file=src/main/resources/data/transcripts.json

# Logging Configuration
logging.level.com.university.transcript=INFO
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n

# JSON Configuration
spring.jackson.serialization.indent-output=true
```

### 3. TranscriptApplication.java (Main Application)

```java
package com.university.transcript;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import com.university.transcript.service.TranscriptManager;

/**
 * Main Spring Boot Application
 * Entry point for the University Transcript System
 */
@SpringBootApplication
public class TranscriptApplication {

    public static void main(String[] args) {
        SpringApplication.run(TranscriptApplication.class, args);
        System.out.println("🎓 University Transcript System Started!");
        System.out.println("📡 API available at: http://localhost:8080/api/transcripts");
    }

    /**
     * Initialize demo data on application startup
     */
    @Bean
    public CommandLineRunner initData(TranscriptManager transcriptManager) {
        return args -> {
            System.out.println("🔄 Initializing demo data...");
            transcriptManager.initializeDemoData();
            System.out.println("✅ Demo data loaded successfully!");
        };
    }
}
```

### 4. Model Classes

#### Student.java
```java
package com.university.transcript.model;

import java.io.Serializable;
import java.util.Objects;

/**
 * Student Entity
 * Represents a university student
 */
public class Student implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String studentId;
    private String studentName;
    private String email;
    private String major;
    
    // Constructors
    public Student() {}
    
    public Student(String studentId, String studentName, String email, String major) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.email = email;
        this.major = major;
    }
    
    // Getters and Setters
    public String getStudentId() {
        return studentId;
    }
    
    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }
    
    public String getStudentName() {
        return studentName;
    }
    
    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getMajor() {
        return major;
    }
    
    public void setMajor(String major) {
        this.major = major;
    }
    
    // Override equals and hashCode for proper HashMap operations
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Student student = (Student) o;
        return Objects.equals(studentId, student.studentId);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(studentId);
    }
    
    @Override
    public String toString() {
        return "Student{" +
                "studentId='" + studentId + '\'' +
                ", studentName='" + studentName + '\'' +
                ", email='" + email + '\'' +
                ", major='" + major + '\'' +
                '}';
    }
}
```

#### Course.java
```java
package com.university.transcript.model;

import java.io.Serializable;
import java.util.Objects;

/**
 * Course Entity
 * Represents a university course with grade
 */
public class Course implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String courseCode;
    private String courseName;
    private int credits;
    private String grade;
    
    // Constructors
    public Course() {}
    
    public Course(String courseCode, String courseName, int credits, String grade) {
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.credits = credits;
        this.grade = grade;
    }
    
    // Getters and Setters
    public String getCourseCode() {
        return courseCode;
    }
    
    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }
    
    public String getCourseName() {
        return courseName;
    }
    
    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }
    
    public int getCredits() {
        return credits;
    }
    
    public void setCredits(int credits) {
        this.credits = credits;
    }
    
    public String getGrade() {
        return grade;
    }
    
    public void setGrade(String grade) {
        this.grade = grade;
    }
    
    /**
     * Convert letter grade to GPA points
     * @return GPA point value for the grade
     */
    public double getGradePoint() {
        return switch (grade.toUpperCase()) {
            case "A" -> 4.0;
            case "A-" -> 3.7;
            case "B+" -> 3.3;
            case "B" -> 3.0;
            case "B-" -> 2.7;
            case "C+" -> 2.3;
            case "C" -> 2.0;
            case "C-" -> 1.7;
            case "D+" -> 1.3;
            case "D" -> 1.0;
            case "F" -> 0.0;
            default -> 0.0;
        };
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Course course = (Course) o;
        return Objects.equals(courseCode, course.courseCode);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(courseCode);
    }
    
    @Override
    public String toString() {
        return "Course{" +
                "courseCode='" + courseCode + '\'' +
                ", courseName='" + courseName + '\'' +
                ", credits=" + credits +
                ", grade='" + grade + '\'' +
                '}';
    }
}
```

#### Transcript.java
```java
package com.university.transcript.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Transcript Entity
 * Represents a student's complete academic transcript
 */
public class Transcript implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private Student student;
    private List<Course> courses;
    private double gpa;
    
    // Constructors
    public Transcript() {
        this.courses = new ArrayList<>();
        this.gpa = 0.0;
    }
    
    public Transcript(Student student) {
        this.student = student;
        this.courses = new ArrayList<>();
        this.gpa = 0.0;
    }
    
    // Getters and Setters
    public Student getStudent() {
        return student;
    }
    
    public void setStudent(Student student) {
        this.student = student;
    }
    
    public List<Course> getCourses() {
        return courses;
    }
    
    public void setCourses(List<Course> courses) {
        this.courses = courses;
        calculateGPA();
    }
    
    public double getGpa() {
        return gpa;
    }
    
    public void setGpa(double gpa) {
        this.gpa = gpa;
    }
    
    // Convenience getters for JSON serialization
    public String getStudentId() {
        return student != null ? student.getStudentId() : null;
    }
    
    public String getStudentName() {
        return student != null ? student.getStudentName() : null;
    }
    
    public String getEmail() {
        return student != null ? student.getEmail() : null;
    }
    
    public String getMajor() {
        return student != null ? student.getMajor() : null;
    }
    
    /**
     * Add a course to the transcript
     * @param course Course to add
     */
    public void addCourse(Course course) {
        // Update existing course or add new
        courses.removeIf(c -> c.getCourseCode().equals(course.getCourseCode()));
        courses.add(course);
        calculateGPA();
    }
    
    /**
     * Calculate GPA based on all courses
     * GPA = Sum(Grade Points × Credits) / Sum(Credits)
     */
    public void calculateGPA() {
        if (courses.isEmpty()) {
            this.gpa = 0.0;
            return;
        }
        
        double totalPoints = courses.stream()
                .mapToDouble(c -> c.getGradePoint() * c.getCredits())
                .sum();
        
        int totalCredits = courses.stream()
                .mapToInt(Course::getCredits)
                .sum();
        
        this.gpa = totalCredits > 0 ? totalPoints / totalCredits : 0.0;
    }
    
    @Override
    public String toString() {
        return "Transcript{" +
                "student=" + student +
                ", courses=" + courses.size() +
                ", gpa=" + String.format("%.2f", gpa) +
                '}';
    }
}
```

### 5. Service Layer

#### TranscriptService.java (Interface)
```java
package com.university.transcript.service;

import com.university.transcript.model.Course;
import com.university.transcript.model.Transcript;
import java.util.List;
import java.util.Map;

/**
 * Service Interface for Transcript Management
 * Follows Interface Segregation Principle
 */
public interface TranscriptService {
    
    /**
     * Create a new student transcript
     */
    Transcript createTranscript(String studentId, String studentName, String email, String major);
    
    /**
     * Add or update a course grade for a student
     */
    Transcript updateGrade(String studentId, Course course);
    
    /**
     * Get transcript by student ID
     */
    Transcript getTranscript(String studentId);
    
    /**
     * Get all transcripts
     */
    List<Transcript> getAllTranscripts();
    
    /**
     * Get top performers (GPA >= 3.5)
     */
    List<Transcript> getTopPerformers();
    
    /**
     * Calculate average GPA across all students
     */
    double getAverageGPA();
    
    /**
     * Group students by course
     */
    Map<String, List<Transcript>> groupByCourse();
    
    /**
     * Save all transcripts to file
     */
    void saveToFile();
    
    /**
     * Load transcripts from file
     */
    void loadFromFile();
}
```

#### TranscriptManager.java (Service Implementation)
```java
package com.university.transcript.service;

import com.university.transcript.exception.TranscriptNotFoundException;
import com.university.transcript.model.Course;
import com.university.transcript.model.Student;
import com.university.transcript.model.Transcript;
import com.university.transcript.util.FileStorageUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * TranscriptManager Service Implementation
 * Thread-safe singleton service using ConcurrentHashMap
 * Demonstrates SOLID principles and Java best practices
 */
@Service
public class TranscriptManager implements TranscriptService {
    
    // Thread-safe storage using ConcurrentHashMap
    private final Map<String, Transcript> transcripts = new ConcurrentHashMap<>();
    
    @Value("${app.data.file:src/main/resources/data/transcripts.json}")
    private String dataFilePath;
    
    /**
     * Create a new student transcript
     * Demonstrates Single Responsibility Principle
     */
    @Override
    public synchronized Transcript createTranscript(String studentId, String studentName, 
                                                   String email, String major) {
        if (transcripts.containsKey(studentId)) {
            throw new IllegalArgumentException("Transcript already exists for student: " + studentId);
        }
        
        Student student = new Student(studentId, studentName, email, major);
        Transcript transcript = new Transcript(student);
        transcripts.put(studentId, transcript);
        
        saveToFile();
        return transcript;
    }
    
    /**
     * Update student grade
     * Automatically recalculates GPA
     */
    @Override
    public synchronized Transcript updateGrade(String studentId, Course course) {
        Transcript transcript = getTranscript(studentId);
        transcript.addCourse(course);
        
        saveToFile();
        return transcript;
    }
    
    /**
     * Get transcript by student ID
     * Throws custom exception if not found
     */
    @Override
    public Transcript getTranscript(String studentId) {
        Transcript transcript = transcripts.get(studentId);
        if (transcript == null) {
            throw new TranscriptNotFoundException("Transcript not found for student: " + studentId);
        }
        return transcript;
    }
    
    /**
     * Get all transcripts
     */
    @Override
    public List<Transcript> getAllTranscripts() {
        return new ArrayList<>(transcripts.values());
    }
    
    /**
     * Get top performers using Streams API
     * Demonstrates functional programming
     */
    @Override
    public List<Transcript> getTopPerformers() {
        return transcripts.values().stream()
                .filter(t -> t.getGpa() >= 3.5)
                .sorted((t1, t2) -> Double.compare(t2.getGpa(), t1.getGpa()))
                .collect(Collectors.toList());
    }
    
    /**
     * Calculate average GPA using Streams API
     */
    @Override
    public double getAverageGPA() {
        return transcripts.values().stream()
                .mapToDouble(Transcript::getGpa)
                .average()
                .orElse(0.0);
    }
    
    /**
     * Group students by course
     * Demonstrates advanced Stream operations
     */
    @Override
    public Map<String, List<Transcript>> groupByCourse() {
        Map<String, List<Transcript>> grouped = new HashMap<>();
        
        for (Transcript transcript : transcripts.values()) {
            for (Course course : transcript.getCourses()) {
                grouped.computeIfAbsent(course.getCourseCode(), k -> new ArrayList<>())
                        .add(transcript);
            }
        }
        
        return grouped;
    }
    
    /**
     * Save transcripts to file (File I/O)
     * Demonstrates serialization
     */
    @Override
    public void saveToFile() {
        try {
            FileStorageUtil.saveTranscripts(new ArrayList<>(transcripts.values()), dataFilePath);
        } catch (Exception e) {
            System.err.println("Error saving to file: " + e.getMessage());
        }
    }
    
    /**
     * Load transcripts from file
     */
    @Override
    public void loadFromFile() {
        try {
            List<Transcript> loaded = FileStorageUtil.loadTranscripts(dataFilePath);
            transcripts.clear();
            loaded.forEach(t -> transcripts.put(t.getStudentId(), t));
            System.out.println("✅ Loaded " + transcripts.size() + " transcripts from file");
        } catch (Exception e) {
            System.out.println("ℹ️ No existing data file found. Starting fresh.");
        }
    }
    
    /**
     * Initialize demo data for testing
     */
    public void initializeDemoData() {
        loadFromFile();
        
        if (transcripts.isEmpty()) {
            // Create demo students
            createTranscript("S001", "Alice Johnson", "alice@university.edu", "Computer Science");
            createTranscript("S002", "Bob Smith", "bob@university.edu", "Mathematics");
            createTranscript("S003", "Carol White", "carol@university.edu", "Physics");
            
            // Add demo grades
            updateGrade("S001", new Course("CS101", "Intro to Programming", 3, "A"));
            updateGrade("S001", new Course("CS102", "Data Structures", 4, "A-"));
            updateGrade("S001", new Course("MATH201", "Calculus I", 3, "B+"));
            
            updateGrade("S002", new Course("MATH201", "Calculus I", 3, "A"));
            updateGrade("S002", new Course("MATH202", "Calculus II", 3, "A"));
            
            updateGrade("S003", new Course("PHYS101", "Physics I", 4, "B+"));
            updateGrade("S003", new Course("CS101", "Intro to Programming", 3, "A"));
            
            System.out.println("✅ Demo data created: 3 students with grades");
        }
    }
}
```

### 6. Controller Layer

#### TranscriptController.java
```java
package com.university.transcript.controller;

import com.university.transcript.model.Course;
import com.university.transcript.model.Transcript;
import com.university.transcript.service.TranscriptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for Transcript Management
 * Exposes RESTful API endpoints
 */
@RestController
@RequestMapping("/api/transcripts")
@CrossOrigin(origins = "http://localhost:3000")
public class TranscriptController {
    
    private final TranscriptService transcriptService;
    
    @Autowired
    public TranscriptController(TranscriptService transcriptService) {
        this.transcriptService = transcriptService;
    }
    
    /**
     * Create new transcript
     * POST /api/transcripts/create
     */
    @PostMapping("/create")
    public ResponseEntity<Transcript> createTranscript(@RequestBody Map<String, String> request) {
        String studentId = request.get("studentId");
        String studentName = request.get("studentName");
        String email = request.get("email");
        String major = request.get("major");
        
        Transcript transcript = transcriptService.createTranscript(studentId, studentName, email, major);
        return ResponseEntity.status(HttpStatus.CREATED).body(transcript);
    }
    
    /**
     * Update student grade
     * PUT /api/transcripts/{studentId}/grades
     */
    @PutMapping("/{studentId}/grades")
    public ResponseEntity<Transcript> updateGrade(
            @PathVariable String studentId,
            @RequestBody Course course) {
        
        Transcript transcript = transcriptService.updateGrade(studentId, course);
        return ResponseEntity.ok(transcript);
    }
    
    /**
     * Get transcript by student ID
     * GET /api/transcripts/{studentId}
     */
    @GetMapping("/{studentId}")
    public ResponseEntity<Transcript> getTranscript(@PathVariable String studentId) {
        Transcript transcript = transcriptService.getTranscript(studentId);
        return ResponseEntity.ok(transcript);
    }
    
    /**
     * Get all transcripts
     * GET /api/transcripts
     */
    @GetMapping
    public ResponseEntity<List<Transcript>> getAllTranscripts() {
        List<Transcript> transcripts = transcriptService.getAllTranscripts();
        return ResponseEntity.ok(transcripts);
    }
    
    /**
     * Get top performers (GPA >= 3.5)
     * GET /api/transcripts/top-performers
     */
    @GetMapping("/top-performers")
    public ResponseEntity<List<Transcript>> getTopPerformers() {
        List<Transcript> topPerformers = transcriptService.getTopPerformers();
        return ResponseEntity.ok(topPerformers);
    }
    
    /**
     * Get average GPA
     * GET /api/transcripts/average-gpa
     */
    @GetMapping("/average-gpa")
    public ResponseEntity<Double> getAverageGPA() {
        double avgGPA = transcriptService.getAverageGPA();
        return ResponseEntity.ok(avgGPA);
    }
    
    /**
     * Group students by course
     * GET /api/transcripts/group-by-course
     */
    @GetMapping("/group-by-course")
    public ResponseEntity<Map<String, List<Transcript>>> groupByCourse() {
        Map<String, List<Transcript>> grouped = transcriptService.groupByCourse();
        return ResponseEntity.ok(grouped);
    }
}
```

### 7. Exception Handling

#### TranscriptNotFoundException.java
```java
package com.university.transcript.exception;

/**
 * Custom exception for transcript not found scenarios
 */
public class TranscriptNotFoundException extends RuntimeException {
    
    public TranscriptNotFoundException(String message) {
        super(message);
    }
    
    public TranscriptNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

#### GlobalExceptionHandler.java
```java
package com.university.transcript.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global Exception Handler
 * Provides consistent error responses across the API
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(TranscriptNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleTranscriptNotFound(TranscriptNotFoundException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.NOT_FOUND.value());
        error.put("error", "Not Found");
        error.put("message", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.BAD_REQUEST.value());
        error.put("error", "Bad Request");
        error.put("message", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        error.put("error", "Internal Server Error");
        error.put("message", "An unexpected error occurred");
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

### 8. File Storage Utility

#### FileStorageUtil.java
```java
package com.university.transcript.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.university.transcript.model.Transcript;

import java.io.*;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

/**
 * File Storage Utility
 * Handles JSON serialization and file I/O operations
 */
public class FileStorageUtil {
    
    private static final Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .create();
    
    /**
     * Save transcripts to JSON file
     */
    public static void saveTranscripts(List<Transcript> transcripts, String filePath) throws IOException {
        // Create directories if they don't exist
        Path path = Paths.get(filePath);
        Files.createDirectories(path.getParent());
        
        // Write JSON to file
        try (Writer writer = new FileWriter(filePath)) {
            gson.toJson(transcripts, writer);
        }
    }
    
    /**
     * Load transcripts from JSON file
     */
    public static List<Transcript> loadTranscripts(String filePath) throws IOException {
        File file = new File(filePath);
        if (!file.exists()) {
            return new ArrayList<>();
        }
        
        try (Reader reader = new FileReader(filePath)) {
            Type listType = new TypeToken<List<Transcript>>(){}.getType();
            List<Transcript> transcripts = gson.fromJson(reader, listType);
            return transcripts != null ? transcripts : new ArrayList<>();
        }
    }
}
```

### 9. CORS Configuration

#### CorsConfig.java
```java
package com.university.transcript.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS Configuration
 * Allows frontend to communicate with backend
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000") // Next.js frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

---

## 🏃 Running the Application

### Step 1: Build the Project
```bash
mvn clean install
```

### Step 2: Run the Application
```bash
mvn spring-boot:run
```

Or run from your IDE:
- Right-click `TranscriptApplication.java`
- Select "Run TranscriptApplication"

### Step 3: Verify
- Backend running at: `http://localhost:8080`
- Test endpoint: `http://localhost:8080/api/transcripts`

---

## 📡 API Documentation

### Base URL
```
http://localhost:8080/api/transcripts
```

### Endpoints

#### 1. Create Transcript
```http
POST /api/transcripts/create
Content-Type: application/json

{
  "studentId": "S12345",
  "studentName": "John Doe",
  "email": "john.doe@university.edu",
  "major": "Computer Science"
}
```

**Response:**
```json
{
  "studentId": "S12345",
  "studentName": "John Doe",
  "email": "john.doe@university.edu",
  "major": "Computer Science",
  "courses": [],
  "gpa": 0.0
}
```

#### 2. Update Grade
```http
PUT /api/transcripts/S12345/grades
Content-Type: application/json

{
  "courseCode": "CS101",
  "courseName": "Introduction to Programming",
  "credits": 3,
  "grade": "A"
}
```

#### 3. Get Transcript
```http
GET /api/transcripts/S12345
```

#### 4. Get Top Performers
```http
GET /api/transcripts/top-performers
```

#### 5. Get Average GPA
```http
GET /api/transcripts/average-gpa
```

#### 6. Group by Course
```http
GET /api/transcripts/group-by-course
```

---

## 🧪 Testing

### Unit Tests

#### TranscriptManagerTest.java
```java
package com.university.transcript.service;

import com.university.transcript.model.Course;
import com.university.transcript.model.Transcript;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class TranscriptManagerTest {
    
    @Autowired
    private TranscriptManager transcriptManager;
    
    @BeforeEach
    void setUp() {
        // Clear data before each test
    }
    
    @Test
    void testCreateTranscript() {
        Transcript transcript = transcriptManager.createTranscript(
            "TEST001", "Test Student", "test@university.edu", "CS"
        );
        
        assertNotNull(transcript);
        assertEquals("TEST001", transcript.getStudentId());
        assertEquals("Test Student", transcript.getStudentName());
    }
    
    @Test
    void testUpdateGrade() {
        transcriptManager.createTranscript(
            "TEST002", "Test Student", "test@university.edu", "CS"
        );
        
        Course course = new Course("CS101", "Intro to CS", 3, "A");
        Transcript transcript = transcriptManager.updateGrade("TEST002", course);
        
        assertEquals(1, transcript.getCourses().size());
        assertEquals(4.0, transcript.getGpa(), 0.01);
    }
    
    @Test
    void testCalculateGPA() {
        transcriptManager.createTranscript(
            "TEST003", "Test Student", "test@university.edu", "CS"
        );
        
        transcriptManager.updateGrade("TEST003", new Course("CS101", "Course 1", 3, "A"));
        transcriptManager.updateGrade("TEST003", new Course("CS102", "Course 2", 3, "B"));
        
        Transcript transcript = transcriptManager.getTranscript("TEST003");
        assertEquals(3.5, transcript.getGpa(), 0.01); // (4.0 + 3.0) / 2
    }
}
```

### Run Tests
```bash
mvn test
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```
Error: Port 8080 already in use
```
**Solution**: Change port in `application.properties`:
```properties
server.port=8081
```

#### 2. CORS Errors
```
Access to fetch at 'http://localhost:8080' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution**: Verify `CorsConfig.java` includes `http://localhost:3000`

#### 3. File Not Found
```
Error saving to file: No such file or directory
```
**Solution**: Create data directory:
```bash
mkdir -p src/main/resources/data
```

#### 4. Maven Dependencies Not Found
```
Could not resolve dependencies
```
**Solution**:
```bash
mvn clean install -U
```

---

## 📚 Learning Resources

### Java Concepts Demonstrated
- ✅ Object-Oriented Programming (OOP)
- ✅ Collections Framework (HashMap, ArrayList)
- ✅ Streams API and Lambda Expressions
- ✅ File I/O and Serialization (JSON)
- ✅ Exception Handling
- ✅ Concurrency (ConcurrentHashMap)
- ✅ Design Patterns (Singleton, Strategy)

### Spring Boot Concepts
- ✅ Dependency Injection (@Autowired)
- ✅ REST Controllers (@RestController)
- ✅ Service Layer (@Service)
- ✅ Exception Handling (@RestControllerAdvice)
- ✅ Configuration (@Configuration)
- ✅ CORS Configuration

### SOLID Principles
- **S**: Single Responsibility - Each class has one job
- **O**: Open/Closed - Extensible via interfaces
- **L**: Liskov Substitution - Course hierarchy
- **I**: Interface Segregation - TranscriptService interface
- **D**: Dependency Inversion - Depends on abstractions

---

## 🚀 Next Steps

1. **Add Database**: Replace file storage with PostgreSQL/MySQL
2. **Add Authentication**: Implement Spring Security
3. **Add Validation**: Use Bean Validation annotations
4. **Add Pagination**: For large datasets
5. **Add Search**: Full-text search functionality
6. **Add Caching**: Redis for performance
7. **Add Swagger**: API documentation with Swagger UI

---

## 📞 Support

For questions or issues:
1. Check logs in console
2. Verify all dependencies are installed
3. Ensure Java 17+ is being used
4. Check CORS configuration
5. Verify frontend is hitting correct endpoints

---

**Happy Coding! 🎓**
