import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { section, teacher, studentSection } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTHENTICATION_REQUIRED' },
        { status: 401 }
      );
    }

    // Check if user is TEACHER or ADMIN
    if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only teachers and administrators can create sections', code: 'UNAUTHORIZED_ROLE' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { sectionCode, name } = body;

    // Validate required fields
    if (!sectionCode) {
      return NextResponse.json(
        { error: 'sectionCode is required', code: 'MISSING_SECTION_CODE' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    // Get teacherId from session user
    const teacherRecord = await db.select()
      .from(teacher)
      .where(eq(teacher.userId, user.id))
      .limit(1);

    if (teacherRecord.length === 0) {
      return NextResponse.json(
        { error: 'Teacher record not found for current user', code: 'TEACHER_NOT_FOUND' },
        { status: 400 }
      );
    }

    const teacherId = teacherRecord[0].id;

    // Check if sectionCode already exists
    const existingSection = await db
      .select()
      .from(section)
      .where(eq(section.sectionCode, sectionCode.trim()))
      .limit(1);

    if (existingSection.length > 0) {
      return NextResponse.json(
        { error: 'Section code already exists', code: 'DUPLICATE_SECTION_CODE' },
        { status: 400 }
      );
    }

    // Create new section
    const newSection = await db
      .insert(section)
      .values({
        sectionCode: sectionCode.trim(),
        name: name.trim(),
        teacherId: teacherId,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newSection[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const teacherIdParam = searchParams.get('teacherId');

    // Build base query with teacher join
    let query = db
      .select({
        id: section.id,
        sectionCode: section.sectionCode,
        name: section.name,
        teacherId: section.teacherId,
        teacherName: teacher.name,
        createdAt: section.createdAt,
      })
      .from(section)
      .leftJoin(teacher, eq(section.teacherId, teacher.id));

    // Apply teacherId filter if provided
    if (teacherIdParam) {
      const teacherIdInt = parseInt(teacherIdParam);
      if (isNaN(teacherIdInt)) {
        return NextResponse.json(
          { error: 'Invalid teacherId parameter', code: 'INVALID_TEACHER_ID' },
          { status: 400 }
        );
      }
      query = query.where(eq(section.teacherId, teacherIdInt)) as typeof query;
    }

    const sections = await query;

    // Get student counts for all sections
    const sectionIds = sections.map(s => s.id);
    
    let studentCounts: { sectionId: number; count: number }[] = [];
    
    if (sectionIds.length > 0) {
      // Get student counts by grouping
      const countQuery = await db
        .select({
          sectionId: studentSection.sectionId,
          count: sql<number>`COUNT(*)`.as('count'),
        })
        .from(studentSection)
        .groupBy(studentSection.sectionId);
      
      studentCounts = countQuery.map(row => ({
        sectionId: row.sectionId,
        count: Number(row.count),
      }));
    }

    // Map student counts to sections
    const sectionsWithCounts = sections.map(s => ({
      id: s.id,
      sectionCode: s.sectionCode,
      name: s.name,
      teacherId: s.teacherId,
      teacherName: s.teacherName,
      studentCount: studentCounts.find(sc => sc.sectionId === s.id)?.count || 0,
      createdAt: s.createdAt,
    }));

    return NextResponse.json(sectionsWithCounts, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}