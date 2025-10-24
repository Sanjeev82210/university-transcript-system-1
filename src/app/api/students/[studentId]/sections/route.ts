import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { studentSection, section, teacher } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await context.params;

    // Validate studentId
    if (!studentId || studentId.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Student ID is required',
          code: 'MISSING_STUDENT_ID' 
        },
        { status: 400 }
      );
    }

    // Query all enrollments for the student
    const enrollments = await db
      .select()
      .from(studentSection)
      .where(eq(studentSection.studentId, studentId));

    // If no enrollments, return empty array
    if (enrollments.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch section and teacher details for each enrollment
    const sectionsWithDetails = await Promise.all(
      enrollments.map(async (enrollment) => {
        // Get section details
        const sectionDetails = await db
          .select()
          .from(section)
          .where(eq(section.id, enrollment.sectionId))
          .limit(1);

        if (sectionDetails.length === 0) {
          return null;
        }

        const sectionData = sectionDetails[0];

        // Get teacher details
        const teacherDetails = await db
          .select()
          .from(teacher)
          .where(eq(teacher.id, sectionData.teacherId))
          .limit(1);

        const teacherData = teacherDetails.length > 0 ? teacherDetails[0] : null;

        return {
          id: sectionData.id,
          sectionCode: sectionData.sectionCode,
          name: sectionData.name,
          teacherName: teacherData ? teacherData.name : null,
          teacherId: sectionData.teacherId,
          enrolledAt: enrollment.enrolledAt
        };
      })
    );

    // Filter out null values (sections that weren't found)
    const validSections = sectionsWithDetails.filter(section => section !== null);

    return NextResponse.json(validSections);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}