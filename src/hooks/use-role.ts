/**
 * Custom hook for role-based access control
 * Provides easy access to user role and permission checks
 */

import { useSession } from "@/lib/auth-client";
import { isAdmin, isTeacher, isTeacherOrAdmin, canCreateCourses, canDeleteCourses, canEditCriticalFields } from "@/lib/rbac";

export function useRole() {
  const { data: session, isPending } = useSession();
  
  const userRole = session?.user?.role || null;

  return {
    role: userRole,
    isLoading: isPending,
    isAdmin: isAdmin(userRole),
    isTeacher: isTeacher(userRole),
    isTeacherOrAdmin: isTeacherOrAdmin(userRole),
    canCreateCourses: canCreateCourses(userRole),
    canDeleteCourses: canDeleteCourses(userRole),
    canEditCriticalFields: canEditCriticalFields(userRole),
  };
}
