"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, ArrowLeft, Loader2, FileText, Edit, BarChart3, Calculator, Award, Percent, LogOut, User, BookOpen, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { TranscriptAnalyticsDashboard } from "@/components/ui/transcript-analytics-dashboard";
import { CourseManagement } from "@/components/ui/course-management";
import { SectionManagement } from "@/components/ui/section-management";
import { authClient, useSession } from "@/lib/auth-client";
import { useRole } from "@/hooks/use-role";
import { getRoleDisplayName, getRoleBadgeColor } from "@/lib/rbac";
import {
  createTranscriptSchema,
  updateGradesSchema,
  viewTranscriptSchema,
  type CreateTranscriptInput,
  type UpdateGradesInput,
  type ViewTranscriptInput,
} from "@/lib/validation";

// API Base URL - Change this to your Spring Boot backend URL
const API_BASE_URL = "http://localhost:8080/api/transcripts";

// Section interface
interface Section {
  id: number;
  sectionCode: string;
  name: string;
  teacherId: number;
  teacherName: string;
  studentCount: number;
  createdAt: string;
}

// Course interface for KL University examples
// Examples: 24UC0022, 24SDCS01, 24MT2019, 24CS2202, 24AD2001
interface Course {
  code: string;
  name: string;
}

// Student Icon Component
const StudentIcon = ({
  letter,
  className,
}: {
  letter: string;
  className?: string;
}) => (
  <div
    className={`w-9 h-9 flex items-center justify-center rounded-full font-bold text-white text-sm ${className}`}
  >
    {letter}
  </div>
);

export default function Dashboard() {
  const { data: session, isPending, refetch } = useSession();
  const { role, isLoading: roleLoading } = useRole();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("create");
  
  // Section management state
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("all");
  const [loadingSections, setLoadingSections] = useState(true);

  // KL University example courses for demo/reference
  const [exampleCourses] = useState<Course[]>([
    { code: '24UC0022', name: 'SOCIAL IMMERSIVE LEARNING' },
    { code: '24SDCS01', name: 'FRONT END DEVELOPMENT FRAMEWORKS' },
    { code: '24MT2019', name: 'PROBABILITY AND STATISTICS' },
    { code: '24CS2202', name: 'COMPUTER NETWORKS' },
    { code: '24AD2001', name: 'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING' },
  ]);

  // Form for Create Transcript - MUST be called before any early returns
  const createForm = useForm<CreateTranscriptInput>({
    resolver: zodResolver(createTranscriptSchema),
    defaultValues: {
      studentId: "",
      studentName: "",
      email: "",
      major: "",
      sectionId: undefined,
    },
  });

  // Form for Update Grades - MUST be called before any early returns
  const gradeForm = useForm<UpdateGradesInput>({
    resolver: zodResolver(updateGradesSchema),
    defaultValues: {
      studentId: "",
      courseCode: "",
      courseName: "",
      credits: 3,
      grade: "",
      sectionId: undefined,
    },
  });

  // Form for View Transcript - MUST be called before any early returns
  const viewForm = useForm<ViewTranscriptInput>({
    resolver: zodResolver(viewTranscriptSchema),
    defaultValues: {
      studentId: "",
      sectionId: undefined,
    },
  });

  // Protect route - redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Fetch teacher's sections on mount
  useEffect(() => {
    const fetchSections = async () => {
      if (!session?.user) return;
      
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
        
        // Auto-select first section if available
        if (data.length > 0 && selectedSectionId === "all") {
          setSelectedSectionId(data[0].id.toString());
        }
      } catch (err: any) {
        console.error("Error fetching sections:", err);
        toast.error("Failed to load sections");
      } finally {
        setLoadingSections(false);
      }
    };

    if (session?.user) {
      fetchSections();
      // Demo: Log KL University example courses loaded
      console.log('Loaded KL University examples: 24UC0022, 24SDCS01, 24MT2019, 24CS2202, 24AD2001');
      // Show demo toast on first load
      toast.info('Demo with KL University courses', {
        description: 'Example courses: 24UC0022, 24SDCS01, 24MT2019, 24CS2202, 24AD2001',
      });
    }
  }, [session]);

  // Update form section values when section changes
  useEffect(() => {
    const sectionId = selectedSectionId === "all" ? undefined : parseInt(selectedSectionId);
    createForm.setValue("sectionId", sectionId);
    gradeForm.setValue("sectionId", sectionId);
    viewForm.setValue("sectionId", sectionId);
  }, [selectedSectionId, createForm, gradeForm, viewForm]);

  // Sign out handler
  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error(error.code);
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      toast.success("Signed out successfully");
      router.push("/");
    }
  };

  // Show loading state while checking authentication
  if (isPending || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session?.user) return null;

  // Create Transcript Handler
  const handleCreateTranscript = async (data: CreateTranscriptInput) => {
    setLoading("create");
    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create transcript");

      const result = await response.json();
      
      // Assign student to section if sectionId provided
      // Assign to section e.g., S-10-MA with KL course 24SDCS01
      if (data.sectionId) {
        try {
          const token = localStorage.getItem("bearer_token");
          await fetch(`/api/sections/${data.sectionId}/students`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ studentId: data.studentId }),
          });
        } catch (err) {
          console.error("Failed to assign student to section:", err);
        }
      }
      
      toast.success(`Transcript created successfully for ${result.studentName}!`);
      createForm.reset();
    } catch (err: any) {
      toast.error(err.message || "Error creating transcript");
    } finally {
      setLoading(null);
    }
  };

  // Update Grades Handler
  const handleUpdateGrades = async (data: UpdateGradesInput) => {
    setLoading("grade");
    try {
      const response = await fetch(`${API_BASE_URL}/${data.studentId}/grades`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseCode: data.courseCode,
          courseName: data.courseName,
          credits: data.credits,
          grade: data.grade,
        }),
      });

      if (!response.ok) throw new Error("Failed to update grades");

      const result = await response.json();
      toast.success(`Added grade for course ${data.courseCode}! GPA: ${result.gpa.toFixed(2)}`);
      gradeForm.reset();
    } catch (err: any) {
      toast.error(err.message || "Error updating grades");
    } finally {
      setLoading(null);
    }
  };

  // Get Transcript Handler with section filtering
  const handleGetTranscript = async (data: ViewTranscriptInput) => {
    setLoading("search");
    try {
      // First check if student is in selected section
      if (data.sectionId) {
        const token = localStorage.getItem("bearer_token");
        const sectionStudentsResponse = await fetch(`/api/sections/${data.sectionId}/students`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (sectionStudentsResponse.ok) {
          const sectionStudents = await sectionStudentsResponse.json();
          const isInSection = sectionStudents.some((s: any) => s.studentId === data.studentId);
          
          if (!isInSection) {
            toast.error("Access denied: Student not in this section");
            setTranscript(null);
            setLoading(null);
            return;
          }
        }
      }

      const response = await fetch(`${API_BASE_URL}/${data.studentId}`);

      if (!response.ok) throw new Error("Transcript not found");

      const result = await response.json();
      
      // Fetch student's sections
      const token = localStorage.getItem("bearer_token");
      const sectionsResponse = await fetch(`/api/students/${data.studentId}/sections`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (sectionsResponse.ok) {
        const studentSections = await sectionsResponse.json();
        result.sections = studentSections;
      }
      
      setTranscript(result);
      toast.success("Transcript retrieved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Error fetching transcript");
      setTranscript(null);
    } finally {
      setLoading(null);
    }
  };

  // Load Analytics Handler
  const handleLoadAnalytics = async () => {
    setLoading("analytics");
    try {
      const [topPerformers, avgGPA, groupedByCourse] = await Promise.all([
        fetch(`${API_BASE_URL}/top-performers?n=5`).then((r) => r.json()),
        fetch(`${API_BASE_URL}/average-gpa`).then((r) => r.json()),
        fetch(`${API_BASE_URL}/group-by-course`).then((r) => r.json()),
      ]);

      setAnalytics({ topPerformers, avgGPA, groupedByCourse });
      toast.success("Analytics loaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Error loading analytics");
    } finally {
      setLoading(null);
    }
  };

  // Get current section name
  const getCurrentSectionName = () => {
    if (selectedSectionId === "all") return "All Sections";
    const section = sections.find(s => s.id.toString() === selectedSectionId);
    return section ? `${section.sectionCode}: ${section.name}` : "Unknown Section";
  };

  // Prepare data for TranscriptAnalyticsDashboard
  const quickActionsData = [
    {
      icon: FileText,
      title: "Create",
      description: "New Transcript",
      onClick: () => setActiveTab("create"),
    },
    {
      icon: FileText,
      title: "View",
      description: "Records",
      onClick: () => setActiveTab("view"),
    },
    {
      icon: Edit,
      title: "Update",
      description: "Grades",
      onClick: () => setActiveTab("update"),
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Reports",
      onClick: () => handleLoadAnalytics(),
    },
  ];

  const recentActivityData = analytics?.topPerformers
    ? analytics.topPerformers.slice(0, 3).map((student: any) => ({
        icon: <StudentIcon letter={student.studentName.charAt(0)} className="bg-purple-600" />,
        title: student.studentName,
        time: `ID: ${student.studentId}`,
        gpa: student.gpa || 0,
      }))
    : [
        {
          icon: <StudentIcon letter="J" className="bg-purple-600" />,
          title: "John Doe",
          time: "2 hours ago",
          gpa: 3.85,
        },
        {
          icon: <StudentIcon letter="A" className="bg-green-600" />,
          title: "Alice Smith",
          time: "1 day ago",
          gpa: 3.92,
        },
        {
          icon: <StudentIcon letter="B" className="bg-blue-600" />,
          title: "Bob Johnson",
          time: "2 days ago",
          gpa: 3.67,
        },
      ];

  const gradingServicesData = [
    {
      icon: Calculator,
      title: "CGPA System",
      description: "Cumulative Grade Point Average",
      isPremium: true,
    },
    {
      icon: Award,
      title: "Letter Grades",
      description: "A, B+, B, C+, C grade system",
      hasAction: true,
    },
    {
      icon: Percent,
      title: "Percentage",
      description: "100-point percentage scale",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Performance metrics & insights",
      hasAction: true,
    },
  ];

  // Tab transition variants
  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b border-purple-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
                Transcript Management Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* User Info with Role Badge */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    {session.user.name || session.user.email}
                  </span>
                  {role && (
                    <Badge className={`${getRoleBadgeColor(role)} text-white text-xs px-2 py-0 mt-0.5`}>
                      {getRoleDisplayName(role)}
                    </Badge>
                  )}
                </div>
              </div>
              {/* Sign Out Button */}
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="border-purple-200 hover:bg-purple-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              {/* Back to Home */}
              <Link href="/">
                <Button variant="outline" className="border-purple-200 hover:bg-purple-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Section Selector */}
        <Card className="p-6 mb-6 bg-white dark:bg-gray-800 shadow-lg border-2 border-blue-100 dark:border-blue-900/50">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Section Filter
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select a section to filter students and transcripts
              </p>
            </div>
            <div className="flex items-center gap-3">
              {loadingSections ? (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading sections...</span>
                </div>
              ) : (
                <>
                  <Label htmlFor="section-select" className="text-gray-700 dark:text-gray-300 font-medium">
                    Active Section:
                  </Label>
                  <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
                    <SelectTrigger id="section-select" className="w-[280px] border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sections</SelectItem>
                      {sections.map((section) => (
                        <SelectItem key={section.id} value={section.id.toString()}>
                          {section.sectionCode}: {section.name} ({section.studentCount} students)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Badge className="bg-blue-600 text-white px-3 py-1">
                    {getCurrentSectionName()}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tabs List */}
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1 bg-white dark:bg-gray-800 shadow-lg border border-purple-100 dark:border-gray-700">
            <TabsTrigger
              value="create"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white py-3 px-4 text-sm font-medium"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Create Transcript</span>
              <span className="sm:hidden">Create</span>
            </TabsTrigger>
            <TabsTrigger
              value="update"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white py-3 px-4 text-sm font-medium"
            >
              <Edit className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Update Grades</span>
              <span className="sm:hidden">Update</span>
            </TabsTrigger>
            <TabsTrigger
              value="view"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white py-3 px-4 text-sm font-medium"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">View Transcript</span>
              <span className="sm:hidden">View</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-orange-600 data-[state=active]:text-white py-3 px-4 text-sm font-medium"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger
              value="courses"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white py-3 px-4 text-sm font-medium"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Courses</span>
              <span className="sm:hidden">Courses</span>
            </TabsTrigger>
            <TabsTrigger
              value="sections"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-3 px-4 text-sm font-medium"
            >
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Sections</span>
              <span className="sm:hidden">Sections</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Create New Transcript */}
          <AnimatePresence mode="wait">
            <TabsContent value="create" className="space-y-6">
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Card className="p-8 bg-white dark:bg-gray-800 shadow-xl border-2 border-purple-100 dark:border-purple-900/50">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400 flex items-center">
                      <Badge className="mr-3 bg-purple-600 text-white px-3 py-1">1</Badge>
                      Create New Transcript
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Enter student information to create a new transcript record
                      {selectedSectionId !== "all" && (
                        <span className="block mt-1 text-blue-600 dark:text-blue-400 font-medium">
                          Will be assigned to: {getCurrentSectionName()}
                        </span>
                      )}
                    </p>
                  </div>

                  <form onSubmit={createForm.handleSubmit(handleCreateTranscript)} className="space-y-5">
                    <div>
                      <Label htmlFor="create-studentId" className="text-gray-700 dark:text-gray-300">
                        Student ID *
                      </Label>
                      <Input
                        id="create-studentId"
                        {...createForm.register("studentId")}
                        placeholder="e.g., S12345"
                        className="mt-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                      {createForm.formState.errors.studentId && (
                        <p className="text-red-500 text-sm mt-1">
                          {createForm.formState.errors.studentId.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="create-studentName" className="text-gray-700 dark:text-gray-300">
                        Student Name *
                      </Label>
                      <Input
                        id="create-studentName"
                        {...createForm.register("studentName")}
                        placeholder="e.g., John Doe"
                        className="mt-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                      {createForm.formState.errors.studentName && (
                        <p className="text-red-500 text-sm mt-1">
                          {createForm.formState.errors.studentName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="create-email" className="text-gray-700 dark:text-gray-300">
                        Email *
                      </Label>
                      <Input
                        id="create-email"
                        type="email"
                        {...createForm.register("email")}
                        placeholder="e.g., john.doe@university.edu"
                        className="mt-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                      {createForm.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {createForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="create-major" className="text-gray-700 dark:text-gray-300">
                        Major *
                      </Label>
                      <Select
                        onValueChange={(value) => createForm.setValue("major", value)}
                        defaultValue={createForm.watch("major")}
                      >
                        <SelectTrigger className="mt-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500">
                          <SelectValue placeholder="Select major" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="Physics">Physics</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Business Administration">Business Administration</SelectItem>
                          <SelectItem value="Biology">Biology</SelectItem>
                        </SelectContent>
                      </Select>
                      {createForm.formState.errors.major && (
                        <p className="text-red-500 text-sm mt-1">
                          {createForm.formState.errors.major.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                      disabled={loading === "create"}
                    >
                      {loading === "create" ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creating Transcript...
                        </>
                      ) : (
                        "Create Transcript"
                      )}
                    </Button>
                  </form>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>

          {/* Tab 2: Update Grades */}
          <AnimatePresence mode="wait">
            <TabsContent value="update" className="space-y-6">
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Card className="p-8 bg-white dark:bg-gray-800 shadow-xl border-2 border-green-100 dark:border-green-900/50">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 flex items-center">
                      <Badge className="mr-3 bg-green-600 text-white px-3 py-1">2</Badge>
                      Update Grades
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Add or update course grades for an existing student (select from KL University courses)
                      {selectedSectionId !== "all" && (
                        <span className="block mt-1 text-blue-600 dark:text-blue-400 font-medium">
                          Filtered by: {getCurrentSectionName()}
                        </span>
                      )}
                    </p>
                  </div>

                  <form onSubmit={gradeForm.handleSubmit(handleUpdateGrades)} className="space-y-5">
                    <div>
                      <Label htmlFor="grade-studentId" className="text-gray-700 dark:text-gray-300">
                        Student ID *
                      </Label>
                      <Input
                        id="grade-studentId"
                        {...gradeForm.register("studentId")}
                        placeholder="e.g., S12345"
                        className="mt-1 border-green-200 focus:border-green-500 focus:ring-green-500"
                      />
                      {gradeForm.formState.errors.studentId && (
                        <p className="text-red-500 text-sm mt-1">
                          {gradeForm.formState.errors.studentId.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="grade-courseCode" className="text-gray-700 dark:text-gray-300">
                        Course Code * <span className="text-xs text-gray-500">(e.g., 24UC0022 - SOCIAL IMMERSIVE LEARNING)</span>
                      </Label>
                      <Input
                        id="grade-courseCode"
                        {...gradeForm.register("courseCode")}
                        placeholder="e.g., 24UC0022"
                        className="mt-1 border-green-200 focus:border-green-500 focus:ring-green-500"
                      />
                      {gradeForm.formState.errors.courseCode && (
                        <p className="text-red-500 text-sm mt-1">
                          {gradeForm.formState.errors.courseCode.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="grade-courseName" className="text-gray-700 dark:text-gray-300">
                        Course Name * <span className="text-xs text-gray-500">(e.g., FRONT END DEVELOPMENT FRAMEWORKS)</span>
                      </Label>
                      <Input
                        id="grade-courseName"
                        {...gradeForm.register("courseName")}
                        placeholder="e.g., COMPUTER NETWORKS"
                        className="mt-1 border-green-200 focus:border-green-500 focus:ring-green-500"
                      />
                      {gradeForm.formState.errors.courseName && (
                        <p className="text-red-500 text-sm mt-1">
                          {gradeForm.formState.errors.courseName.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="grade-credits" className="text-gray-700 dark:text-gray-300">
                          Credits *
                        </Label>
                        <Input
                          id="grade-credits"
                          type="number"
                          {...gradeForm.register("credits")}
                          placeholder="3"
                          min="1"
                          max="6"
                          className="mt-1 border-green-200 focus:border-green-500 focus:ring-green-500"
                        />
                        {gradeForm.formState.errors.credits && (
                          <p className="text-red-500 text-sm mt-1">
                            {gradeForm.formState.errors.credits.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="grade-grade" className="text-gray-700 dark:text-gray-300">
                          Grade *
                        </Label>
                        <Input
                          id="grade-grade"
                          {...gradeForm.register("grade")}
                          placeholder="A, B+, C, etc."
                          maxLength={2}
                          className="mt-1 border-green-200 focus:border-green-500 focus:ring-green-500 uppercase"
                          onChange={(e) => {
                            e.target.value = e.target.value.toUpperCase();
                            gradeForm.setValue("grade", e.target.value);
                          }}
                        />
                        {gradeForm.formState.errors.grade && (
                          <p className="text-red-500 text-sm mt-1">
                            {gradeForm.formState.errors.grade.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                      disabled={loading === "grade"}
                    >
                      {loading === "grade" ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Updating Grades...
                        </>
                      ) : (
                        "Update Grades"
                      )}
                    </Button>
                  </form>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>

          {/* Tab 3: View Transcript */}
          <AnimatePresence mode="wait">
            <TabsContent value="view" className="space-y-6">
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Card className="p-8 bg-white dark:bg-gray-800 shadow-xl border-2 border-purple-100 dark:border-purple-900/50">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400 flex items-center">
                      <Badge className="mr-3 bg-purple-600 text-white px-3 py-1">3</Badge>
                      View Transcript
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Retrieve and display a student's complete transcript
                      {selectedSectionId !== "all" && (
                        <span className="block mt-1 text-blue-600 dark:text-blue-400 font-medium">
                          Filtered by: {getCurrentSectionName()}
                        </span>
                      )}
                    </p>
                  </div>

                  <form onSubmit={viewForm.handleSubmit(handleGetTranscript)} className="space-y-5">
                    <div>
                      <Label htmlFor="search-studentId" className="text-gray-700 dark:text-gray-300">
                        Student ID *
                      </Label>
                      <Input
                        id="search-studentId"
                        {...viewForm.register("studentId")}
                        placeholder="e.g., S12345"
                        className="mt-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                      {viewForm.formState.errors.studentId && (
                        <p className="text-red-500 text-sm mt-1">
                          {viewForm.formState.errors.studentId.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                      disabled={loading === "search"}
                    >
                      {loading === "search" ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        "Get Transcript"
                      )}
                    </Button>
                  </form>

                  {/* Display Transcript */}
                  {transcript && (
                    <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                          {transcript.studentName}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-600 text-white text-lg px-4 py-2">
                            GPA: {transcript.gpa?.toFixed(2) || "N/A"}
                          </Badge>
                        </div>
                      </div>

                      {/* Student Sections */}
                      {transcript.sections && transcript.sections.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Enrolled Sections:</p>
                          <div className="flex flex-wrap gap-2">
                            {transcript.sections.map((section: any) => (
                              <Badge key={section.id} className="bg-blue-600 text-white">
                                {section.sectionCode}: {section.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Student ID</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {transcript.studentId}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {transcript.email}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow md:col-span-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Major</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {transcript.major}
                          </p>
                        </div>
                      </div>

                      {transcript.courses && transcript.courses.length > 0 && (
                        <div>
                          <h4 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-4">
                            Course History
                          </h4>
                          <div className="space-y-3">
                            {transcript.courses.map((course: any, idx: number) => (
                              <div
                                key={idx}
                                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-purple-500"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                      {course.courseCode} - {course.courseName}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                      {course.credits} Credits
                                    </p>
                                  </div>
                                  <Badge className="bg-purple-600 text-white text-lg px-4 py-2">
                                    {course.grade}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>

          {/* Tab 4: Analytics Dashboard */}
          <AnimatePresence mode="wait">
            <TabsContent value="analytics" className="space-y-6">
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Interactive Dashboard Component */}
                <TranscriptAnalyticsDashboard
                  quickActions={quickActionsData}
                  recentActivity={recentActivityData}
                  gradingServices={gradingServicesData}
                />

                {/* Load Analytics Button */}
                <Card className="p-8 bg-white dark:bg-gray-800 shadow-xl border-2 border-orange-100 dark:border-orange-900/50 mt-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-400 flex items-center">
                      <Badge className="mr-3 bg-orange-600 text-white px-3 py-1">4</Badge>
                      System Analytics
                      {selectedSectionId !== "all" && (
                        <Badge className="ml-3 bg-blue-600 text-white">
                          {getCurrentSectionName()}
                        </Badge>
                      )}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      View comprehensive analytics and performance metrics from the backend
                    </p>
                  </div>

                  <Button
                    onClick={handleLoadAnalytics}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all mb-8"
                    disabled={loading === "analytics"}
                  >
                    {loading === "analytics" ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Loading Analytics...
                      </>
                    ) : (
                      "Load Analytics"
                    )}
                  </Button>

                  {analytics && (
                    <div className="space-y-6">
                      {/* Average GPA Card */}
                      <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-8 rounded-xl shadow-xl text-white">
                        <h4 className="text-lg font-semibold opacity-90 mb-2">Average GPA</h4>
                        <p className="text-5xl font-bold">{analytics.avgGPA?.toFixed(2) || "N/A"}</p>
                        <p className="text-sm opacity-80 mt-2">Across all students</p>
                      </div>

                      {/* Top Performers */}
                      {analytics.topPerformers && analytics.topPerformers.length > 0 && (
                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border-2 border-green-200 dark:border-green-800">
                          <h4 className="text-xl font-bold text-green-900 dark:text-green-100 mb-4">
                            🏆 Top Performers (GPA ≥ 3.5)
                          </h4>
                          <div className="space-y-3">
                            {analytics.topPerformers.map((student: any, idx: number) => (
                              <div
                                key={idx}
                                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between"
                              >
                                <div>
                                  <p className="font-bold text-gray-900 dark:text-white text-lg">
                                    {student.studentName}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    ID: {student.studentId}
                                  </p>
                                </div>
                                <Badge className="bg-green-600 text-white text-lg px-4 py-2">
                                  {student.gpa?.toFixed(2)}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Grouped by Course */}
                      {analytics.groupedByCourse && Object.keys(analytics.groupedByCourse).length > 0 && (
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                          <h4 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-4">
                            📚 Students by Course
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                            {Object.entries(analytics.groupedByCourse).map(
                              ([course, students]: [string, any]) => (
                                <div
                                  key={course}
                                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
                                >
                                  <p className="font-bold text-gray-900 dark:text-white mb-2">
                                    {course}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                                      Enrolled Students
                                    </span>
                                    <Badge className="bg-purple-600 text-white">
                                      {Array.isArray(students) ? students.length : 0}
                                    </Badge>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>

          {/* Tab 5: Course Management */}
          <AnimatePresence mode="wait">
            <TabsContent value="courses" className="space-y-6">
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <CourseManagement />
              </motion.div>
            </TabsContent>
          </AnimatePresence>

          {/* Tab 6: Section Management */}
          <AnimatePresence mode="wait">
            <TabsContent value="sections" className="space-y-6">
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <SectionManagement />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </main>
    </div>
  );
}