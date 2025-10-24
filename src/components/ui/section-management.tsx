"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Users, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { createSectionSchema, type CreateSectionInput } from "@/lib/validation";
import { useRole } from "@/hooks/use-role";

interface Section {
  id: number;
  sectionCode: string;
  name: string;
  teacherId: number;
  teacherName: string;
  studentCount: number;
  createdAt: string;
}

export function SectionManagement() {
  const { canCreateCourses, canDeleteCourses, isLoading: roleLoading } = useRole();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [loadingSections, setLoadingSections] = useState(true);

  const form = useForm<CreateSectionInput>({
    resolver: zodResolver(createSectionSchema),
    defaultValues: {
      sectionCode: "",
      name: "",
    },
  });

  // Fetch sections
  const fetchSections = async () => {
    setLoadingSections(true);
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
      toast.error("Failed to load sections");
    } finally {
      setLoadingSections(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  // Create section handler
  const handleCreateSection = async (data: CreateSectionInput) => {
    setLoading("create");
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/sections", {
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
          toast.error("Only teachers and administrators can create sections");
        } else {
          toast.error(error.error || "Failed to create section");
        }
        return;
      }

      const result = await response.json();
      toast.success(`Section ${result.sectionCode} created successfully!`);
      form.reset();
      fetchSections();
    } catch (err: any) {
      toast.error(err.message || "Error creating section");
    } finally {
      setLoading(null);
    }
  };

  // Delete section handler
  const handleDeleteSection = async (sectionId: number, sectionCode: string, studentCount: number) => {
    const message = studentCount > 0
      ? `Are you sure you want to delete section ${sectionCode}? This will remove ${studentCount} student enrollment(s). This action cannot be undone.`
      : `Are you sure you want to delete section ${sectionCode}? This action cannot be undone.`;

    if (!confirm(message)) {
      return;
    }

    setLoading(`delete-${sectionId}`);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/sections/${sectionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 403) {
          toast.error("Only administrators can delete sections");
        } else {
          toast.error(error.error || "Failed to delete section");
        }
        return;
      }

      const result = await response.json();
      if (result.deletedEnrollments > 0) {
        toast.success(`Section ${sectionCode} deleted successfully (${result.deletedEnrollments} enrollments removed)`);
      } else {
        toast.success(`Section ${sectionCode} deleted successfully`);
      }
      fetchSections();
    } catch (err: any) {
      toast.error(err.message || "Error deleting section");
    } finally {
      setLoading(null);
    }
  };

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Section Form */}
      {canCreateCourses && (
        <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg border-2 border-blue-100 dark:border-blue-900/50">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add New Section
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Create a new section to organize your courses and students
            </p>
          </div>

          <form onSubmit={form.handleSubmit(handleCreateSection)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sectionCode" className="text-gray-700 dark:text-gray-300">
                  Section Code *
                </Label>
                <Input
                  id="sectionCode"
                  {...form.register("sectionCode")}
                  placeholder="e.g., S4"
                  className="mt-1 border-blue-200 focus:border-blue-500"
                />
                {form.formState.errors.sectionCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.sectionCode.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                  Section Name *
                </Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="e.g., Advanced Programming"
                  className="mt-1 border-blue-200 focus:border-blue-500"
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading === "create"}
            >
              {loading === "create" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Section...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Section
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
                Only teachers and administrators can create new sections.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Sections List */}
      <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Users className="w-5 h-5 mr-2" />
            All Sections
          </h3>
          <Badge className="bg-blue-600 text-white">
            {sections.length} {sections.length === 1 ? "Section" : "Sections"}
          </Badge>
        </div>

        {loadingSections ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : sections.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No sections available. Create your first section above!
          </p>
        ) : (
          <div className="space-y-3">
            {sections.map((section) => (
              <div
                key={section.id}
                className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {section.sectionCode}
                      </h4>
                      <span className="text-gray-600 dark:text-gray-400">-</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {section.name}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 flex-wrap text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Teacher: <span className="font-medium">{section.teacherName}</span>
                      </span>
                      <Badge className="bg-green-600 text-white">
                        <Users className="w-3 h-3 mr-1" />
                        {section.studentCount} {section.studentCount === 1 ? "Student" : "Students"}
                      </Badge>
                    </div>
                  </div>

                  {canDeleteCourses && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteSection(section.id, section.sectionCode, section.studentCount)}
                      disabled={loading === `delete-${section.id}`}
                      className="shrink-0"
                    >
                      {loading === `delete-${section.id}` ? (
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
