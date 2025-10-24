/**
 * Role-Based Access Control (RBAC) Utilities
 * Defines roles and permission checking for the University Grading System
 */

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export const USER_ROLES = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN',
} as const;

/**
 * Check if user has admin role
 */
export function isAdmin(role?: string | null): boolean {
  return role === USER_ROLES.ADMIN;
}

/**
 * Check if user has teacher role
 */
export function isTeacher(role?: string | null): boolean {
  return role === USER_ROLES.TEACHER;
}

/**
 * Check if user has teacher or admin role
 */
export function isTeacherOrAdmin(role?: string | null): boolean {
  return role === USER_ROLES.TEACHER || role === USER_ROLES.ADMIN;
}

/**
 * Check if user can create courses/sections
 * Teachers and Admins can create
 */
export function canCreateCourses(role?: string | null): boolean {
  return isTeacherOrAdmin(role);
}

/**
 * Check if user can delete courses/sections
 * Only Admins can delete
 */
export function canDeleteCourses(role?: string | null): boolean {
  return isAdmin(role);
}

/**
 * Check if user can edit critical fields
 * Only Admins can edit critical data
 */
export function canEditCriticalFields(role?: string | null): boolean {
  return isAdmin(role);
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role?: string | null): string {
  switch (role) {
    case USER_ROLES.ADMIN:
      return 'Administrator';
    case USER_ROLES.TEACHER:
      return 'Teacher';
    case USER_ROLES.STUDENT:
      return 'Student';
    default:
      return 'Unknown';
  }
}

/**
 * Get role badge color
 */
export function getRoleBadgeColor(role?: string | null): string {
  switch (role) {
    case USER_ROLES.ADMIN:
      return 'bg-red-600';
    case USER_ROLES.TEACHER:
      return 'bg-blue-600';
    case USER_ROLES.STUDENT:
      return 'bg-green-600';
    default:
      return 'bg-gray-600';
  }
}
