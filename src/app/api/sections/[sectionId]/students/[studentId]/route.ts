import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { studentSection } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ sectionId: string; studentId: string }> }
) {
  try {
    const params = await context.params;
    const { sectionId, studentId } = params;

    // Validate sectionId
    if (!sectionId || isNaN(parseInt(sectionId))) {
      return NextResponse.json(
        { 
          error: 'Valid section ID is required',
          code: 'INVALID_SECTION_ID' 
        },
        { status: 400 }
      );
    }

    // Validate studentId
    if (!studentId || studentId.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Valid student ID is required',
          code: 'INVALID_STUDENT_ID' 
        },
        { status: 400 }
      );
    }

    const parsedSectionId = parseInt(sectionId);

    // Check if enrollment exists
    const existingEnrollment = await db
      .select()
      .from(studentSection)
      .where(
        and(
          eq(studentSection.sectionId, parsedSectionId),
          eq(studentSection.studentId, studentId)
        )
      )
      .limit(1);

    if (existingEnrollment.length === 0) {
      return NextResponse.json(
        { 
          error: 'Enrollment not found',
          code: 'ENROLLMENT_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Delete the enrollment
    await db
      .delete(studentSection)
      .where(
        and(
          eq(studentSection.sectionId, parsedSectionId),
          eq(studentSection.studentId, studentId)
        )
      )
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: 'Student removed from section successfully'
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