import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { studentSection, section } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ sectionId: string }> }
) {
  try {
    const { sectionId } = await context.params;
    
    // Validate sectionId is a valid integer
    if (!sectionId || isNaN(parseInt(sectionId))) {
      return NextResponse.json(
        { 
          error: 'Valid section ID is required',
          code: 'INVALID_SECTION_ID'
        },
        { status: 400 }
      );
    }

    const parsedSectionId = parseInt(sectionId);

    // Parse request body
    const body = await request.json();
    const { studentId } = body;

    // Validate required fields
    if (!studentId || typeof studentId !== 'string' || studentId.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Student ID is required',
          code: 'MISSING_STUDENT_ID'
        },
        { status: 400 }
      );
    }

    // Check if section exists
    const existingSection = await db.select()
      .from(section)
      .where(eq(section.id, parsedSectionId))
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

    // Check if student is already enrolled in this section
    const existingEnrollment = await db.select()
      .from(studentSection)
      .where(
        and(
          eq(studentSection.sectionId, parsedSectionId),
          eq(studentSection.studentId, studentId.trim())
        )
      )
      .limit(1);

    if (existingEnrollment.length > 0) {
      return NextResponse.json(
        { 
          error: 'Student is already enrolled in this section',
          code: 'ALREADY_ENROLLED'
        },
        { status: 400 }
      );
    }

    // Enroll student in section
    const enrollment = await db.insert(studentSection)
      .values({
        studentId: studentId.trim(),
        sectionId: parsedSectionId,
        enrolledAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: 'Student enrolled successfully',
        enrollment: enrollment[0]
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ sectionId: string }> }
) {
  try {
    const { sectionId } = await context.params;
    
    // Validate sectionId is a valid integer
    if (!sectionId || isNaN(parseInt(sectionId))) {
      return NextResponse.json(
        { 
          error: 'Valid section ID is required',
          code: 'INVALID_SECTION_ID'
        },
        { status: 400 }
      );
    }

    const parsedSectionId = parseInt(sectionId);

    // Get all students in the section
    const students = await db.select({
      studentId: studentSection.studentId,
      enrolledAt: studentSection.enrolledAt
    })
      .from(studentSection)
      .where(eq(studentSection.sectionId, parsedSectionId));

    return NextResponse.json(students, { status: 200 });

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