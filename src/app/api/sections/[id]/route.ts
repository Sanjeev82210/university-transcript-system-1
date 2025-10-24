import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { section, teacher, studentSection } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Validate ID format
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid section ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    const sectionId = parseInt(id);

    // Query section by ID
    const sectionResult = await db
      .select()
      .from(section)
      .where(eq(section.id, sectionId))
      .limit(1);

    if (sectionResult.length === 0) {
      return NextResponse.json(
        { 
          error: 'Section not found',
          code: 'SECTION_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    const sectionData = sectionResult[0];

    // Query teacher details
    let teacherData = null;
    if (sectionData.teacherId) {
      const teacherResult = await db
        .select({
          id: teacher.id,
          name: teacher.name,
          email: teacher.email
        })
        .from(teacher)
        .where(eq(teacher.id, sectionData.teacherId))
        .limit(1);

      if (teacherResult.length > 0) {
        teacherData = teacherResult[0];
      }
    }

    // Query all students enrolled in this section
    const studentsResult = await db
      .select({
        studentId: studentSection.studentId,
        enrolledAt: studentSection.enrolledAt
      })
      .from(studentSection)
      .where(eq(studentSection.sectionId, sectionId));

    // Combine results into nested response
    const response = {
      id: sectionData.id,
      sectionCode: sectionData.sectionCode,
      name: sectionData.name,
      createdAt: sectionData.createdAt,
      teacher: teacherData,
      students: studentsResult
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('GET section details error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}