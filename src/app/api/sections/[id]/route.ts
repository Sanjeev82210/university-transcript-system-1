import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { section, teacher, studentSection } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

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

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only administrators can delete sections' },
        { status: 403 }
      );
    }

    // Extract and validate ID from params
    const { id } = await context.params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    const sectionId = parseInt(id);

    // Check if section exists
    const existingSection = await db
      .select()
      .from(section)
      .where(eq(section.id, sectionId))
      .limit(1);

    if (existingSection.length === 0) {
      return NextResponse.json(
        { 
          error: 'Section not found',
          code: 'SECTION_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // First delete all student enrollments (cascade delete)
    const deletedEnrollments = await db
      .delete(studentSection)
      .where(eq(studentSection.sectionId, sectionId))
      .returning();

    // Then delete the section
    const deletedSection = await db
      .delete(section)
      .where(eq(section.id, sectionId))
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: 'Section deleted successfully',
        deletedSection: deletedSection[0],
        deletedEnrollments: deletedEnrollments.length
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}