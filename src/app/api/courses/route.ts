import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { courses, teacher, section } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED' 
      }, { status: 401 });
    }

    if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
      return NextResponse.json({ 
        error: 'Only teachers and administrators can create courses',
        code: 'UNAUTHORIZED_ROLE' 
      }, { status: 403 });
    }

    const requestBody = await request.json();
    const { courseCode, courseName, sectionId } = requestBody;

    if ('createdById' in requestBody) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    if (!courseCode) {
      return NextResponse.json({ 
        error: 'courseCode is required',
        code: 'MISSING_COURSE_CODE' 
      }, { status: 400 });
    }

    if (!courseName) {
      return NextResponse.json({ 
        error: 'courseName is required',
        code: 'MISSING_COURSE_NAME' 
      }, { status: 400 });
    }

    const teacherRecord = await db.select()
      .from(teacher)
      .where(eq(teacher.userId, user.id))
      .limit(1);

    if (teacherRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Teacher record not found for current user',
        code: 'TEACHER_NOT_FOUND' 
      }, { status: 400 });
    }

    const existingCourse = await db.select()
      .from(courses)
      .where(eq(courses.courseCode, courseCode.trim()))
      .limit(1);

    if (existingCourse.length > 0) {
      return NextResponse.json({ 
        error: 'Course code already exists',
        code: 'DUPLICATE_COURSE_CODE' 
      }, { status: 400 });
    }

    if (sectionId) {
      const sectionRecord = await db.select()
        .from(section)
        .where(eq(section.id, parseInt(sectionId)))
        .limit(1);

      if (sectionRecord.length === 0) {
        return NextResponse.json({ 
          error: 'Section not found',
          code: 'SECTION_NOT_FOUND' 
        }, { status: 400 });
      }
    }

    const newCourse = await db.insert(courses)
      .values({
        courseCode: courseCode.trim(),
        courseName: courseName.trim(),
        sectionId: sectionId ? parseInt(sectionId) : null,
        teacherId: teacherRecord[0].id,
        createdById: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newCourse[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherIdParam = searchParams.get('teacherId');
    const sectionIdParam = searchParams.get('sectionId');

    let query = db.select({
      id: courses.id,
      courseCode: courses.courseCode,
      courseName: courses.courseName,
      sectionId: courses.sectionId,
      sectionName: section.name,
      teacherId: courses.teacherId,
      teacherName: teacher.name,
      createdAt: courses.createdAt,
      updatedAt: courses.updatedAt
    })
    .from(courses)
    .leftJoin(teacher, eq(courses.teacherId, teacher.id))
    .leftJoin(section, eq(courses.sectionId, section.id));

    const conditions = [];

    if (teacherIdParam) {
      const teacherId = parseInt(teacherIdParam);
      if (isNaN(teacherId)) {
        return NextResponse.json({ 
          error: 'Invalid teacherId parameter',
          code: 'INVALID_TEACHER_ID' 
        }, { status: 400 });
      }
      conditions.push(eq(courses.teacherId, teacherId));
    }

    if (sectionIdParam) {
      const sectionId = parseInt(sectionIdParam);
      if (isNaN(sectionId)) {
        return NextResponse.json({ 
          error: 'Invalid sectionId parameter',
          code: 'INVALID_SECTION_ID' 
        }, { status: 400 });
      }
      conditions.push(eq(courses.sectionId, sectionId));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const results = await query;

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}