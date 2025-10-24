import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { teacher, section } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication check
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTHENTICATION_REQUIRED' },
        { status: 401 }
      );
    }

    // Extract and validate ID from dynamic route parameter
    const { id } = await context.params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid teacher ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const teacherId = parseInt(id);

    // First, get the teacher by ID and ensure it belongs to the authenticated user
    const teacherResult = await db
      .select()
      .from(teacher)
      .where(eq(teacher.id, teacherId))
      .limit(1);

    if (teacherResult.length === 0) {
      return NextResponse.json(
        { error: 'Teacher not found', code: 'TEACHER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const teacherRecord = teacherResult[0];

    // Verify the teacher belongs to the authenticated user
    if (teacherRecord.userId !== user.id) {
      return NextResponse.json(
        { error: 'Teacher not found', code: 'TEACHER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Get all sections for this teacher
    const sections = await db
      .select({
        id: section.id,
        sectionCode: section.sectionCode,
        name: section.name,
        createdAt: section.createdAt,
      })
      .from(section)
      .where(eq(section.teacherId, teacherId));

    // Combine teacher data with sections
    const response = {
      id: teacherRecord.id,
      name: teacherRecord.name,
      email: teacherRecord.email,
      userId: teacherRecord.userId,
      createdAt: teacherRecord.createdAt,
      sections: sections,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('GET teacher error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_SERVER_ERROR' 
      },
      { status: 500 }
    );
  }
}