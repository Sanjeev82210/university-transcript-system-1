"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2, BookOpen, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { createCourseSchema, type CreateCourseInput } from "@/lib/validation";
import { useRole } from "@/hooks/use-role";

interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  sectionId: number | null;
  sectionName: string | null;
  teacherId: number;
  teacherName: string;
  createdAt: string;
  updatedAt: string;
}

interface Section {
  id: number;
  sectionCode: string;
  name: string;
}

/**
 * Course Management Component
 * KL University example courses are used as placeholders:
 * - 24UC0022 SOCIAL IMMERSIVE LEARNING
 * - 24SDCS01 FRONT END DEVELOPMENT FRAMEWORKS
 * - 24MT2019 PROBABILITY AND STATISTICS
 * - 24CS2202 COMPUTER NETWORKS
 * - 24AD2001 ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING
 */
export function CourseManagement() {
  const { canCreateCourses, canDeleteCourses, isLoading: roleLoading } = useRole();
  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const form = useForm<CreateCourseInput>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      courseCode: "",
      courseName: "",
      sectionId: undefined,
    },
  });

  // Fetch courses
  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const response = await fetch("/api/courses");
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCourses(data);
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      toast.error("Failed to load courses");
    } finally {
      setLoadingCourses(false);
    }
  };

  // Fetch sections
  const fetchSections = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/sections", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch sections");
      const data = await response.json();
      setSections(data);
    } catch (err: any) {
      console.error("Error fetching sections:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchSections();
    // Demo: Log KL University example courses for reference
    console.log('Loaded KL University course examples: 24UC0022, 24SDCS01, 24MT2019, 24CS2202, 24AD2001');
  }, []);

  // Create course handler
  const handleCreateCourse = async (data: CreateCourseInput) => {
    setLoading("create");
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 403) {
          toast.error("Only teachers and administrators can create courses");
        } else {
          toast.error(error.error || "Failed to create course");
        }
        return;
      }

      const result = await response.json();
      toast.success(`Added KL-style course ${result.courseCode} successfully!`);
      form.reset();
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || "Error creating course");
    } finally {
      setLoading(null);
    }
  };

  // Delete course handler (admin only)
  const handleDeleteCourse = async (courseId: number, courseCode: string) => {
    if (!confirm(`Are you sure you want to delete course ${courseCode}? This action cannot be undone.`)) {
      return;
    }

    setLoading(`delete-${courseId}`);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 403) {
          toast.error("Only administrators can delete courses");
        } else {
          toast.error(error.error || "Failed to delete course");
        }
        return;
      }

      toast.success(`Course ${courseCode} deleted successfully (admin action)`);
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || "Error deleting course");
    } finally {
      setLoading(null);
    }
  };

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Course Form */}
      {canCreateCourses && (
        <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg border-2 border-purple-100 dark:border-purple-900/50">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-purple-700 dark:text-purple-400 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add New Course
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Create a new course (use KL University format) and optionally assign it to a section
            </p>
          </div>

          <form onSubmit={form.handleSubmit(handleCreateCourse)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="courseCode" className="text-gray-700 dark:text-gray-300">
                  Course Code * <span className="text-xs text-gray-500">(e.g., 24UC0022)</span>
                </Label>
                <Input
                  id="courseCode"
                  {...form.register("courseCode")}
                  placeholder="e.g., 24UC0022"
                  className="mt-1 border-purple-200 focus:border-purple-500"
                />
                {form.formState.errors.courseCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.courseCode.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="courseName" className="text-gray-700 dark:text-gray-300">
                  Course Name * <span className="text-xs text-gray-500">(e.g., SOCIAL IMMERSIVE LEARNING)</span>
                </Label>
                <Input
                  id="courseName"
                  {...form.register("courseName")}
                  placeholder="e.g., FRONT END DEVELOPMENT FRAMEWORKS"
                  className="mt-1 border-purple-200 focus:border-purple-500"
                />
                {form.formState.errors.courseName && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.courseName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="sectionId" className="text-gray-700 dark:text-gray-300">
                Assign to Section (Optional)
              </Label>
              <Select
                onValueChange={(value) => 
                  form.setValue("sectionId", value === "none" ? undefined : parseInt(value))
                }
                defaultValue="none"
              >
                <SelectTrigger className="mt-1 border-purple-200 focus:border-purple-500">
                  <SelectValue placeholder="Select section (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Section (Unassigned)</SelectItem>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id.toString()}>
                      {section.sectionCode}: {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={loading === "create"}
            >
              {loading === "create" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Course...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Course
                </>
              )}
            </Button>
          </form>
        </Card>
      )}

      {!canCreateCourses && (
        <Card className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
                Teacher or Admin Access Required
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                Only teachers and administrators can create new courses.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Courses List */}
      <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            All Courses
          </h3>
          <Badge className="bg-purple-600 text-white">
            {courses.length} {courses.length === 1 ? "Course" : "Courses"}
          </Badge>
        </div>

        {loadingCourses ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          </div>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No courses available. Create your first course above! (Try KL format: 24UC0022 - SOCIAL IMMERSIVE LEARNING)
          </p>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {course.courseCode}
                      </h4>
                      <span className="text-gray-600 dark:text-gray-400">-</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {course.courseName}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 flex-wrap text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Teacher: <span className="font-medium">{course.teacherName}</span>
                      </span>
                      {course.sectionName ? (
                        <Badge className="bg-blue-600 text-white">
                          Section: {course.sectionName}
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-500 text-white">
                          No Section
                        </Badge>
                      )}
                    </div>
                  </div>

                  {canDeleteCourses && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCourse(course.id, course.courseCode)}
                      disabled={loading === `delete-${course.id}`}
                      className="shrink-0"
                      title="Delete course (admin only)"
                    >
                      {loading === `delete-${course.id}` ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}