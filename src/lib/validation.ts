import { z } from "zod";

/**
 * Validation schema for creating a new transcript
 */
export const createTranscriptSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  studentName: z.string().min(1, "Student name is required"),
  email: z.string().email("Invalid email address"),
  major: z.string().min(1, "Major is required"),
  sectionId: z.coerce.number().optional(),
});

/**
 * Validation schema for updating grades
 */
export const updateGradesSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  courseCode: z.string().min(1, "Course code is required"),
  courseName: z.string().min(1, "Course name is required"),
  credits: z.coerce.number().min(1, "Credits must be at least 1").max(6, "Credits cannot exceed 6"),
  grade: z.string().min(1, "Grade is required").max(2, "Grade must be 1-2 characters"),
  sectionId: z.coerce.number().optional(),
});

/**
 * Validation schema for viewing transcript
 */
export const viewTranscriptSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  sectionId: z.coerce.number().optional(),
});

/**
 * Validation schema for creating a new course
 */
export const createCourseSchema = z.object({
  courseCode: z.string().min(1, "Course code is required").max(20, "Course code too long"),
  courseName: z.string().min(1, "Course name is required").max(200, "Course name too long"),
  sectionId: z.coerce.number().optional(),
});

/**
 * Validation schema for creating a new section
 */
export const createSectionSchema = z.object({
  sectionCode: z.string().min(1, "Section code is required").max(20, "Section code too long"),
  name: z.string().min(1, "Section name is required").max(200, "Section name too long"),
});

export type CreateTranscriptInput = z.infer<typeof createTranscriptSchema>;
export type UpdateGradesInput = z.infer<typeof updateGradesSchema>;
export type ViewTranscriptInput = z.infer<typeof viewTranscriptSchema>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type CreateSectionInput = z.infer<typeof createSectionSchema>;